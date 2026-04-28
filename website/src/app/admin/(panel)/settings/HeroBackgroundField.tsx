"use client";

import { useState } from "react";

type Props = {
  initialValue: string;
};

export function HeroBackgroundField({ initialValue }: Props) {
  const [url, setUrl] = useState(initialValue);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setMsg(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload-hero-background", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = (await res.json().catch(() => ({}))) as { path?: string; error?: string };
      if (!res.ok) {
        setMsg(data.error ?? "Uppladdning misslyckades");
        return;
      }
      if (data.path) {
        setUrl(data.path);
        setMsg("Uppladdad — glöm inte Spara allt nedan.");
      }
    } finally {
      setBusy(false);
    }
  }

  const showPreview =
    url.startsWith("/") || url.startsWith("https://") || url.startsWith("http://");

  return (
    <div className="space-y-2">
      <label className="admin-label" htmlFor="hero-bg-url">
        Hero — bakgrundsbild
      </label>
      <textarea
        id="hero-bg-url"
        name="heroBackgroundImage"
        rows={2}
        className="admin-input min-h-[4rem] font-mono text-xs"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          setMsg(null);
        }}
        placeholder="https://… eller /images/min-bild.png"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-step-border bg-step-card px-3 py-2 text-sm text-step-muted transition hover:border-step-gold/50 hover:text-white">
          <span>{busy ? "Laddar…" : "Välj bild på datorn"}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={onFile}
            disabled={busy}
            aria-hidden
          />
        </label>
        <button
          type="button"
          className="text-xs text-step-muted underline hover:text-step-gold"
          onClick={() => {
            setUrl("");
            setMsg(null);
          }}
        >
          Rensa
        </button>
      </div>
      {msg ? <p className="text-xs text-step-gold">{msg}</p> : null}
      <p className="text-xs text-step-muted">
        Klistra in en <strong className="text-step-muted">https</strong>-länk, skriv en sökväg under{" "}
        <code className="text-step-gold">/public</code> (t.ex. <code className="text-step-gold">/images/…</code>), eller
        ladda upp — bilden hamnar i <code className="text-step-gold">/images/uploads/</code>. Tom = bara gradient.
      </p>
      <p className="inline-flex items-center gap-1.5 rounded bg-step-gold/10 px-2.5 py-1 text-xs font-medium text-step-gold">
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 shrink-0"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 10.5h-1.5v-5h1.5v5zm0-6.5h-1.5V3.5h1.5V5z"/></svg>
        Rekommenderad storlek: <strong>1920 × 1080 px</strong> (16:9) · max 3 MB · JPG eller WebP
      </p>
      {showPreview && url.trim() ? (
        <div className="mt-2 overflow-hidden rounded-md border border-step-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url.trim()} alt="" className="max-h-40 w-full object-cover object-center" />
        </div>
      ) : null}
    </div>
  );
}
