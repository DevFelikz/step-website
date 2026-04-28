import { prisma } from "@/lib/db";
import { deleteNavLink, upsertNavLink } from "@/app/admin/actions";

export default async function AdminNavPage() {
  const links = await prisma.navLink.findMany({ orderBy: { sort: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Meny</h1>
      <p className="mt-2 text-sm text-step-muted">Header-länkar. Synliga = visas på sajten.</p>
      <div className="mt-10 space-y-8">
        {links.map((l) => (
          <div key={l.id} className="max-w-xl rounded-lg border border-step-border bg-step-card p-5">
            <form action={upsertNavLink} className="space-y-3">
              <input type="hidden" name="id" value={l.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="admin-label">Text</label>
                  <input name="label" className="admin-input" defaultValue={l.label} required />
                </div>
                <div>
                  <label className="admin-label">Href</label>
                  <input name="href" className="admin-input" defaultValue={l.href} required />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="admin-label">Sortering</label>
                  <input name="sort" type="number" className="admin-input w-24" defaultValue={l.sort} />
                </div>
                <label className="flex items-center gap-2 text-sm text-step-muted">
                  <input type="checkbox" name="visible" defaultChecked={l.visible} className="rounded" />
                  Synlig
                </label>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="rounded bg-step-gold px-4 py-2 text-sm font-semibold text-black">
                  Spara
                </button>
              </div>
            </form>
            <form action={deleteNavLink.bind(null, l.id)} className="mt-3">
              <button type="submit" className="text-xs text-red-400 hover:underline">
                Ta bort rad
              </button>
            </form>
          </div>
        ))}
        <div className="max-w-xl rounded-lg border border-dashed border-step-border p-5">
          <p className="text-sm font-semibold text-white">Ny länk</p>
          <form action={upsertNavLink} className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="admin-label">Text</label>
                <input name="label" className="admin-input" placeholder="OM OSS" required />
              </div>
              <div>
                <label className="admin-label">Href</label>
                <input name="href" className="admin-input" placeholder="/about" required />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="admin-label">Sortering</label>
                <input name="sort" type="number" className="admin-input w-24" defaultValue={links.length} />
              </div>
              <label className="flex items-center gap-2 text-sm text-step-muted">
                <input type="checkbox" name="visible" defaultChecked className="rounded" />
                Synlig
              </label>
            </div>
            <button type="submit" className="rounded border border-step-gold px-4 py-2 text-sm text-step-gold">
              Lägg till
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
