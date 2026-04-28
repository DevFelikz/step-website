"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "@/app/actions/user-account";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("name", name);
      fd.set("email", email);
      fd.set("password", password);
      const res = await registerUser(fd);
      if ("error" in res && res.error) {
        setError(res.error);
        return;
      }
      const sign = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (sign?.error) {
        setError("Konto skapat men inloggning misslyckades — prova logga in manuellt.");
        return;
      }
      router.push("/konto");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-10 max-w-sm space-y-4 rounded-lg border border-step-border bg-step-card p-8">
      <div>
        <label className="admin-label" htmlFor="name">
          Namn (valfritt)
        </label>
        <input id="name" className="admin-input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
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
          Lösenord (minst 8 tecken)
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className="admin-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded bg-step-gold py-3 text-sm font-semibold text-black hover:bg-step-gold-dim disabled:opacity-50"
      >
        {loading ? "…" : "Skapa konto"}
      </button>
      <p className="text-center text-sm text-step-muted">
        Har du redan konto?{" "}
        <Link href="/auth/logga-in" className="text-step-gold underline">
          Logga in
        </Link>
      </p>
    </form>
  );
}
