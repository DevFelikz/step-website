"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";

interface Props {
  orderId: string;
  planId: string;
  amountKr: number;
  deeplink: string | null;
  requestId: string;
}

type PayStatus = "waiting" | "paid" | "failed" | "cancelled";

export function SwishPayPage({ orderId, planId, amountKr, deeplink, requestId }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<PayStatus>("waiting");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate QR code from deeplink
  useEffect(() => {
    if (!deeplink) return;
    QRCode.toDataURL(deeplink, {
      width: 220,
      margin: 2,
      color: { dark: "#c9a227", light: "#141414" },
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [deeplink]);

  // Poll order status every 2 seconds
  useEffect(() => {
    if (status !== "waiting") return;

    async function poll() {
      try {
        const res = await fetch(`/api/payments/swish/status?orderId=${orderId}`);
        const data = (await res.json()) as { status?: string };
        if (data.status === "PAID") {
          setStatus("paid");
          clearInterval(intervalRef.current!);
          setTimeout(() => router.push(`/checkout/${planId}/bekraftelse?sub=&orderId=${orderId}`), 1500);
        } else if (data.status === "FAILED") {
          setStatus("failed");
          clearInterval(intervalRef.current!);
        }
      } catch {
        // Network error — keep polling
      }
    }

    intervalRef.current = setInterval(poll, 2000);
    return () => clearInterval(intervalRef.current!);
  }, [orderId, planId, router, status]);

  if (status === "paid") {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-xl font-bold text-white">Betalning mottagen!</p>
        <p className="text-step-muted">Omdirigerar till orderbekräftelse…</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
          <svg className="h-8 w-8 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-xl font-bold text-white">Betalning misslyckades</p>
        <p className="text-step-muted">Swish-betalningen avbröts eller nekades.</p>
        <a
          href={`/checkout/${planId}`}
          className="mt-4 rounded border border-step-gold px-6 py-2 text-sm font-semibold text-step-gold hover:bg-step-gold hover:text-black transition"
        >
          Försök igen
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md py-16 px-4 text-center">
      <p className="text-xs font-semibold tracking-[0.25em] text-step-gold">SWISH-BETALNING</p>
      <h1 className="mt-2 text-2xl font-bold text-white">Betala {amountKr} kr</h1>
      <p className="mt-2 text-sm text-step-muted">Scanna QR-koden med Swish-appen eller öppna Swish direkt om du är på mobilen.</p>

      {/* QR code */}
      {qrDataUrl ? (
        <div className="mt-8 flex justify-center">
          <div className="rounded-xl border border-step-border bg-step-card p-4">
            <img src={qrDataUrl} alt="Swish QR-kod" className="h-[220px] w-[220px]" />
          </div>
        </div>
      ) : (
        <div className="mt-8 flex h-[236px] w-[236px] mx-auto items-center justify-center rounded-xl border border-step-border bg-step-card">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-step-gold border-t-transparent" />
        </div>
      )}

      {/* Mobile deeplink */}
      {deeplink && (
        <a
          href={deeplink}
          className="mt-6 flex items-center justify-center gap-2 rounded border border-step-gold px-6 py-3 text-sm font-semibold text-step-gold transition hover:bg-step-gold hover:text-black"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Öppna Swish-appen
        </a>
      )}

      {/* Waiting indicator */}
      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-step-muted">
        <div className="h-2 w-2 animate-pulse rounded-full bg-step-gold" />
        Väntar på betalning…
      </div>

      <p className="mt-6 text-xs text-step-muted/60">
        Referens: <span className="font-mono">{requestId.slice(0, 8).toUpperCase()}</span>
      </p>
    </div>
  );
}
