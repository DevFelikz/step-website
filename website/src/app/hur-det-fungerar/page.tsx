import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";

export const metadata = {
  title: "Hur det fungerar — STEP",
  description:
    "Så fungerar STEP: välj din plan, ta emot månadsleveranser med sjunkande nikotinstyrka, och nå 0 mg i din egna takt.",
};

const TIMELINE = [
  { step: 1, mg: "8MG",  month: "MÅNAD 1",  zero: false },
  { step: 2, mg: "6MG",  month: "MÅNAD 2",  zero: false },
  { step: 3, mg: "4MG",  month: "MÅNAD 3",  zero: false },
  { step: 4, mg: "2MG",  month: "MÅNAD 4",  zero: false },
  { step: 5, mg: "1MG",  month: "MÅNAD 5",  zero: false },
  { step: 6, mg: "0MG",  month: "MÅNAD 6",  zero: true  },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
    title: "Byggd att minska",
    body: "Steg för steg.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
    title: "Levereras månadsvis",
    body: "Diskret & pålitlig.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "Ingen bindning",
    body: "Avsluta när som helst.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
    title: "Nå noll",
    body: "Ditt mål. Vårt system.",
  },
];

export default function HowItWorksPage() {
  return (
    <SiteShell activeHref="/hur-det-fungerar">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-step-border bg-step-bg">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left */}
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-step-gold">HUR DET FUNGERAR</p>
              <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                Ett enkelt system.<br />
                <span className="text-step-gold">Sex steg.</span>{" "}
                <span className="text-step-gold">Sex månader.</span>
              </h1>
              <div className="mt-5 h-px w-12 bg-step-gold/50" />
              <p className="mt-5 text-lg text-step-muted">
                Välj din startstyrka.<br />
                Sänk månadsvis. Nå noll nikotin.
              </p>
            </div>

            {/* Right — staircase visual */}
            <div className="flex items-end justify-center gap-3 pb-4 sm:gap-4">
              {TIMELINE.map((t, i) => {
                const heights = [56, 72, 88, 104, 120, 136];
                const h = heights[i];
                return (
                  <div key={t.step} className="flex flex-col items-center gap-2">
                    {/* Can circle */}
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full border text-xs font-black sm:h-14 sm:w-14 ${
                        t.zero
                          ? "border-step-gold bg-step-gold/10 text-step-gold"
                          : "border-step-border bg-step-surface text-white"
                      }`}
                    >
                      {t.step}
                    </div>
                    {/* Stair pillar */}
                    <div
                      className={`w-12 rounded-t sm:w-14 ${
                        t.zero ? "bg-step-gold/20" : "bg-step-border/40"
                      }`}
                      style={{ height: `${h}px` }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline steps ── */}
      <section className="border-b border-step-border bg-step-bg py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">

          {/* Connector line */}
          <div className="relative hidden sm:block">
            <div className="absolute left-0 right-0 top-5 h-px bg-step-border" />
            <div className="relative grid grid-cols-6 gap-2">
              {TIMELINE.map((t) => (
                <div key={t.step} className="flex flex-col items-center text-center">
                  {/* Dot */}
                  <div
                    className={`z-10 mb-4 h-3 w-3 rounded-full border-2 ${
                      t.zero
                        ? "border-step-gold bg-step-gold"
                        : "border-step-border bg-step-bg"
                    }`}
                  />
                  <p className={`text-[10px] font-bold tracking-[0.15em] ${t.zero ? "text-step-gold" : "text-step-muted"}`}>
                    STEG {t.step}
                  </p>
                  <p className={`mt-2 text-4xl font-black ${t.zero ? "text-step-gold" : "text-white"}`}>
                    {t.step}
                  </p>
                  <p className={`mt-1 text-xs font-bold tracking-wider ${t.zero ? "text-step-gold" : "text-white"}`}>
                    {t.mg}
                  </p>
                  {t.zero && (
                    <p className="mt-0.5 text-[9px] font-bold tracking-widest text-step-gold">
                      NOLL NIKOTIN
                    </p>
                  )}
                  <p className="mt-2 text-[10px] text-step-muted">{t.month}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile — vertical list */}
          <div className="grid grid-cols-3 gap-4 sm:hidden">
            {TIMELINE.map((t) => (
              <div
                key={t.step}
                className={`rounded-xl border p-3 text-center ${
                  t.zero
                    ? "border-step-gold bg-step-gold/5"
                    : "border-step-border bg-step-card"
                }`}
              >
                <p className={`text-[9px] font-bold tracking-wider ${t.zero ? "text-step-gold" : "text-step-muted"}`}>
                  STEG {t.step}
                </p>
                <p className={`mt-1 text-2xl font-black ${t.zero ? "text-step-gold" : "text-white"}`}>
                  {t.step}
                </p>
                <p className={`text-xs font-bold ${t.zero ? "text-step-gold" : "text-white"}`}>{t.mg}</p>
                <p className="text-[9px] text-step-muted">{t.month}</p>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <p className="mx-auto mt-14 max-w-2xl text-center text-lg leading-relaxed text-step-muted">
            Vi guider dig neråt i styrka, ett steg i taget.{" "}
            <br className="hidden sm:block" />
            Varje månad tar dig närmare{" "}
            <span className="font-semibold text-step-gold">noll</span> — med ett system som fungerar.
          </p>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="border-b border-step-border py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex flex-col items-center rounded-xl border border-step-border bg-step-card p-5 text-center"
              >
                <div className="mb-3 text-step-gold">{f.icon}</div>
                <p className="text-sm font-bold text-white">{f.title}</p>
                <p className="mt-1 text-xs text-step-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-b border-step-border py-14">
        <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
          <Link
            href="/shop"
            className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-step-surface py-5 text-base font-bold tracking-widest text-white transition hover:bg-step-card sm:w-auto sm:px-16"
          >
            STARTA MIN PLAN
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          {/* Trust row */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-step-muted">
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-3.5 w-3.5">
                <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              Säker kassa
            </span>
            <span className="text-step-border">|</span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-3.5 w-3.5">
                <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
              Diskret leverans
            </span>
            <span className="text-step-border">|</span>
            <span className="flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Ingen bindning. Avsluta när som helst.
            </span>
          </div>
        </div>
      </section>

      {/* ── Testimonial + badges ── */}
      <section className="py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-2">
            {/* Testimonial */}
            <div>
              <p className="text-4xl text-step-gold/40 leading-none">"</p>
              <p className="mt-2 text-lg font-medium leading-relaxed text-white">
                Det är första gången jag känner att jag har kontroll. Steg för steg — det funkar på riktigt.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex text-step-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-step-muted">10 000+ verifierade kunder</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-8 sm:justify-end">
              {[
                { icon: "✦", label: "Designad i Sverige" },
                { icon: "◎", label: "Premium ingredienser" },
                { icon: "♡", label: "Skapad för din resa" },
              ].map((b) => (
                <div key={b.label} className="flex flex-col items-center gap-2 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-step-border bg-step-surface text-xl text-step-gold">
                    {b.icon}
                  </div>
                  <p className="text-xs text-step-muted">{b.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </SiteShell>
  );
}
