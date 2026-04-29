"use client";

import { useState, useTransition } from "react";
import { createCustomPlan } from "@/app/actions/custom-plan";

const STRENGTHS = [2, 4, 6, 8, 10, 12, 16, 20] as const;
const DURATIONS = [3, 6, 9, 12] as const;
const CANS = [1, 2, 3, 4] as const;

const PRICE_PER_CAN: Record<number, number> = {
  2: 149, 4: 159, 6: 169, 8: 179,
  10: 189, 12: 199, 16: 219, 20: 239,
};
const DURATION_DISCOUNT: Record<number, number> = {
  3: 1.0, 6: 0.95, 9: 0.9, 12: 0.85,
};
const DURATION_LABEL: Record<number, string> = {
  3: "3 mån", 6: "6 mån", 9: "9 mån", 12: "12 mån",
};
const DURATION_BADGE: Record<number, string | null> = {
  3: null, 6: "Spara 5%", 9: "Spara 10%", 12: "Spara 15%",
};

export function CustomPlanConfigurator() {
  const [startMg, setStartMg] = useState<number>(12);
  const [duration, setDuration] = useState<number>(6);
  const [cans, setCans] = useState<number>(2);
  const [isPending, startTransition] = useTransition();

  const pricePerCan = PRICE_PER_CAN[startMg] ?? 199;
  const discount = DURATION_DISCOUNT[duration] ?? 1.0;
  const monthlyKr = pricePerCan * cans;
  const totalKr = Math.round(monthlyKr * duration * discount);
  const savings = duration > 3 ? Math.round(monthlyKr * duration * (1 - discount)) : 0;

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
          {STRENGTHS.map((mg) => (
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
          {DURATIONS.map((d) => (
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
              {DURATION_LABEL[d]}
              {DURATION_BADGE[d] && (
                <span className="absolute -top-2 -right-2 rounded-full bg-step-gold px-1.5 py-0.5 text-[9px] font-bold text-black">
                  {DURATION_BADGE[d]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Step 3 — Cans per delivery */}
      <div>
        <p className="mb-1 text-xs font-semibold tracking-widest text-step-gold">
          STEG 3 — BURKAR PER LEVERANS
        </p>
        <p className="mb-4 text-sm text-step-muted">Hur många burkar vill du ha per månadsleveras?</p>
        <div className="flex flex-wrap gap-2">
          {CANS.map((n) => (
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
            {discount < 1 && (
              <p className="mt-0.5 text-xs text-step-gold">
                inkl. {Math.round((1 - discount) * 100)}% programrabatt
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-lg bg-step-gold py-4 text-sm font-bold text-black transition hover:bg-step-gold-dim disabled:opacity-50"
        >
          {isPending ? "Skapar din plan…" : "Fortsätt till beställning →"}
        </button>
      </div>
    </form>
  );
}
