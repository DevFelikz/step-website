import { prisma } from "@/lib/db";
import { deletePlan, upsertPlan } from "@/app/admin/actions";
import { PlanCardImageField } from "./PlanCardImageField";

function bulletsToText(json: string) {
  try {
    return (JSON.parse(json) as string[]).join("\n");
  } catch {
    return "";
  }
}

export default async function AdminPlansPage() {
  const plans = await prisma.plan.findMany({ orderBy: { sort: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Planer</h1>
      <p className="mt-2 text-sm text-step-muted">Priskort på startsida och shop. Punkter = en rad per punkt.</p>
      <div className="mt-10 space-y-10">
        {plans.map((p) => (
          <div key={p.id} className="max-w-2xl rounded-lg border border-step-border bg-step-card p-5">
            <form action={upsertPlan} className="space-y-4">
              <input type="hidden" name="id" value={p.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="admin-label">Namn</label>
                  <input name="name" className="admin-input" defaultValue={p.name} required />
                </div>
                <div>
                  <label className="admin-label">Underrubrik</label>
                  <input name="subtitle" className="admin-input" defaultValue={p.subtitle} />
                </div>
              </div>
              <div>
                <label className="admin-label">Beskrivning</label>
                <textarea name="description" className="admin-input min-h-[4rem]" defaultValue={p.description} />
              </div>
              <PlanCardImageField defaultValue={p.cardImage ?? ""} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="admin-label">Prisetikett</label>
                  <input name="priceLabel" className="admin-input" defaultValue={p.priceLabel} />
                </div>
                <div>
                  <label className="admin-label">Burkar / månad etikett</label>
                  <input name="cansLabel" className="admin-input" defaultValue={p.cansLabel} />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="admin-label">Bricka (t.ex. MEST POPULÄR)</label>
                  <input name="badge" className="admin-input" defaultValue={p.badge ?? ""} />
                </div>
                <div>
                  <label className="admin-label">Knapplänk</label>
                  <input name="ctaHref" className="admin-input" defaultValue={p.ctaHref} />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="admin-label">Knapptext</label>
                  <input name="ctaLabel" className="admin-input" defaultValue={p.ctaLabel} />
                </div>
                <div>
                  <label className="admin-label">Sortering</label>
                  <input name="sort" type="number" className="admin-input w-24" defaultValue={p.sort} />
                </div>
              </div>
              <div>
                <label className="admin-label">Punkter (en per rad)</label>
                <textarea name="bullets" className="admin-input min-h-[6rem] font-mono text-xs" defaultValue={bulletsToText(p.bullets)} />
              </div>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm text-step-muted">
                  <input type="checkbox" name="featured" defaultChecked={p.featured} className="rounded" />
                  Utvald stil (guldram)
                </label>
                <label className="flex items-center gap-2 text-sm text-step-muted">
                  <input type="checkbox" name="visible" defaultChecked={p.visible} className="rounded" />
                  Synlig
                </label>
              </div>
              <button type="submit" className="rounded bg-step-gold px-4 py-2 text-sm font-semibold text-black">
                Spara plan
              </button>
            </form>
            <form action={deletePlan.bind(null, p.id)} className="mt-3">
              <button type="submit" className="text-xs text-red-400 hover:underline">
                Ta bort plan
              </button>
            </form>
          </div>
        ))}
        <div className="max-w-2xl rounded-lg border border-dashed border-step-border p-5">
          <p className="text-sm font-semibold text-white">Ny plan</p>
          <form action={upsertPlan} className="mt-4 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="admin-label">Namn</label>
                <input name="name" className="admin-input" required />
              </div>
              <div>
                <label className="admin-label">Underrubrik</label>
                <input name="subtitle" className="admin-input" />
              </div>
            </div>
            <div>
              <label className="admin-label">Beskrivning</label>
              <textarea name="description" className="admin-input min-h-[3rem]" />
            </div>
            <PlanCardImageField defaultValue="" />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="admin-label">Prisetikett</label>
                <input name="priceLabel" className="admin-input" placeholder="599 kr / månad" />
              </div>
              <div>
                <label className="admin-label">Burkar etikett</label>
                <input name="cansLabel" className="admin-input" placeholder="15 BURKAR / MÅNAD" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="admin-label">Bricka</label>
                <input name="badge" className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Knapplänk</label>
                <input name="ctaHref" className="admin-input" defaultValue="/shop" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="admin-label">Knapptext</label>
                <input name="ctaLabel" className="admin-input" defaultValue="BÖRJA HÄR" />
              </div>
              <div>
                <label className="admin-label">Sortering</label>
                <input name="sort" type="number" className="admin-input w-24" defaultValue={plans.length} />
              </div>
            </div>
            <div>
              <label className="admin-label">Punkter</label>
              <textarea name="bullets" className="admin-input min-h-[5rem] font-mono text-xs" />
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm text-step-muted">
                <input type="checkbox" name="featured" className="rounded" />
                Utvald
              </label>
              <label className="flex items-center gap-2 text-sm text-step-muted">
                <input type="checkbox" name="visible" defaultChecked className="rounded" />
                Synlig
              </label>
            </div>
            <button type="submit" className="rounded border border-step-gold px-4 py-2 text-sm text-step-gold">
              Skapa plan
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
