import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ADMIN_COOKIE, signAdminJwt } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";
  const hash = (process.env.ADMIN_PASSWORD_HASH ?? "").trim();
  if (!hash) {
    return NextResponse.json(
      { error: "Saknar ADMIN_PASSWORD_HASH i .env" },
      { status: 500 },
    );
  }
  const ok = await bcrypt.compare(password, hash);
  if (!ok) {
    // Temporary debug — remove after fixing
    return NextResponse.json({
      error: "Fel lösenord",
      debug_hash_len: hash.length,
      debug_hash_start: hash.slice(0, 7),
      debug_hash_end: hash.slice(-4),
    }, { status: 401 });
  }
  const token = await signAdminJwt();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
