import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { email } = (await req.json()) as { email?: string };
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Ogiltig e-postadress" }, { status: 400 });
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  return NextResponse.json({ ok: true });
}
