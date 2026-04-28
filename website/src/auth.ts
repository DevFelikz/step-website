import NextAuth from "next-auth";
import type { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.SESSION_SECRET,
  trustHost: true,
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Mejl", type: "email" },
        password: { label: "Lösenord", type: "password" },
      },
      authorize: async (credentials) => {
        const emailRaw = credentials?.email;
        const passwordRaw = credentials?.password;
        if (!emailRaw || !passwordRaw) return null;
        const email = String(emailRaw).toLowerCase().trim();
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        if (user.banned) return null;
        const ok = await bcrypt.compare(String(passwordRaw), user.passwordHash);
        if (!ok) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          planId: user.planId,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/auth/logga-in" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.planId = (user as { planId?: string | null }).planId ?? null;
      }
      if (trigger === "update" && session?.user) {
        const u = session.user as {
          planId?: string | null;
          email?: string;
          name?: string | null;
        };
        if (u.planId !== undefined) token.planId = u.planId;
        if (u.email) token.email = u.email;
        if (u.name !== undefined) token.name = u.name;
      }
      if (token.sub) {
        const row = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { banned: true },
        });
        if (!row || row.banned) {
          token.sub = undefined;
          token.email = undefined;
          token.name = undefined;
          token.planId = undefined;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (!token.sub) {
        (session as unknown as { user?: Session["user"] }).user = undefined;
        return session;
      }
      const db = await prisma.user.findUnique({
        where: { id: token.sub },
        select: { email: true, name: true, planId: true, banned: true },
      });
      if (!db || db.banned) {
        (session as unknown as { user?: Session["user"] }).user = undefined;
        return session;
      }
      session.user = {
        ...session.user,
        id: token.sub,
        email: db.email,
        name: db.name,
        planId: db.planId,
      };
      return session;
    },
  },
});
