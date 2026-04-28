"use client";

import { useState, useTransition } from "react";
import { sendNewsletter } from "@/app/admin/actions";

interface Subscriber {
  id: string;
  email: string;
  createdAt: Date;
}

export function NewsletterComposer({ subscribers }: { subscribers: Subscriber[] }) {
  const [isPending, startTransition] = useTransition();
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState(DEFAULT_TEMPLATE);
  const [mode, setMode] = useState<"all" | "selected">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"compose" | "preview">("compose");
  const [result, setResult] = useState<{ ok: boolean; sent?: number; failed?: number; error?: string } | null>(null);

  function toggleId(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedIds.size === subscribers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(subscribers.map((s) => s.id)));
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);
    const fd = new FormData(e.currentTarget);
    if (mode === "selected") {
      selectedIds.forEach((id) => fd.append("recipientIds", id));
    }
    startTransition(async () => {
      const res = await sendNewsletter(fd);
      setResult(res);
    });
  }

  const recipientCount = mode === "all" ? subscribers.length : selectedIds.size;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input type="hidden" name="recipientMode" value={mode} />

      {/* Subject */}
      <div>
        <label className="admin-label">Ämnesrad</label>
        <input
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="admin-input mt-1"
          placeholder="STEP — Nytt från oss den här månaden"
          required
        />
      </div>

      {/* Compose / Preview tabs */}
      <div>
        <div className="mb-2 flex gap-1 border-b border-step-border">
          {(["compose", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium transition ${
                tab === t
                  ? "border-b-2 border-step-gold text-white"
                  : "text-step-muted hover:text-white"
              }`}
            >
              {t === "compose" ? "Redigera HTML" : "Förhandsvisning"}
            </button>
          ))}
        </div>

        {tab === "compose" ? (
          <div>
            <label className="admin-label">
              Innehåll (HTML)
              <span className="ml-2 text-[10px] font-normal text-step-muted/70">
                Använd inline-stilar för bäst kompatibilitet med e-postklienter
              </span>
            </label>
            <textarea
              name="bodyHtml"
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              className="admin-input mt-1 min-h-[400px] resize-y font-mono text-xs leading-relaxed"
              required
              spellCheck={false}
            />
          </div>
        ) : (
          <div>
            <p className="mb-2 text-xs text-step-muted">
              Så här ser det ut i e-postklienten:
            </p>
            <div className="overflow-hidden rounded-lg border border-step-border bg-white">
              <iframe
                srcDoc={bodyHtml}
                className="h-[500px] w-full"
                title="E-postförhandsvisning"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        )}
      </div>

      {/* Recipients */}
      <div>
        <p className="admin-label mb-2">Mottagare</p>
        <div className="flex gap-3">
          {(["all", "selected"] as const).map((m) => (
            <label key={m} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                checked={mode === m}
                onChange={() => setMode(m)}
                className="text-step-gold"
              />
              <span className="text-sm text-white">
                {m === "all" ? `Alla (${subscribers.length} st)` : "Välj manuellt"}
              </span>
            </label>
          ))}
        </div>

        {mode === "selected" && (
          <div className="mt-3 overflow-hidden rounded-lg border border-step-border">
            <div className="flex items-center justify-between border-b border-step-border bg-step-surface px-4 py-2">
              <span className="text-xs text-step-muted">
                {selectedIds.size} av {subscribers.length} valda
              </span>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs text-step-gold hover:underline"
              >
                {selectedIds.size === subscribers.length ? "Avmarkera alla" : "Markera alla"}
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {subscribers.map((sub) => (
                <label
                  key={sub.id}
                  className="flex cursor-pointer items-center gap-3 border-b border-step-border/40 px-4 py-2.5 last:border-b-0 hover:bg-step-card"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(sub.id)}
                    onChange={() => toggleId(sub.id)}
                    className="rounded border-step-border text-step-gold"
                  />
                  <span className="text-sm text-white">{sub.email}</span>
                  <span className="ml-auto text-xs text-step-muted">
                    {new Date(sub.createdAt).toLocaleDateString("sv-SE")}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Result banner */}
      {result && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            result.ok
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {result.ok
            ? `✓ Skickat till ${result.sent} mottagare${result.failed ? ` · ${result.failed} misslyckades` : ""}`
            : `✗ ${result.error}`}
        </div>
      )}

      {/* Send button */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending || recipientCount === 0}
          className="rounded bg-step-gold px-6 py-3 text-sm font-semibold text-black transition hover:bg-step-gold-dim disabled:opacity-40"
        >
          {isPending
            ? "Skickar…"
            : `Skicka till ${recipientCount} mottagare`}
        </button>
        {recipientCount === 0 && mode === "selected" && (
          <p className="text-xs text-step-muted">Välj minst en mottagare</p>
        )}
      </div>
    </form>
  );
}

const DEFAULT_TEMPLATE = `<!DOCTYPE html>
<html lang="sv">
<head><meta charset="UTF-8"><title>STEP</title></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#141414;border-radius:12px;padding:40px;border:1px solid #2a2a2a">

    <!-- Logo -->
    <div style="text-align:center;margin-bottom:32px">
      <span style="font-size:28px;font-weight:900;letter-spacing:-2px;color:#c9a227">STEP</span>
    </div>

    <!-- Headline -->
    <h1 style="color:#ffffff;font-size:24px;font-weight:700;margin:0 0 12px">
      Rubrik här
    </h1>

    <!-- Body text -->
    <p style="color:#9ca3af;line-height:1.7;margin:0 0 24px">
      Skriv ditt innehåll här. Berätta om nyheter, erbjudanden eller inspiration
      för dina prenumeranter.
    </p>

    <!-- Button -->
    <a href="https://step.se"
       style="display:inline-block;background:#c9a227;color:#000;font-weight:700;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:14px">
      Läs mer →
    </a>

    <!-- Divider -->
    <hr style="border:none;border-top:1px solid #2a2a2a;margin:32px 0">

    <!-- Footer -->
    <p style="text-align:center;color:#555;font-size:12px;margin:0">
      STEP • <a href="https://step.se" style="color:#c9a227">step.se</a><br>
      Du får detta e-postmeddelande för att du prenumererar på STEP-nyhetsbrevet.<br>
      <a href="https://step.se/avregistrera" style="color:#555">Avprenumerera</a>
    </p>

  </div>
</body>
</html>`;
