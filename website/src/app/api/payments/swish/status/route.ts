import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export const runtime = "nodejs";

// GET /api/payments/swish/status?orderId=xxx
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
  }

  const orderId = req.nextUrl.searchParams.get("orderId");
  if (!orderId) return NextResponse.json({ error: "orderId krävs" }, { status: 400 });

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: { status: true, userId: true },
  });

  if (!order || order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order hittades inte" }, { status: 404 });
  }

  return NextResponse.json({ status: order.status });
}
