import { SiteShell } from "@/components/site/SiteShell";
import { getSettings } from "@/lib/siteSettings";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Kontakt — STEP",
  description: "Kontakta STEP. Vi svarar på mejl inom 24 timmar på vardagar.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <SiteShell activeHref="/kontakt">
      {/* Hero */}
      <section className="border-b border-step-border py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <p className="text-xs font-semibold tracking-[0.25em] text-step-gold">KONTAKT</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">
            Hur kan vi hjälpa dig?
          </h1>
          <p className="mt-4 text-step-muted">
            Vi svarar på alla mejl inom 24 timmar på vardagar.
          </p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_400px]">
          {/* Contact form */}
          <div>
            <h2 className="mb-6 text-lg font-semibold text-white">Skicka ett meddelande</h2>
            <ContactForm />
          </div>

          {/* Info */}
          <div className="space-y-8">
            {[
              {
                label: "E-post",
                value: settings.contactEmail,
                href: `mailto:${settings.contactEmail}`,
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                label: "Telefon",
                value: settings.contactPhone,
                href: `tel:${settings.contactPhone?.replace(/\s/g, "")}`,
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ),
              },
              {
                label: "Öppettider",
                value: settings.contactHours,
                href: null,
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                label: "Adress",
                value: settings.contactCity,
                href: null,
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-step-border bg-step-card text-step-gold">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide text-step-muted">{item.label.toUpperCase()}</p>
                  {item.href ? (
                    <a href={item.href} className="mt-0.5 text-sm font-medium text-white hover:text-step-gold transition">
                      {item.value}
                    </a>
                  ) : (
                    <p className="mt-0.5 text-sm text-white">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
