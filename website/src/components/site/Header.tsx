import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/siteSettings";
import { SiteNavLogo } from "@/components/site/SiteNavLogo";
import { ThemeSwitcher } from "@/components/site/ThemeSwitcher";
import { MobileNav } from "@/components/site/MobileNav";

export async function Header({ activeHref }: { activeHref?: string }) {
  const [session, settings, nav] = await Promise.all([
    auth(),
    getSettings(),
    prisma.navLink.findMany({ where: { visible: true }, orderBy: { sort: "asc" } }),
  ] as const);

  const navItems = nav.map((item) => ({ href: item.href, label: item.label }));
  const navHrefs = new Set(nav.map((n) => n.href));
  const extraLinks = [
    { href: "/hur-det-fungerar", label: "HUR DET FUNGERAR" },
    { href: "/faq", label: "FAQ" },
  ].filter((l) => !navHrefs.has(l.href));

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-step-border bg-step-bg/90 backdrop-blur-md">
      <div className="mx-auto grid h-20 max-w-6xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 overflow-visible px-4 sm:px-6">
        <Link
          href="/"
          className="group relative z-10 inline-grid h-20 shrink-0 grid-cols-1 grid-rows-1 items-center justify-items-start justify-self-start overflow-visible rounded-lg outline-none transition hover:opacity-95 focus-visible:ring-2 focus-visible:ring-step-gold focus-visible:ring-offset-2 focus-visible:ring-offset-step-bg"
        >
          <SiteNavLogo
            siteName={settings.siteName}
            navLogoUrl={settings.navLogoUrl}
            className="group-hover:opacity-95 col-start-1 row-start-1"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden w-full min-w-0 items-center justify-center gap-6 md:flex">
          <Link
            href="/"
            className={`text-xs font-semibold tracking-widest transition-colors ${
              activeHref === "/" ? "text-step-gold" : "text-step-muted hover:text-white"
            }`}
          >
            HEM
          </Link>
          {nav.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`text-xs font-semibold tracking-widest transition-colors ${
                activeHref === item.href ? "text-step-gold" : "text-step-muted hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {extraLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs font-semibold tracking-widest transition-colors ${
                activeHref === item.href ? "text-step-gold" : "text-step-muted hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center justify-end gap-3 justify-self-end">
          <ThemeSwitcher />
          {session?.user?.id ? (
            <Link
              href="/konto"
              className={`hidden text-xs font-semibold tracking-widest sm:inline md:inline ${
                activeHref === "/konto" ? "text-step-gold" : "text-step-muted hover:text-white"
              }`}
            >
              MITT KONTO
            </Link>
          ) : (
            <>
              <Link
                href="/auth/logga-in"
                className="hidden text-xs font-semibold tracking-widest text-step-muted hover:text-white md:inline"
              >
                LOGGA IN
              </Link>
              <Link
                href="/auth/registrera"
                className="hidden text-xs font-semibold tracking-widest text-step-gold hover:underline md:inline"
              >
                REGISTRERA
              </Link>
            </>
          )}
          <Link
            href={settings.navCtaHref}
            className="hidden rounded border border-step-gold px-4 py-2 text-xs font-semibold tracking-wide text-step-gold transition hover:bg-step-gold hover:text-black md:inline-flex"
          >
            {settings.navCtaLabel}
          </Link>

          {/* Mobile hamburger + drawer */}
          <MobileNav
            navItems={navItems}
            ctaLabel={settings.navCtaLabel}
            ctaHref={settings.navCtaHref}
            isLoggedIn={!!session?.user?.id}
            activeHref={activeHref}
          />
        </div>
      </div>
    </header>
  );
}
