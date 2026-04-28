import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSwishConfig } from "@/lib/paymentConfig";
import { createSwishPayment, swishDeeplink } from "@/lib/swish";
import { auth } from "@/auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const { orderId, phoneNumber } = (await req.json()) as {
    orderId?: string;
    phoneNumber?: string;
  };

  if (!orderId) return NextResponse.json({ error: "orderId krävs" }, { status: 400 });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { subscription: { include: { plan: true } } },
  });

  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order hittades inte" }, { status: 404 });
  }

  if (order.status === "PAID") {
    return NextResponse.json({ already_paid: true });
  }

  const cfg = await getSwishConfig();
  if (!cfg) {
    return NextResponse.json({ error: "Swish är inte konfigurerat" }, { status: 503 });
  }

  const origin = req.nextUrl.origin;
  const callbackUrl = `${origin}/api/payments/swish/callback`;
  const amountSek = order.totalAmountOre / 100;

  try {
    const result = await createSwishPayment(cfg, {
      payeeAlias: cfg.merchantAlias,
      amount: amountSek,
      currency: "SEK",
      callbackUrl,
      message: `STEP ${order.subscription?.plan?.name ?? "prenumeration"}`.slice(0, 50),
      ...(phoneNumber ? { payerAlias: phoneNumber.replace(/\D/g, "") } : {}),
    });

    // Store swish request ID on the order for polling/callback
    await prisma.order.update({
      where: { id: orderId },
      data: { swishPaymentRequestId: result.id },
    });

    const deeplink = result.token
      ? swishDeeplink(result.token, `${origin}/betala/swish?orderId=${orderId}`)
      : null;

    return NextResponse.json({
      requestId: result.id,
      token: result.token,
      deeplink,
    });
  } catch (err) {
    console.error("Swish createPayment error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Swish-fel" },
      { status: 500 },
    );
  }
}
