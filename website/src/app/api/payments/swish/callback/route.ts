import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";

export const runtime = "nodejs";

interface SwishCallbackPayload {
  id: string;
  payeePaymentReference?: string;
  paymentReference?: string;
  callbackUrl?: string;
  payerAlias?: string;
  payeeAlias?: string;
  currency?: string;
  message?: string;
  status: "PAID" | "DECLINED" | "ERROR" | "CANCELLED";
  amount?: number;
  datePaid?: string;
  errorCode?: string;
  errorMessage?: string;
}

export async function POST(req: NextRequest) {
  let payload: SwishCallbackPayload;
  try {
    payload = (await req.json()) as SwishCallbackPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const requestId = payload.id;
  if (!requestId) return NextResponse.json({ ok: true });

  // Find the order by swishPaymentRequestId
  const order = await prisma.order.findFirst({
    where: { swishPaymentRequestId: requestId },
    include: { user: true, subscription: { include: { plan: true } } },
  });

  if (!order) {
    console.warn("Swish callback: no order found for requestId", requestId);
    return NextResponse.json({ ok: true });
  }

  if (payload.status === "PAID") {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID" },
    });

    if (order.subscriptionId) {
      await prisma.subscription.update({
        where: { id: order.subscriptionId },
        data: { status: "ACTIVE" },
      });
    }

    // Send confirmation email
    if (order.user?.email) {
      sendOrderConfirmation({
        email: order.user.email,
        name: order.billingName ?? order.user.name ?? "Kund",
        planName: order.subscription?.plan?.name ?? "STEP Plan",
        totalKr: Math.round(order.totalAmountOre / 100),
        orderId: order.id,
      }).catch((e) => console.error("Email after Swish callback failed:", e));
    }
  } else if (["DECLINED", "ERROR", "CANCELLED"].includes(payload.status)) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "FAILED" },
    });
  }

  return NextResponse.json({ ok: true });
}
