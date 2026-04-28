import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_COOKIE = "step_admin";

function secretKey() {
  const s = process.env.SESSION_SECRET ?? "dev-only-please-set-SESSION_SECRET-32chars-min";
  return new TextEncoder().encode(s.padEnd(32, "0").slice(0, 64));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminUi = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminUi && !isAdminApi) return NextResponse.next();
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE)?.value;

  if (isAdminApi) {
    if (!token) {
      return NextResponse.json({ error: "Ej inloggad" }, { status: 401 });
    }
    try {
      await jwtVerify(token, secretKey());
      return NextResponse.next();
    } catch {
      return NextResponse.json({ error: "Ogiltig session" }, { status: 401 });
    }
  }

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  try {
    await jwtVerify(token, secretKey());
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
