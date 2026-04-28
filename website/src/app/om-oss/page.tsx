import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";

export const metadata = {
  title: "Om oss — STEP",
  description: "STEP grundades i Sverige med ett enkelt mål: ge fler människor en realistisk väg ut ur nikotinberoende.",
};

const VALUES = [
  {
    title: "Gradvis, inte brutal",
    body: "Vi tror inte på viljestyrka som strategi. Vi tror på system. Hjärnan behöver tid — och det ger vi den.",
    icon: "🧠",
  },
  {
    title: "Transparens",
    body: "Exakt vad du betalar, exakt vad du får och exakt vilken styrka varje leverans innehåller. Inga överraskningar.",
    icon: "🔍",
  },
  {
    title: "Kvalitet utan kompromiss",
    body: "Varje produkt tillverkas under strikta standarder. Vi sätter aldrig pris framför produkt.",
    icon: "✦",
  },
  {
    title: "Diskretion",
    body: "Diskreta förpackningar, neutral märkning på kontoutdrag. Din resa är din.",
    icon: "🔒",
  },
];

const TIMELINE = [
  { year: "2022", text: "STEP grundas i Stockholm av ett team med erfarenhet inom hälsoteknik och beroendeforskning." },
  { year: "2023", text: "Pilotlansering med 200 testanvändare. 89% rapporterade minskad konsumtion efter 6 månader." },
  { year: "2024", text: "Fullskalig lansering. Över 1 000 aktiva prenumeranter vid årets slut." },
  { year: "2025", text: "STEP passerar 2 000 aktiva användare och expanderar sitt produktsortiment." },
  { year: "2026", text: "Internationell lansering planeras. Vi fortsätter förbättra appen och programuppföljning." },
];

export default function AboutPage() {
  return (
    <SiteShell activeHref="/om-oss">
      {/* Hero */}
      <section className="border-b border-step-border py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-step-gold">VÅR HISTORIA</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight text-white sm:text-5xl">
                Vi startade STEP för att traditionella metoder är för hårda.
              </h1>
            </div>
            <div>
              <p className="text-lg leading-relaxed text-step-muted">
                Grundarna av STEP försökte själva sluta med nikotin — upprepade gånger, med viljestyrka,
                nikotintuggummin och appar. Inget höll länge.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-step-muted">
                Lösningen visade sig vara enkel: sluta inte abrupt. Trappa ner, en månad i taget,
                med rätt produkt i handen. STEP är det systemet — automatiserat och utan att kräva
                dagliga beslut.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-step-border py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-[0.25em] text-step-gold">VÅRA VÄRDERINGAR</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Vad vi tror på</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-step-border bg-step-card p-6 transition hover:border-step-gold/30"
              >
                <span className="text-3xl">{v.icon}</span>
                <h3 className="mt-3 text-sm font-bold text-white">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-step-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-b border-step-border py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-[0.25em] text-step-gold">TIDSLINJE</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Från idé till rörelse</h2>
          <div className="relative mt-10 space-y-0">
            <div className="absolute left-[35px] top-0 h-full w-px bg-step-border" />
            {TIMELINE.map((item) => (
              <div key={item.year} className="relative flex gap-6 pb-10 last:pb-0">
                <div className="relative z-10 flex h-[70px] w-[70px] shrink-0 items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-step-gold/40 bg-step-card text-xs font-bold text-step-gold">
                    {item.year.slice(2)}
                  </div>
                </div>
                <div className="pt-4">
                  <span className="text-xs font-bold text-step-gold">{item.year}</span>
                  <p className="mt-1 text-sm leading-relaxed text-step-muted">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">Redo att ta det första steget?</h2>
          <p className="mt-4 text-step-muted">
            Det bästa tillfället att börja var igår. Det näst bästa är nu.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/shop"
              className="rounded border border-step-gold px-6 py-3 text-sm font-semibold text-step-gold transition hover:bg-step-gold hover:text-black"
            >
              Se planer →
            </Link>
            <Link
              href="/kontakt"
              className="rounded border border-step-border px-6 py-3 text-sm font-semibold text-step-muted transition hover:border-white/30 hover:text-white"
            >
              Kontakta oss
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
