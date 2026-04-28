"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { generateDeliverySchedule } from "@/lib/planEngine";
import { sendShippingNotice, sendOrderConfirmation } from "@/lib/email";

async function requireUserId() {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) redirect("/auth/logga-in");
  return id;
}

/**
 * Create a new subscription + delivery schedule for the current user.
 * Called from the checkout flow / shop when user selects a plan.
 */
export async function createSubscription(formData: FormData) {
  const userId = await requireUserId();
  const planId = String(formData.get("planId") ?? "").trim();
  const startStrengthMg = Number(formData.get("startStrengthMg") ?? 20);
  const durationMonths = Number(formData.get("durationMonths") ?? 6);
  const quantityCans = Number(formData.get("quantityCans") ?? 1);

  const plan = await prisma.plan.findFirst({ where: { id: planId, visible: true } });
  if (!plan) redirect("/shop?fel=plan");

  const slots = generateDeliverySchedule({
    startStrengthMg,
    durationMonths,
    quantityCans,
    startDate: new Date(),
  });

  const subscription = await prisma.subscription.create({
    data: {
      userId,
      planId,
      status: "PENDING",
      startStrengthMg,
      durationMonths,
      nextDeliveryDate: slots[0]?.scheduledDate ?? null,
      deliveries: {
        create: slots.map((s) => ({
          deliveryIndex: s.deliveryIndex,
          strengthMg: s.strengthMg,
          quantityCans: s.quantityCans,
          scheduledDate: s.scheduledDate,
          status: "PENDING",
        })),
      },
    },
  });

  // Also create a pending order
  const totalAmountOre = (plan.priceLabel.match(/\d+/) ? parseInt(plan.priceLabel.match(/\d+/)![0], 10) : 0) * durationMonths * 100;

  await prisma.order.create({
    data: {
      userId,
      subscriptionId: subscription.id,
      status: "PENDING",
      totalAmountOre,
      currency: "SEK",
      billingEmail: (await prisma.user.findUnique({ where: { id: userId }, select: { email: true } }))?.email ?? "",
    },
  });

  // Link plan to user profile
  await prisma.user.update({
    where: { id: userId },
    data: { planId },
  });

  revalidatePath("/konto", "layout");
  redirect("/konto/prenumeration?startad=1");
}

/**
 * Pause or resume the active subscription.
 */
export async function pauseSubscription(formData: FormData) {
  const userId = await requireUserId();
  const subscriptionId = String(formData.get("subscriptionId") ?? "").trim();
  const pause = formData.get("pause") === "on";
  const untilRaw = String(formData.get("pausedUntil") ?? "").trim();

  const sub = await prisma.subscription.findFirst({
    where: { id: subscriptionId, userId },
  });
  if (!sub) redirect("/konto/prenumeration?fel=not-found");

  if (pause) {
    const d = untilRaw ? new Date(untilRaw) : null;
    if (!d || Number.isNaN(d.getTime())) redirect("/konto/prenumeration?fel=datum");
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: "PAUSED", pausedUntil: d },
    });
    // Legacy field on User
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionPausedUntil: d },
    });
  } else {
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: "ACTIVE", pausedUntil: null },
    });
    await prisma.user.update({
      where: { id: userId },
      data: { subscriptionPausedUntil: null },
    });
  }

  revalidatePath("/konto", "layout");
  redirect("/konto/prenumeration?sparat=1");
}

/**
 * Cancel the active subscription.
 */
export async function cancelSubscription(formData: FormData) {
  const userId = await requireUserId();
  const subscriptionId = String(formData.get("subscriptionId") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim() || null;

  const sub = await prisma.subscription.findFirst({
    where: { id: subscriptionId, userId },
  });
  if (!sub) redirect("/konto/prenumeration?fel=not-found");

  await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: "CANCELLED",
      cancelledAt: new Date(),
      cancelReason: reason,
    },
  });

  revalidatePath("/konto", "layout");
  redirect("/konto/prenumeration?avslutad=1");
}

// ─── Admin-side subscription/order actions ────────────────────────────────────

import { getAdminFromCookies } from "@/lib/auth";

async function adminGuard() {
  if (!(await getAdminFromCookies())) redirect("/admin/login");
}

/**
 * Admin: update a delivery's status + optional tracking info.
 */
export async function adminUpdateDelivery(formData: FormData) {
  await adminGuard();
  const id = String(formData.get("deliveryId") ?? "").trim();
  const status = String(formData.get("status") ?? "PENDING");
  const trackingNumber = String(formData.get("trackingNumber") ?? "").trim() || null;
  const trackingUrl = String(formData.get("trackingUrl") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;

  const now = new Date();
  const delivery = await prisma.delivery.update({
    where: { id },
    data: {
      status,
      trackingNumber,
      trackingUrl,
      notes,
      shippedAt: status === "SHIPPED" ? now : undefined,
      deliveredAt: status === "DELIVERED" ? now : undefined,
    },
    include: { subscription: { include: { user: true } } },
  });

  // Send shipping notice when status becomes SHIPPED
  if (status === "SHIPPED") {
    const user = delivery.subscription?.user;
    if (user?.email) {
      sendShippingNotice({
        email: user.email,
        name: user.name ?? "Kund",
        strengthMg: delivery.strengthMg,
        trackingUrl,
      }).catch((e) => console.error("Shipping email failed:", e));
    }
  }

  revalidatePath("/admin/subscriptions");
}

/**
 * Admin: update an order's payment status.
 */
export async function adminUpdateOrder(formData: FormData) {
  await adminGuard();
  const id = String(formData.get("orderId") ?? "").trim();
  const status = String(formData.get("status") ?? "PENDING");
  const stripePaymentIntentId = String(formData.get("stripePaymentIntentId") ?? "").trim() || null;

  await prisma.order.update({
    where: { id },
    data: { status, stripePaymentIntentId },
  });

  // If paid, activate the subscription
  if (status === "PAID") {
    const order = await prisma.order.findUnique({
      where: { id },
      select: { subscriptionId: true },
    });
    if (order?.subscriptionId) {
      await prisma.subscription.update({
        where: { id: order.subscriptionId },
        data: { status: "ACTIVE" },
      });
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath("/admin/subscriptions");
}

/**
 * Admin: set a subscription's status directly.
 */
export async function adminSetSubscriptionStatus(formData: FormData) {
  await adminGuard();
  const id = String(formData.get("subscriptionId") ?? "").trim();
  const status = String(formData.get("status") ?? "ACTIVE");

  await prisma.subscription.update({
    where: { id },
    data: {
      status,
      cancelledAt: status === "CANCELLED" ? new Date() : undefined,
    },
  });
  revalidatePath("/admin/subscriptions");
}
