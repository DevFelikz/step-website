import Link from "next/link";
import { getSettings } from "@/lib/siteSettings";
import { prisma } from "@/lib/db";
import { TrustIcon } from "./TrustIcon";
import { PaymentLogos } from "./PaymentLogos";
import { NewsletterSignup } from "./NewsletterSignup";

export async function Footer() {
  const [settings, nav] = await Promise.all([
    getSettings(),
    prisma.navLink.findMany({ where: { visible: true }, orderBy: { sort: "asc" } }),
  ]);

  return (
    <footer className="border-t border-step-border bg-step-surface">
      <div className="reveal-stagger-v">
        {/* Newsletter band */}
        <div className="border-b border-step-border bg-step-card">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <p className="text-sm font-semibold text-white">Håll dig uppdaterad</p>
              <p className="mt-0.5 text-xs text-step-muted">
                Tips, erbjudanden och nyheter om nedtrappning — max ett mejl i månaden.
              </p>
            </div>
            <div className="sm:w-96">
              <NewsletterSignup />
            </div>
          </div>
        </div>

        <div className="reveal-stagger-grid mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <div>
            <p className="font-black italic tracking-tight text-white">{settings.siteName}</p>
            <p className="mt-2 text-sm text-step-muted">{settings.footerLine}</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-step-muted">
              {settings.footerBlurb}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest text-step-gold">Navigation</p>
            <ul className="mt-4 space-y-2">
              {nav.map((l) => (
                <li key={l.id}>
                  <Link href={l.href} className="text-sm text-step-muted hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest text-step-gold">Företaget</p>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/om-oss", label: "Om oss" },
                { href: "/hur-det-fungerar", label: "Hur det fungerar" },
                { href: "/faq", label: "Vanliga frågor" },
                { href: "/kontakt", label: "Kontakt" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-step-muted hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-widest text-step-gold">Kontakt</p>
            <ul className="mt-4 space-y-2 text-sm text-step-muted">
              <li>{settings.contactCity}</li>
              <li>
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-step-gold">
                  {settings.contactEmail}
                </a>
              </li>
              <li>{settings.contactPhone}</li>
              <li>{settings.contactHours}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-step-border py-6">
          {/* Trust badges */}
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-6 px-4 text-xs text-step-muted sm:px-6">
            <span className="flex items-center gap-2">
              <TrustIcon name="lock" className="h-4 w-4 text-step-gold" />
              Säker utcheckning
            </span>
            <span className="flex items-center gap-2">
              <TrustIcon name="truck" className="h-4 w-4 text-step-gold" />
              Diskret leverans
            </span>
            <span className="flex items-center gap-2">
              <TrustIcon name="target" className="h-4 w-4 text-step-gold" />
              Ingen bindning
            </span>
          </div>

          {/* Payment logos */}
          <div className="mx-auto mt-5 flex max-w-6xl flex-col items-center gap-3 px-4 sm:flex-row sm:justify-between sm:px-6">
            <p className="text-xs text-step-muted/60">Accepterade betalsätt</p>
            <PaymentLogos />
          </div>

          <p className="mt-5 text-center text-xs text-step-muted/60">
            © {new Date().getFullYear()} {settings.copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}
