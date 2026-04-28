"use client";

import { useState } from "react";

type Props = {
  /** Form field name */
  fieldName?: string;
  defaultValue: string;
};

/**
 * URL eller uppladdning till samma admin-endpoint som hero (public/images/uploads).
 */
export function PlanCardImageField({ fieldName = "cardImage", defaultValue }: Props) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr("");
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/upload-hero-background", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const data = (await res.json()) as { path?: string; error?: string };
      if (!res.ok) {
        setErr(data.error ?? "Uppladdning misslyckades");
        return;
      }
      if (data.path) setValue(data.path);
    } catch {
      setErr("Nätverksfel");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="admin-label" htmlFor={`${fieldName}-url`}>
        Bild på priskort
      </label>
      <input
        id={`${fieldName}-url`}
        name={fieldName}
        className="admin-input font-mono text-xs"
        value={value}
        onChange={(ev) => setValue(ev.target.value)}
        placeholder="/images/uploads/… eller https://…"
      />
      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded border border-step-border bg-step-bg px-3 py-2 text-xs text-step-muted transition hover:border-step-gold/50 hover:text-white">
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={onFile} disabled={busy} />
          {busy ? "Laddar upp…" : "Välj fil"}
        </label>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin preview, arbitrary URL
          <img src={value} alt="" className="h-16 w-16 rounded border border-step-border object-contain" />
        ) : null}
      </div>
      {err ? <p className="text-xs text-red-400">{err}</p> : null}
      <p className="text-xs text-step-muted">Tomt = ingen bild på kortet. Relativ sökväg från webbrot eller säker https-URL.</p>
      <p className="inline-flex items-center gap-1.5 rounded bg-step-gold/10 px-2.5 py-1 text-xs font-medium text-step-gold">
        <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3 shrink-0"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm.75 10.5h-1.5v-5h1.5v5zm0-6.5h-1.5V3.5h1.5V5z"/></svg>
        Rekommenderad storlek: <strong>600 × 400 px</strong> (3:2) · JPG, PNG eller WebP · max 500 KB
      </p>
    </div>
  );
}
