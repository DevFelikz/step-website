"use client";

import { useState, useTransition } from "react";
import { createCustomPlan } from "@/app/actions/custom-plan";
import type { ParsedCustomPlanConfig } from "@/lib/customPlanConfig";

export function CustomPlanConfigurator({ cfg }: { cfg: ParsedCustomPlanConfig }) {
  const { strengths, durations, minCans, maxCans, pricePerMg, discountByMonths, ctaLabel } = cfg;

  const [startMg, setStartMg] = useState<number>(strengths[Math.floor(strengths.length / 2)] ?? strengths[0] ?? 12);
  const [duration, setDuration] = useState<number>(durations[1] ?? durations[0] ?? 6);
  const [cans, setCans] = useState<number>(Math.min(2, maxCans));
  const [isPending, startTransition] = useTransition();

  const canOptions = Array.from({ length: maxCans - minCans + 1 }, (_, i) => i + minCans);

  const pricePerCan = (pricePerMg as Record<string, number>)[String(startMg)] ?? 199;
  const discountFactor = (discountByMonths as Record<string, number>)[String(duration)] ?? 1;
  const discountPct = Math.round((1 - discountFactor) * 100);

  const monthlyKr = pricePerCan * cans;
  const totalKr = Math.round(monthlyKr * duration * discountFactor);
  const savings = discountPct > 0 ? Math.round(monthlyKr * duration * (1 - discountFactor)) : 0;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => createCustomPlan(fd));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <input type="hidden" name="startMg" value={startMg} />
      <input type="hidden" name="durationMonths" value={duration} />
      <input type="hidden" name="cansPerDelivery" value={cans} />

      {/* Step 1 — Nicotine strength */}
      <div>
        <p className="mb-1 text-xs font-semibold tracking-widest text-step-gold">
          STEG 1 — STARTSTYRKA
        </p>
        <p className="mb-4 text-sm text-step-muted">Välj din nuvarande nikotinstyrka (mg per burk)</p>
        <div className="flex flex-wrap gap-2">
          {strengths.map((mg) => (
            <button
              key={mg}
              type="button"
              onClick={() => setStartMg(mg)}
              className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                startMg === mg
                  ? "border-step-gold bg-step-gold/10 text-step-gold"
                  : "border-step-border text-step-muted hover:border-step-gold/40 hover:text-white"
              }`}
            >
              {mg} mg
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 — Duration */}
      <div>
        <p className="mb-1 text-xs font-semibold tracking-widest text-step-gold">
          STEG 2 — PROGRAMLÄNGD
        </p>
        <p className="mb-4 text-sm text-step-muted">Längre program ger bättre rabatt och lugnare nedtrappning</p>
        <div className="flex flex-wrap gap-2">
          {durations.map((d) => {
            const pct = Math.round((1 - ((discountByMonths as Record<string, number>)[String(d)] ?? 1)) * 100);
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`relative rounded-lg border px-5 py-3 text-sm font-semibold transition ${
                  duration === d
                    ? "border-step-gold bg-step-gold/10 text-step-gold"
                    : "border-step-border text-step-muted hover:border-step-gold/40 hover:text-white"
                }`}
              >
                {d} mån
                {pct > 0 && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-step-gold px-1.5 py-0.5 text-[9px] font-bold text-black">
                    Spara {pct}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3 — Cans per delivery */}
      <div>
        <p className="mb-1 text-xs font-semibold tracking-widest text-step-gold">
          STEG 3 — BURKAR PER LEVERANS
        </p>
        <p className="mb-4 text-sm text-step-muted">Hur många burkar vill du ha per månadsleveras?</p>
        <div className="flex flex-wrap gap-2">
          {canOptions.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCans(n)}
              className={`rounded-lg border px-5 py-3 text-sm font-semibold transition ${
                cans === n
                  ? "border-step-gold bg-step-gold/10 text-step-gold"
                  : "border-step-border text-step-muted hover:border-step-gold/40 hover:text-white"
              }`}
            >
              {n} {n === 1 ? "burk" : "burkar"}
            </button>
          ))}
        </div>
      </div>

      {/* Summary card */}
      <div className="rounded-xl border border-step-gold/30 bg-step-gold/5 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-widest text-step-gold">DIN PLAN</p>
            <p className="text-xl font-bold text-white">
              {startMg} mg → 0 mg på {duration} månader
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-step-muted">
              <li className="flex items-center gap-2">
                <span className="text-step-gold">✓</span>
                {cans} burk{cans > 1 ? "ar" : ""} per månadsleveras
              </li>
              <li className="flex items-center gap-2">
                <span className="text-step-gold">✓</span>
                Stegvis nedtrappning varje månad
              </li>
              <li className="flex items-center gap-2">
                <span className="text-step-gold">✓</span>
                Ingen bindningstid
              </li>
              {savings > 0 && (
                <li className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-emerald-400">Du sparar {savings} kr</span>
                </li>
              )}
            </ul>
          </div>

          <div className="text-right">
            <p className="text-3xl font-black tracking-tight text-white">
              {monthlyKr} kr
              <span className="text-base font-normal text-step-muted">/mån</span>
            </p>
            <p className="mt-1 text-sm text-step-muted">
              Totalt {totalKr.toLocaleString("sv-SE")} kr
            </p>
            {discountPct > 0 && (
              <p className="mt-0.5 text-xs text-step-gold">inkl. {discountPct}% programrabatt</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-lg bg-step-gold py-4 text-sm font-bold text-black transition hover:bg-step-gold-dim disabled:opacity-50"
        >
          {isPending ? "Skapar din plan…" : ctaLabel}
        </button>
      </div>
    </form>
  );
}
