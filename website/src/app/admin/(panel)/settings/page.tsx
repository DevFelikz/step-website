import { prisma } from "@/lib/db";
import { updateSiteSettings } from "@/app/admin/actions";
import { HeroBackgroundField } from "./HeroBackgroundField";
import { NavLogoField } from "./NavLogoField";

export default async function AdminSettingsPage() {
  const s = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  if (!s) return <p>Saknar inställningar.</p>;

  const fields: { key: keyof typeof s; label: string; rows?: number; hint?: string }[] = [
    { key: "siteTagline", label: "Tagline (under logotyp/sidnamn)" },
    { key: "navCtaLabel", label: "Knapp i header" },
    { key: "navCtaHref", label: "Header-knapp länk" },
    { key: "heroEyebrow", label: "Hero — överrubrik" },
    { key: "heroTitle", label: "Hero — rubrik (vit del)" },
    { key: "heroTitleAccent", label: "Hero — rubrik (guld del)" },
    { key: "heroSubtitle", label: "Hero — brödtext", rows: 3 },
    { key: "heroCtaLabel", label: "Hero — primär knapptext" },
    { key: "heroCtaHref", label: "Hero — primär knapp länk" },
    { key: "shopTitle", label: "Shop-sida rubrik" },
    { key: "shopSubtitle", label: "Shop-sida underrubrik", rows: 2 },
    { key: "plansSectionTitle", label: "Startsida — plansektion överrubrik" },
    { key: "plansSectionSubtitle", label: "Startsida — plansektion rubrik" },
    { key: "includedTitle", label: "Rubrik “ingår i alla planer”" },
    { key: "footerLine", label: "Sidfot — kort rad" },
    { key: "footerBlurb", label: "Sidfot — beskrivning", rows: 3 },
    { key: "copyrightText", label: "Copyright-namn" },
    { key: "metaTitle", label: "SEO titel" },
    { key: "metaDescription", label: "SEO beskrivning", rows: 2 },
    { key: "contactEmail", label: "Kontakt mejl" },
    { key: "contactPhone", label: "Kontakt telefon" },
    { key: "contactHours", label: "Kontakt öppettider" },
    { key: "contactCity", label: "Kontakt ort/rad" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Webbplats</h1>
      <p className="mt-2 text-sm text-step-muted">Alla texter som styr landningssidor, SEO och sidfot.</p>
      <form action={updateSiteSettings} className="mt-10 max-w-2xl space-y-5">
        <div>
          <label className="admin-label" htmlFor="siteName">
            Sidnamn / varumärke
          </label>
          <input
            id="siteName"
            name="siteName"
            className="admin-input"
            defaultValue={String(s.siteName ?? "")}
          />
        </div>
        <NavLogoField initialValue={String(s.navLogoUrl ?? "")} />
        {fields.map(({ key, label, rows, hint }) =>
          key === "heroCtaHref" ? (
            <div key={key}>
              <div>
                <label className="admin-label" htmlFor={key}>
                  {label}
                </label>
                <input id={key} name={key} className="admin-input" defaultValue={String(s[key] ?? "")} />
              </div>
              <div className="mt-5">
                <HeroBackgroundField initialValue={String(s.heroBackgroundImage ?? "")} />
              </div>
            </div>
          ) : (
            <div key={key}>
              <label className="admin-label" htmlFor={key}>
                {label}
              </label>
              {rows ? (
                <textarea
                  id={key}
                  name={key}
                  rows={rows}
                  className="admin-input min-h-[4rem]"
                  defaultValue={String(s[key] ?? "")}
                />
              ) : (
                <input id={key} name={key} className="admin-input" defaultValue={String(s[key] ?? "")} />
              )}
              {hint ? <p className="mt-1 text-xs text-step-muted">{hint}</p> : null}
            </div>
          ),
        )}
        <button
          type="submit"
          className="rounded bg-step-gold px-6 py-3 text-sm font-semibold text-black hover:bg-step-gold-dim"
        >
          Spara allt
        </button>
      </form>
    </div>
  );
}
