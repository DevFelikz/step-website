import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/siteSettings";
import { SiteShell } from "@/components/site/SiteShell";
import { TrustIcon } from "@/components/site/TrustIcon";
import { sanitizeHeroImageUrl } from "@/lib/sanitizeHeroImageUrl";

export default async function HomePage() {
  const [settings, trust] = await Promise.all([
    getSettings(),
    prisma.trustItem.findMany({ where: { visible: true }, orderBy: { sort: "asc" } }),
  ]);

  const heroBg =
    sanitizeHeroImageUrl(settings.heroBackgroundImage ?? "") ?? undefined;

  return (
    <SiteShell activeHref="/">
      <section
        className={`relative min-h-[min(85vh,52rem)] overflow-hidden border-b border-step-border bg-step-bg${heroBg ? " step-dark-zone" : ""}`}
        style={
          heroBg
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(5,5,5,0.78) 0%, rgba(5,5,5,0.5) 40%, rgba(5,5,5,0.93) 100%), url(${heroBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }
            : undefined
        }
      >
        {!heroBg ? (
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,162,39,0.12),_transparent_50%)]"
            aria-hidden
          />
        ) : null}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,rgba(201,162,39,0.18),transparent_50%)]"
          aria-hidden
        />
        <div className="reveal-stagger-v relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 flex flex-col items-center text-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-step-gold">{settings.heroEyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-sm sm:text-5xl md:text-6xl">
            {settings.heroTitle}{" "}
            <span className="text-step-gold">{settings.heroTitleAccent}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/75 drop-shadow">{settings.heroSubtitle}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={settings.heroCtaHref}
              className="inline-flex items-center gap-2 rounded bg-step-olive px-8 py-4 text-sm font-semibold tracking-wide text-white shadow-lg shadow-black/30 transition hover:bg-step-olive-hover"
            >
              {settings.heroCtaLabel}
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/shop"
              className="text-sm font-medium text-white/90 underline-offset-4 hover:text-white hover:underline"
            >
              Se planer
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs text-step-muted">
            <span className="flex items-center gap-2">
              <TrustIcon name="target" className="h-4 w-4 shrink-0 text-step-gold" />
              Stegvis minskning
            </span>
            <span className="flex items-center gap-2">
              <TrustIcon name="shield" className="h-4 w-4 shrink-0 text-step-gold" />
              Premiumkvalitet
            </span>
            <span className="flex items-center gap-2">
              <TrustIcon name="sliders" className="h-4 w-4 shrink-0 text-step-gold" />
              Flexibelt &amp; enkelt
            </span>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-step-border bg-step-surface py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.25em] text-step-gold">KUNDBERÄTTELSER</p>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
              Riktiga resultat, riktiga människor
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="relative rounded-xl border border-step-border bg-step-card p-6 transition hover:border-step-gold/30"
              >
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < t.rating ? "text-step-gold" : "text-step-border"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-step-muted">"{t.quote}"</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-step-gold/10 text-sm font-bold text-step-gold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-step-muted">{t.meta}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid gap-8 text-center sm:grid-cols-3">
            {[
              { stat: "94%", label: "minskade sin konsumtion efter 6 månader" },
              { stat: "4.8/5", label: "genomsnittligt betyg från kunder" },
              { stat: "2 000+", label: "aktiva prenumeranter i Sverige" },
            ].map((s) => (
              <div key={s.stat}>
                <p className="text-4xl font-black tracking-tighter text-step-gold">{s.stat}</p>
                <p className="mt-1 text-sm text-step-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="reveal-stagger-v mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-xs font-semibold tracking-[0.25em] text-step-gold">{settings.includedTitle}</p>
          <div className="reveal-stagger-grid mt-10 grid gap-6 rounded-lg border border-step-border/80 p-6 sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-step-border">
            {trust.map((t) => (
              <div key={t.id} className="flex flex-col items-center text-center lg:px-4">
                <TrustIcon name={t.icon} className="h-8 w-8 text-step-gold" />
                <p className="mt-3 text-sm font-semibold text-white">{t.title}</p>
                <p className="mt-1 text-xs text-step-muted">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

const TESTIMONIALS = [
  {
    name: "Erik S.",
    meta: "Avslutat 12 mg-plan, Stockholm",
    rating: 5,
    quote:
      "Jag hade försökt sluta i flera år. Med STEP behövde jag inte ha viljestyrkan på topp varje dag — systemet gjorde jobbet åt mig. Efter 8 månader är jag nere på 0 mg.",
  },
  {
    name: "Maria L.",
    meta: "Pågående 6 mån-plan, Göteborg",
    rating: 5,
    quote:
      "Leveranserna kommer precis när de ska och styrkan trappas ner i en takt som känns hanterbar. Jag märker faktiskt inte av nedtrappningen — tills jag tänker på hur mycket jag använde förut.",
  },
  {
    name: "Jonas K.",
    meta: "Avslutat 20 mg-plan, Malmö",
    rating: 5,
    quote:
      "Snusade 2 dosor om dagen i 10 år. STEP-appen påminner mig och det automatiska schemat tar bort beslutsfattandet. Rekommenderar till alla som vill sluta men inte vet hur.",
  },
  {
    name: "Anna B.",
    meta: "Pågående 9 mån-plan, Uppsala",
    rating: 4,
    quote:
      "Enkelt att komma igång och supporten svarade snabbt när jag hade en fråga. Känner mig trygg med nedtrappningstakten.",
  },
  {
    name: "Peter H.",
    meta: "Avslutat 6 mg-plan, Linköping",
    rating: 5,
    quote:
      "Sista steget var att gå från 2 mg till 0. Jag trodde det skulle vara omöjligt. Men månadsintervallet gav kroppen tid att anpassa sig. Nu är jag fri.",
  },
  {
    name: "Sofie M.",
    meta: "Pågående 6 mån-plan, Örebro",
    rating: 5,
    quote:
      "Produktkvaliteten är hög och paketen är diskreta och proffsiga. Känns som ett seriöst alternativ jämfört med apotekslösningarna.",
  },
];
