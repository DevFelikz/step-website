import { prisma } from "@/lib/db";

/** Default values used when the DB row is missing (fresh install, test env). */
export const DEFAULT_SETTINGS = {
  id: "default",
  siteName: "STEP",
  siteTagline: "Steg för steg mot mindre nikotin",
  navCtaLabel: "STARTA PLAN",
  navCtaHref: "/shop",
  heroEyebrow: "Sluta med nikotin",
  heroTitle: "Ta kontroll",
  heroTitleAccent: "steg för steg",
  heroSubtitle: "En strukturerad metod med månadsleveranser — anpassad för dig.",
  heroCtaLabel: "STARTA DIN RESA",
  heroCtaHref: "/shop",
  heroBackgroundImage: null as string | null,
  shopTitle: "Välj din nivå",
  shopSubtitle: "Vi guidar dig nedåt i styrka — i din takt.",
  plansSectionTitle: "VÅRA PLANER",
  plansSectionSubtitle: "Hitta rätt nivå för dig.",
  includedTitle: "INGÅR I ALLA PLANER",
  footerLine: "Designad i Sverige.",
  footerBlurb:
    "STEP är ett program för att trappa ner nikotin över tid — inte medicinsk rådgivning.",
  copyrightText: "STEP",
  metaTitle: "STEP — Steg för steg",
  metaDescription: "Prenumeration på nikotinportioner med planerad nedtrappning.",
  contactEmail: "support@example.com",
  contactPhone: "+46 8 123 45 67",
  contactHours: "Mån–Fre 09:00–17:00",
  contactCity: "Stockholm, Sverige",
  navLogoUrl: null as string | null,
};

export type SiteSettings = typeof DEFAULT_SETTINGS;

/**
 * Fetch siteSettings, auto-creating the row with defaults if it doesn't exist.
 * Never returns null — safe to use without null-check on every page.
 */
export async function getSettings(): Promise<SiteSettings> {
  const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  if (row) return row;

  // First boot — seed defaults
  return prisma.siteSettings.create({ data: DEFAULT_SETTINGS });
}
