import { NextRequest, NextResponse } from "next/server";
import { getStripeConfig } from "@/lib/paymentConfig";
import Stripe from "stripe";
import { prisma } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  const stripeCfg = await getStripeConfig();
  if (!stripeCfg) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  const webhookSecret = stripeCfg.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET || "";
  const stripe = new Stripe(stripeCfg.secretKey, { apiVersion: "2026-04-22.dahlia", typescript: true });

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      metadata?: { orderId?: string; subscriptionId?: string };
      customer_email?: string;
      amount_total?: number;
      payment_intent?: string;
    };

    const orderId = session.metadata?.orderId;
    const subscriptionId = session.metadata?.subscriptionId;
    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : null;

    if (orderId) {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID", stripePaymentIntentId: paymentIntentId ?? undefined },
        include: { user: true, subscription: { include: { plan: true } } },
      });

      if (subscriptionId) {
        await prisma.subscription.update({
          where: { id: subscriptionId },
          data: { status: "ACTIVE" },
        });
      }

      // Fire-and-forget confirmation email
      if (order.user?.email) {
        sendOrderConfirmation({
          email: order.user.email,
          name: order.billingName ?? order.user.name ?? "Kund",
          planName: order.subscription?.plan?.name ?? "STEP Plan",
          totalKr: Math.round(order.totalAmountOre / 100),
          orderId: order.id,
        }).catch((e) => console.error("Email send failed:", e));
      }
    }
  }

  return NextResponse.json({ received: true });
}
