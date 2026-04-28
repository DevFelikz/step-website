"use client";

import { useState } from "react";

type Props = {
  initialValue: string;
};

export function NavLogoField({ initialValue }: Props) {
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
      <label className="admin-label" htmlFor="nav-logo-url">
        Header — logotyp (valfritt)
      </label>
      <textarea
        id="nav-logo-url"
        name="navLogoUrl"
        rows={2}
        className="admin-input min-h-[4rem] font-mono text-xs"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          setMsg(null);
        }}
        placeholder="Tom = bara sidnamn som text. https://… eller /images/…"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded border border-step-border bg-step-card px-3 py-2 text-sm text-step-muted transition hover:border-step-gold/50 hover:text-white">
          <span>{busy ? "Laddar…" : "Ladda upp logga"}</span>
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
        Samma regler som hero-bild: <strong className="text-step-muted">https</strong>-URL eller sökväg under{" "}
        <code className="text-step-gold">/public</code>. Utan logga visas bara sidnamnet.
      </p>
      {showPreview && url.trim() ? (
        <div className="mt-2 overflow-hidden rounded-md border border-step-border bg-step-card/40 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url.trim()} alt="" className="mx-auto max-h-16 w-auto object-contain" />
        </div>
      ) : null}
    </div>
  );
}
