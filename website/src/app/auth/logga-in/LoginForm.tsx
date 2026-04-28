"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") ?? "/konto";
  const meddelande = search.get("meddelande");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Fel mejl eller lösenord");
        return;
      }
      router.push(callbackUrl.startsWith("/") ? callbackUrl : "/konto");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-sm space-y-4 rounded-lg border border-step-border bg-step-card p-8">
      {meddelande ? (
        <p className="rounded border border-step-gold/40 bg-step-gold/10 px-3 py-2 text-sm text-step-gold">
          {decodeURIComponent(meddelande.replace(/\+/g, " "))}
        </p>
      ) : null}
      <div>
        <label className="admin-label" htmlFor="email">
          Mejl
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="admin-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="admin-label" htmlFor="password">
          Lösenord
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="admin-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-step-gold py-3 text-sm font-semibold text-black hover:bg-step-gold-dim disabled:opacity-50"
      >
        {loading ? "…" : "Logga in"}
      </button>
      <p className="text-center text-sm text-step-muted">
        Inget konto?{" "}
        <Link href="/auth/registrera" className="text-step-gold underline">
          Registrera dig
        </Link>
      </p>
    </form>
  );
}
