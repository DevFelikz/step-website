import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ADMIN_COOKIE, signAdminJwt } from "@/lib/auth";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function getAdminHash(): string {
  // 1. Try a local file (most reliable — bypasses dotenv interpolation issues)
  const hashFile = join(process.cwd(), ".admin-hash");
  if (existsSync(hashFile)) {
    return readFileSync(hashFile, "utf8").trim();
  }
  // 2. Fall back to env var
  return (process.env.ADMIN_PASSWORD_HASH ?? "").trim();
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === "string" ? body.password : "";
  const hash = getAdminHash();
  if (!hash) {
    return NextResponse.json(
      { error: "Admin-lösenord ej konfigurerat. Kör: node setup-admin.cjs dittLösenord" },
      { status: 500 },
    );
  }
  const ok = await bcrypt.compare(password, hash);
  if (!ok) {
    return NextResponse.json({ error: "Fel lösenord" }, { status: 401 });
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
