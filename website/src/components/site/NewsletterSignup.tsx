"use client";

import { useState } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p className="text-sm font-medium text-step-gold">
        ✓ Du är med! Vi hör av oss snart.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="din@mejl.se"
        required
        className="min-w-0 flex-1 rounded border border-step-border bg-step-surface px-4 py-2.5 text-sm text-white placeholder:text-step-muted/60 focus:border-step-gold focus:outline-none"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="shrink-0 rounded border border-step-gold px-5 py-2.5 text-xs font-semibold text-step-gold transition hover:bg-step-gold hover:text-black disabled:opacity-50"
      >
        {status === "loading" ? "…" : "Prenumerera"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 sm:col-span-2">Något gick fel. Prova igen.</p>
      )}
    </form>
  );
}
