"use client";

import { signOut } from "next-auth/react";

export function LogOutButton() {
  return (
    <button
      type="button"
      onClick={() => void signOut({ redirectTo: "/" })}
      className="rounded border border-step-border px-4 py-2 text-xs font-semibold tracking-wide text-step-muted transition hover:border-red-500/50 hover:text-red-300"
    >
      Logga ut
    </button>
  );
}
