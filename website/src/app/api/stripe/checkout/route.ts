import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getStripeConfig } from "@/lib/paymentConfig";
import Stripe from "stripe";

export async function GET(req: NextRequest) {
  const orderId = req.nextUrl.searchParams.get("orderId");
  const method = req.nextUrl.searchParams.get("method") ?? "card";
  if (!orderId) return NextResponse.redirect(new URL("/shop", req.url));

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { subscription: { include: { plan: true } } },
  });
  if (!order) return NextResponse.redirect(new URL("/shop?fel=order", req.url));

  const stripeCfg = await getStripeConfig();
  if (!stripeCfg) return NextResponse.redirect(new URL("/shop?fel=stripe", req.url));
  const stripe = new Stripe(stripeCfg.secretKey, { apiVersion: "2026-04-22.dahlia", typescript: true });
  const origin = req.nextUrl.origin;

  const planName = order.subscription?.plan?.name ?? "STEP Plan";
  const months = order.subscription?.durationMonths ?? 1;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    currency: "sek",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "sek",
          unit_amount: order.totalAmountOre,
          product_data: {
            name: `${planName} — ${months} månaders program`,
            description: "Nikotinprenumeration via STEP",
          },
        },
      },
    ],
    payment_method_types: (method === "klarna" ? ["klarna"] : ["card"]) as ("card" | "klarna")[],
    customer_email: order.billingEmail ?? undefined,
    metadata: { orderId: order.id, subscriptionId: order.subscriptionId ?? "" },
    success_url: `${origin}/checkout/bekraftelse?orderId=${order.id}&stripe=1`,
    cancel_url: `${origin}/shop`,
  });

  return NextResponse.redirect(session.url!);
}
