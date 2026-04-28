import { prisma } from "@/lib/db";
import { deleteTrustItem, upsertTrustItem } from "@/app/admin/actions";

const icons = ["target", "shield", "truck", "sliders", "lock"];

export default async function AdminTrustPage() {
  const items = await prisma.trustItem.findMany({ orderBy: { sort: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Förtroenderad</h1>
      <p className="mt-2 text-sm text-step-muted">Ikoner under “ingår i alla planer”. Ikon: target, shield, truck, sliders, lock.</p>
      <div className="mt-10 space-y-8">
        {items.map((t) => (
          <div key={t.id} className="max-w-xl rounded-lg border border-step-border bg-step-card p-5">
            <form action={upsertTrustItem} className="space-y-3">
              <input type="hidden" name="id" value={t.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="admin-label">Ikon</label>
                  <select name="icon" className="admin-input" defaultValue={t.icon}>
                    {icons.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="admin-label">Sortering</label>
                  <input name="sort" type="number" className="admin-input w-24" defaultValue={t.sort} />
                </div>
              </div>
              <div>
                <label className="admin-label">Rubrik</label>
                <input name="title" className="admin-input" defaultValue={t.title} required />
              </div>
              <div>
                <label className="admin-label">Brödtext</label>
                <input name="body" className="admin-input" defaultValue={t.body} />
              </div>
              <label className="flex items-center gap-2 text-sm text-step-muted">
                <input type="checkbox" name="visible" defaultChecked={t.visible} className="rounded" />
                Synlig
              </label>
              <button type="submit" className="rounded bg-step-gold px-4 py-2 text-sm font-semibold text-black">
                Spara
              </button>
            </form>
            <form action={deleteTrustItem.bind(null, t.id)} className="mt-3">
              <button type="submit" className="text-xs text-red-400 hover:underline">
                Ta bort
              </button>
            </form>
          </div>
        ))}
        <div className="max-w-xl rounded-lg border border-dashed border-step-border p-5">
          <p className="text-sm font-semibold text-white">Ny rad</p>
          <form action={upsertTrustItem} className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="admin-label">Ikon</label>
                <select name="icon" className="admin-input" defaultValue="target">
                  {icons.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label">Sortering</label>
                <input name="sort" type="number" className="admin-input w-24" defaultValue={items.length} />
              </div>
            </div>
            <div>
              <label className="admin-label">Rubrik</label>
              <input name="title" className="admin-input" required />
            </div>
            <div>
              <label className="admin-label">Brödtext</label>
              <input name="body" className="admin-input" />
            </div>
            <label className="flex items-center gap-2 text-sm text-step-muted">
              <input type="checkbox" name="visible" defaultChecked className="rounded" />
              Synlig
            </label>
            <button type="submit" className="rounded border border-step-gold px-4 py-2 text-sm text-step-gold">
              Lägg till
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
