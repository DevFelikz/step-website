import { getCustomPlanConfig } from "@/lib/customPlanConfig";
import { saveCustomPlanConfig } from "./actions";

export const metadata = { title: "Bygg din egna plan — Admin" };

export default async function CustomPlanAdminPage() {
  const cfg = await getCustomPlanConfig();

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold text-white">Bygg din egna plan — Inställningar</h1>
      <p className="mt-1 text-sm text-step-muted">
        Styr vilka alternativ som visas på konfiguratorssidan samt prissättning.
      </p>

      <form action={saveCustomPlanConfig} className="mt-8 space-y-10">

        {/* ── Text & labels ── */}
        <section className="rounded-xl border border-step-border bg-step-card p-6">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-step-gold">
            Text & etiketter
          </h2>
          <div className="space-y-4">
            <Field label="Sidrubrik" name="pageTitle" defaultValue={cfg.pageTitle} />
            <Field label="Sidundertext" name="pageSubtitle" defaultValue={cfg.pageSubtitle} textarea />
            <Field label="Bannertext (shop-sidan)" name="bannerTitle" defaultValue={cfg.bannerTitle} />
            <Field label="Bannerundertext" name="bannerSubtitle" defaultValue={cfg.bannerSubtitle} textarea />
            <Field label="Knapp-etikett (checkout-knapp)" name="ctaLabel" defaultValue={cfg.ctaLabel} />
          </div>
        </section>

        {/* ── Strengths ── */}
        <section className="rounded-xl border border-step-border bg-step-card p-6">
          <h2 className="mb-1 text-sm font-bold uppercase tracking-widest text-step-gold">
            Nikotinstyrkor (mg)
          </h2>
          <p className="mb-5 text-xs text-step-muted">
            Kommaseparerade heltal, t.ex. <code className="text-white">2,4,6,8,10,12,16,20</code>
          </p>
          <Field
            label="Tillgängliga styrkor"
            name="strengths"
            defaultValue={cfg.strengths.join(",")}
          />
          <p className="mt-5 mb-3 text-xs font-semibold text-step-muted uppercase tracking-wider">
            Pris per burk (kr) för varje styrka
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cfg.strengths.map((mg) => (
              <div key={mg}>
                <label className="block text-xs text-step-muted mb-1">{mg} mg</label>
                <input
                  type="number"
                  name={`price_${mg}`}
                  defaultValue={cfg.pricePerMg[mg] ?? 199}
                  min={0}
                  className="w-full rounded border border-step-border bg-step-surface px-3 py-2 text-sm text-white focus:border-step-gold focus:outline-none"
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-step-muted">
            Tips: spara först efter du ändrat styrkorna — prisfälten uppdateras när sidan laddas om.
          </p>
        </section>

        {/* ── Durations ── */}
        <section className="rounded-xl border border-step-border bg-step-card p-6">
          <h2 className="mb-1 text-sm font-bold uppercase tracking-widest text-step-gold">
            Programlängder (månader)
          </h2>
          <p className="mb-5 text-xs text-step-muted">
            Kommaseparerade heltal, t.ex. <code className="text-white">3,6,9,12</code>
          </p>
          <Field
            label="Tillgängliga längder"
            name="durations"
            defaultValue={cfg.durations.join(",")}
          />
          <p className="mt-5 mb-3 text-xs font-semibold text-step-muted uppercase tracking-wider">
            Rabatt (%) per programlängd
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {cfg.durations.map((d) => {
              const factor = cfg.discountByMonths[d] ?? 1;
              const pct = Math.round((1 - factor) * 100);
              return (
                <div key={d}>
                  <label className="block text-xs text-step-muted mb-1">{d} månader</label>
                  <div className="relative">
                    <input
                      type="number"
                      name={`discount_${d}`}
                      defaultValue={pct}
                      min={0}
                      max={100}
                      className="w-full rounded border border-step-border bg-step-surface px-3 py-2 pr-7 text-sm text-white focus:border-step-gold focus:outline-none"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-step-muted">%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Cans ── */}
        <section className="rounded-xl border border-step-border bg-step-card p-6">
          <h2 className="mb-5 text-sm font-bold uppercase tracking-widest text-step-gold">
            Burkar per leverans
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:max-w-xs">
            <div>
              <label className="block text-xs text-step-muted mb-1">Minst</label>
              <input
                type="number"
                name="minCans"
                defaultValue={cfg.minCans}
                min={1}
                max={cfg.maxCans}
                className="w-full rounded border border-step-border bg-step-surface px-3 py-2 text-sm text-white focus:border-step-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-step-muted mb-1">Mest</label>
              <input
                type="number"
                name="maxCans"
                defaultValue={cfg.maxCans}
                min={1}
                className="w-full rounded border border-step-border bg-step-surface px-3 py-2 text-sm text-white focus:border-step-gold focus:outline-none"
              />
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="rounded-lg bg-step-gold px-8 py-3 text-sm font-bold text-black transition hover:bg-step-gold-dim"
        >
          Spara inställningar
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  textarea,
}: {
  label: string;
  name: string;
  defaultValue: string;
  textarea?: boolean;
}) {
  const base =
    "w-full rounded border border-step-border bg-step-surface px-3 py-2 text-sm text-white focus:border-step-gold focus:outline-none";
  return (
    <div>
      <label className="block text-xs text-step-muted mb-1">{label}</label>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue} rows={2} className={base} />
      ) : (
        <input type="text" name={name} defaultValue={defaultValue} className={base} />
      )}
    </div>
  );
}
