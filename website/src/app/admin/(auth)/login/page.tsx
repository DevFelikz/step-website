"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Inloggning misslyckades");
        return;
      }
      router.push("/admin");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="reveal-stagger-v w-full max-w-sm rounded-lg border border-step-border bg-step-card p-8">
        <p className="text-center text-xs font-semibold tracking-widest text-step-gold">ADMIN</p>
        <h1 className="mt-2 text-center text-xl font-bold">Logga in</h1>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="admin-label" htmlFor="pw">
              Lösenord
            </label>
            <input
              id="pw"
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
            className="w-full rounded bg-step-gold py-3 text-sm font-semibold text-black transition hover:bg-step-gold-dim disabled:opacity-50"
          >
            {loading ? "…" : "Fortsätt"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-step-muted">
          Standardlösenord efter installation: <code className="text-step-gold">admin123</code> — byt i{" "}
          <code className="break-all">ADMIN_PASSWORD_HASH</code>
        </p>
      </div>
    </div>
  );
}
