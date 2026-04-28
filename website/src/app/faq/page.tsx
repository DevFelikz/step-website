import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { FaqItem } from "@/components/site/FaqItem";

export const metadata = {
  title: "Vanliga frågor — STEP",
  description: "Svar på de vanligaste frågorna om STEP, vår prenumeration, leveranser och nedtrappningsmetoden.",
};

const FAQ_CATEGORIES = [
  {
    title: "Om STEP",
    items: [
      {
        q: "Vad är STEP?",
        a: "STEP är ett prenumerationsbaserat nikotinnedtrappningsprogram. Varje månad levererar vi portioner med sjunkande nikotinstyrka, anpassade efter din personliga plan. Målet är att du till slut inte behöver nikotin alls.",
      },
      {
        q: "Är STEP ett medicinskt program?",
        a: "Nej. STEP är ett livsstilsprogram och en produkt — inte medicinsk behandling eller terapi. Vi rekommenderar att du pratar med din läkare om du har frågor om din hälsa eller om du använder läkemedel.",
      },
      {
        q: "Vilka produkter ingår i STEP-planen?",
        a: "Du får premium nikotinportioner (snus-liknande portioner utan tobak) med specificerat mg-innehåll. Alla produkter är tillverkade under strikta kvalitetsstandarder och är lagliga att köpa och använda i Sverige.",
      },
    ],
  },
  {
    title: "Planer & nedtrappning",
    items: [
      {
        q: "Vilken styrka ska jag börja med?",
        a: "Börja med den styrka du normalt använder — 20, 12, 6 eller 3 mg. Om du är osäker, välj ett steg upp snarare än ner. Det är alltid lättare att trappa ner än att kämpa mot abstinens.",
      },
      {
        q: "Hur snabbt trappas styrkan ner?",
        a: "Det beror på din planens längd. Ett 6-månadersprogram minskar styrkan varje månad med ungefär 20–25%. Ett 12-månadersprogram ger en jämnare kurva. Du kan se exakt schema under din plan innan du beställer.",
      },
      {
        q: "Kan jag pausa eller förlänga mitt program?",
        a: "Ja. Logga in på ditt konto, gå till 'Prenumeration' och välj 'Pausa'. Du kan pausa i upp till 30 dagar. Vill du förlänga kontaktar du vår support så justerar vi ditt schema.",
      },
      {
        q: "Vad händer om 0 mg fortfarande känns för svårt?",
        a: "Det är vanligt att behöva längre tid på de sista stegen. Kontakta oss — vi kan justera ditt schema manuellt och skicka ett extra steg vid låg styrka.",
      },
    ],
  },
  {
    title: "Betalning & prenumeration",
    items: [
      {
        q: "Hur fungerar betalningen?",
        a: "Du betalar hela programmets kostnad vid beställning — antingen med kort, Klarna (dela upp eller betala senare) eller Swish. Inga dolda månadsavgifter.",
      },
      {
        q: "Kan jag avbryta mitt program och få pengarna tillbaka?",
        a: "Du kan avbryta när som helst. Återbetalning ges för ej levererade månader, minus en administrativ avgift på 99 kr. Kontakta support inom 14 dagar efter start för full återbetalning.",
      },
      {
        q: "Syns köpet på mitt kontoutdrag?",
        a: "Transaktionen syns som 'STEP AB' eller kortföretagets namn. Inga produktdetaljer anges i kontoutdraget.",
      },
    ],
  },
  {
    title: "Frakt & leverans",
    items: [
      {
        q: "Hur snabbt levereras den första ordern?",
        a: "Inom 2–4 vardagar från bekräftad betalning. Du får en spårningslänk via e-post när paketet skickas.",
      },
      {
        q: "Hur levereras månadspaketen?",
        a: "Automatiskt, diskret och spårbart. De flesta leveranser passar i brevlådan. Du får e-postavisering när varje leverans skickas.",
      },
      {
        q: "Levererar ni utanför Sverige?",
        a: "Just nu levererar vi enbart till Sverige. Internationell leverans är planerad till 2026.",
      },
    ],
  },
  {
    title: "Konto & support",
    items: [
      {
        q: "Hur loggar jag in på mitt konto?",
        a: "Gå till steg.se/auth/logga-in och ange din e-post och ditt lösenord. Du kan också se din leveranskalender och spårningsinformation direkt från kontoöversikten.",
      },
      {
        q: "Hur kontaktar jag supporten?",
        a: "Mejla oss på support@step.se. Vi svarar inom 24 timmar på vardagar.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <SiteShell activeHref="/faq">
      {/* Hero */}
      <section className="border-b border-step-border py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold tracking-[0.25em] text-step-gold">SUPPORT</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Vanliga frågor
          </h1>
          <p className="mt-4 text-lg text-step-muted">
            Hittar du inte svaret? Mejla{" "}
            <a href="mailto:support@step.se" className="text-step-gold underline">
              support@step.se
            </a>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="space-y-12">
            {FAQ_CATEGORIES.map((cat) => (
              <div key={cat.title}>
                <h2 className="mb-4 text-xs font-bold tracking-[0.2em] text-step-gold">
                  {cat.title.toUpperCase()}
                </h2>
                <div className="rounded-xl border border-step-border bg-step-card px-6">
                  {cat.items.map((item) => (
                    <FaqItem key={item.q} question={item.q} answer={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-xl border border-step-border bg-step-card p-8 text-center">
            <h3 className="text-lg font-semibold text-white">Fortfarande frågor?</h3>
            <p className="mt-2 text-sm text-step-muted">
              Vi hjälper dig gärna — svarstid under 24 timmar på vardagar.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="mailto:support@step.se"
                className="rounded border border-step-gold px-5 py-2.5 text-sm font-semibold text-step-gold transition hover:bg-step-gold hover:text-black"
              >
                Skicka mejl
              </a>
              <Link
                href="/kontakt"
                className="rounded border border-step-border px-5 py-2.5 text-sm font-semibold text-step-muted transition hover:border-white/30 hover:text-white"
              >
                Kontaktsida
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
