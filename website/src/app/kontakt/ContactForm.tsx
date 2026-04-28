"use client";

import { useState } from "react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject"),
      message: fd.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Serverfel");
      setSent(true);
    } catch {
      setError("Något gick fel. Prova igen eller mejla oss direkt.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-step-gold/30 bg-step-gold/5 p-8">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-8 w-8 text-step-gold">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-white">Tack för ditt meddelande!</h3>
        <p className="text-sm text-step-muted">Vi återkommer inom 24 timmar på vardagar.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="checkout-label">Namn</label>
          <input name="name" className="checkout-input mt-1" required placeholder="Anna Lindgren" />
        </div>
        <div>
          <label className="checkout-label">E-post</label>
          <input name="email" type="email" className="checkout-input mt-1" required placeholder="anna@example.com" />
        </div>
      </div>
      <div>
        <label className="checkout-label">Ämne</label>
        <select name="subject" className="checkout-input mt-1" required>
          <option value="">Välj ämne…</option>
          <option value="order">Fråga om beställning</option>
          <option value="delivery">Leveransproblem</option>
          <option value="program">Fråga om mitt program</option>
          <option value="billing">Betalningsfråga</option>
          <option value="other">Annat</option>
        </select>
      </div>
      <div>
        <label className="checkout-label">Meddelande</label>
        <textarea
          name="message"
          rows={5}
          className="checkout-input mt-1 resize-none"
          required
          placeholder="Beskriv ditt ärende…"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded border border-step-gold px-6 py-3 text-sm font-semibold text-step-gold transition hover:bg-step-gold hover:text-black disabled:opacity-50"
      >
        {loading ? "Skickar…" : "Skicka meddelande"}
      </button>
    </form>
  );
}
