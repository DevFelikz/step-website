import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";

export const metadata = {
  title: "Hur det fungerar — STEP",
  description:
    "Så fungerar STEP: välj din plan, ta emot månadsleveranser med sjunkande nikotinstyrka, och nå 0 mg i din egna takt.",
};

const STEPS = [
  {
    number: "01",
    title: "Välj din nivå",
    body: "Börja med den nikotinstyrka du använder idag — 20, 12, 6 eller 3 mg. Vi anpassar sedan schemat exakt efter din startpunkt.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Bestäm programlängd",
    body: "6, 9 eller 12 månader — du väljer takten. Längre program ger en jämnare nedtrappning och ökar chansen att lyckas utan abstinens.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Beställ & betala",
    body: "Slutför beställningen med Klarna, kort eller Swish. Säker betalning krypterad med TLS. Inga dolda avgifter — du ser totalkostnaden direkt.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Första leveransen anländer",
    body: "Inom 2–4 vardagar skickas din startportion. Diskret förpackning, spårbar frakt, direkt i brevlådan om möjligt.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V11" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Månatlig nedtrappning",
    body: "Varje månad anländer en ny leverans med något lägre styrka. Din kropp hinner vänja sig — utan att du behöver fatta aktiva beslut varje dag.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Du når 0 mg",
    body: "I det sista steget levererar vi 0 mg-portioner — som ger dig vanan och ritualen utan nikotinet. Målet är att du till slut inte behöver dem heller.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
      </svg>
    ),
  },
];

const CURVE_EXAMPLE = [
  { month: "Månad 1", mg: 20, percent: 100 },
  { month: "Månad 2", mg: 16, percent: 80 },
  { month: "Månad 3", mg: 12, percent: 60 },
  { month: "Månad 4", mg: 8, percent: 40 },
  { month: "Månad 5", mg: 4, percent: 20 },
  { month: "Månad 6", mg: 0, percent: 0 },
];

export default function HowItWorksPage() {
  return (
    <SiteShell activeHref="/hur-det-fungerar">
      {/* Hero */}
      <section className="border-b border-step-border bg-step-bg py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold tracking-[0.25em] text-step-gold">METODEN</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Vetenskapligt upplägg.<br />
            <span className="text-step-gold">Din takt.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-step-muted">
            Plötsliga avhoppsförsök misslyckas i 95% av fallen. STEP bygger på en kontrollerad
            minskning som gör att din hjärna hinner anpassa sig gradvis.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="rounded border border-step-gold px-6 py-3 text-sm font-semibold text-step-gold transition hover:bg-step-gold hover:text-black"
            >
              Välj din plan →
            </Link>
            <Link
              href="/faq"
              className="rounded border border-step-border px-6 py-3 text-sm font-semibold text-step-muted transition hover:border-white/40 hover:text-white"
            >
              Vanliga frågor
            </Link>
          </div>
        </div>
      </section>

      {/* Step-by-step */}
      <section className="border-b border-step-border py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.25em] text-step-gold">6 ENKLA STEG</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Så fungerar det</h2>
          </div>

          <div className="relative mt-16">
            {/* Connector line */}
            <div className="absolute left-[calc(theme(spacing.7)/2+theme(spacing.px))] top-8 hidden h-[calc(100%-4rem)] w-px bg-step-border lg:left-1/2 lg:block" />

            <div className="space-y-10">
              {STEPS.map((step, i) => (
                <div
                  key={step.number}
                  className={`relative flex flex-col gap-6 lg:flex-row lg:items-start ${
                    i % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content card */}
                  <div className="flex-1 rounded-xl border border-step-border bg-step-card p-6 transition hover:border-step-gold/30 lg:max-w-md">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-step-gold/30 bg-step-gold/10 text-step-gold">
                        {step.icon}
                      </div>
                      <div>
                        <span className="text-xs font-bold tracking-widest text-step-gold">
                          {step.number}
                        </span>
                        <h3 className="mt-0.5 text-lg font-bold text-white">{step.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-step-muted">{step.body}</p>
                      </div>
                    </div>
                  </div>

                  {/* Center dot on connector */}
                  <div className="hidden w-8 shrink-0 items-center justify-center lg:flex">
                    <div className="h-4 w-4 rounded-full border-2 border-step-gold bg-step-bg" />
                  </div>

                  {/* Spacer */}
                  <div className="flex-1 lg:max-w-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Visual nicotine curve */}
      <section className="border-b border-step-border py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.25em] text-step-gold">NEDTRAPPNINGSKURVAN</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Steg för steg mot 0 mg</h2>
            <p className="mt-3 text-step-muted">Exempelplan: start vid 20 mg, 6 månader</p>
          </div>

          <div className="mt-12 space-y-3">
            {CURVE_EXAMPLE.map((point) => (
              <div key={point.month} className="flex items-center gap-4">
                <span className="w-20 shrink-0 text-right text-sm text-step-muted">{point.month}</span>
                <div className="relative h-8 flex-1 overflow-hidden rounded-full bg-step-card">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-step-gold to-step-olive transition-all duration-700"
                    style={{ width: `${point.percent === 0 ? 2 : point.percent}%` }}
                  />
                  {point.percent === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold text-step-gold">FRIHET</span>
                    </div>
                  )}
                </div>
                <span className="w-12 shrink-0 text-sm font-semibold text-white">
                  {point.mg === 0 ? "0 mg" : `${point.mg} mg`}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded border border-step-gold px-6 py-3 text-sm font-semibold text-step-gold transition hover:bg-step-gold hover:text-black"
            >
              Börja din nedtrappning →
            </Link>
          </div>
        </div>
      </section>

      {/* Science block */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-step-gold">VARFÖR DET FUNGERAR</p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Hjärnvetenskap, inte viljestyrka
              </h2>
              <p className="mt-4 text-step-muted leading-relaxed">
                Nikotin förändrar hjärnans belöningssystem. En plötslig avhoppning skapar starka
                abstinensreaktioner som triggar återfall — inte för att du är svag, utan för att
                hjärnan motarbetar dig.
              </p>
              <p className="mt-4 text-step-muted leading-relaxed">
                Med en gradvis minskning hinner receptorerna återhämta sig i lugn takt. Varje
                leverans är ett litet steg din hjärna knappt märker av — men som summerar till full
                frihet.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 content-start">
              {[
                { stat: "~6–8 veckor", label: "för att hjärnans nikotinreceptorer normaliserats vid gradvis nedtrappning" },
                { stat: "3–4×", label: "högre sannolikhet att lyckas jämfört med kall kalkonen" },
                { stat: "0 mg", label: "målet — och medlet är tid, inte viljestyrka" },
                { stat: "Diskret", label: "frakt varje månad, ingen prenumeration som syns på kontoutdraget" },
              ].map((item) => (
                <div key={item.stat} className="rounded-lg border border-step-border bg-step-card p-4">
                  <p className="text-2xl font-black text-step-gold">{item.stat}</p>
                  <p className="mt-1 text-xs text-step-muted leading-snug">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
