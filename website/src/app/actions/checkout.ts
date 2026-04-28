"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { generateDeliverySchedule } from "@/lib/planEngine";
import { getStripeConfig, getSwishConfig } from "@/lib/paymentConfig";

export async function submitCheckout(formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/auth/logga-in?callbackUrl=/shop");

  const planId = String(formData.get("planId") ?? "").trim();
  const plan = await prisma.plan.findFirst({ where: { id: planId, visible: true } });
  if (!plan) redirect("/shop?fel=plan");

  // ── Personal & address ────────────────────────────────────────────────────
  const name = String(formData.get("name") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const addressLine1 = String(formData.get("addressLine1") ?? "").trim() || null;
  const addressLine2 = String(formData.get("addressLine2") ?? "").trim() || null;
  const postalCode = String(formData.get("postalCode") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "Sverige").trim() || "Sverige";
  const deliveryNotes = String(formData.get("deliveryNotes") ?? "").trim() || null;

  const sameBillingAsShipping = formData.get("sameBillingAsShipping") !== "off";
  const billingAddressLine1 = sameBillingAsShipping
    ? addressLine1
    : String(formData.get("billingAddressLine1") ?? "").trim() || null;
  const billingPostalCode = sameBillingAsShipping
    ? postalCode
    : String(formData.get("billingPostalCode") ?? "").trim() || null;
  const billingCity = sameBillingAsShipping
    ? city
    : String(formData.get("billingCity") ?? "").trim() || null;

  // ── Plan config ───────────────────────────────────────────────────────────
  const startStrengthMg = Math.max(0, parseInt(String(formData.get("startStrengthMg") ?? "20"), 10) || 20);
  const durationMonths = Math.max(1, parseInt(String(formData.get("durationMonths") ?? "6"), 10) || 6);
  const quantityCans = Math.max(1, parseInt(String(formData.get("quantityCans") ?? "1"), 10) || 1);

  // ── Payment method (stub) ─────────────────────────────────────────────────
  const paymentMethod = String(formData.get("paymentMethod") ?? "klarna");

  // ── Extract price from plan label ─────────────────────────────────────────
  const monthlyKr = parseInt((plan.priceLabel.match(/\d+/) ?? ["0"])[0], 10);
  const totalAmountOre = monthlyKr * durationMonths * 100;

  // ── Update user profile ───────────────────────────────────────────────────
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      phone,
      addressLine1,
      addressLine2,
      postalCode,
      city,
      country,
      deliveryNotes,
      sameBillingAsShipping,
      billingAddressLine1,
      billingPostalCode,
      billingCity,
      planId,
    },
  });

  // ── Generate delivery schedule ────────────────────────────────────────────
  const slots = generateDeliverySchedule({
    startStrengthMg,
    durationMonths,
    quantityCans,
    startDate: new Date(),
  });

  // ── Create subscription + deliveries ─────────────────────────────────────
  const subscription = await prisma.subscription.create({
    data: {
      userId,
      planId,
      status: "PENDING",
      startStrengthMg,
      durationMonths,
      nextDeliveryDate: slots[0]?.scheduledDate ?? null,
      deliveryNotes,
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

  // ── Create order ──────────────────────────────────────────────────────────
  const order = await prisma.order.create({
    data: {
      userId,
      subscriptionId: subscription.id,
      status: "PENDING",
      totalAmountOre,
      currency: "SEK",
      billingEmail: user.email,
      billingName: name,
      billingAddress: [
        sameBillingAsShipping ? addressLine1 : billingAddressLine1,
        sameBillingAsShipping ? postalCode : billingPostalCode,
        sameBillingAsShipping ? city : billingCity,
      ]
        .filter(Boolean)
        .join(", "),
    },
  });

  revalidatePath("/konto", "layout");

  // ── Route to payment provider ─────────────────────────────────────────────
  const [stripeCfg, swishCfg] = await Promise.all([getStripeConfig(), getSwishConfig()]);

  if (paymentMethod === "swish" && swishCfg) {
    redirect(`/betala/swish?orderId=${order.id}`);
  }

  if ((paymentMethod === "card" || paymentMethod === "klarna") && stripeCfg) {
    redirect(`/api/stripe/checkout?orderId=${order.id}&method=${paymentMethod}`);
  }

  // No provider configured — skip straight to confirmation (dev mode)
  redirect(`/checkout/${planId}/bekraftelse?sub=${subscription.id}`);
}
