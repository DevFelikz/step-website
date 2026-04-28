import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    /** Saknas om JWT saknar sub eller användaren är bannad. */
    user?: {
      id: string;
      planId: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    planId?: string | null;
  }
}
