import Link from "next/link";
import { prisma } from "@/lib/db";
import { deleteContentPage, upsertContentPage } from "@/app/admin/actions";

export default async function AdminCmsPagesPage() {
  const pages = await prisma.contentPage.findMany({ orderBy: { slug: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Sidor (CMS)</h1>
      <p className="mt-2 text-sm text-step-muted">
        Innehåll för dynamiska sidor som <code className="text-step-gold">/how-it-works</code>. HTML tillåtet — endast betrodda
        admins.
      </p>
      <div className="mt-10 space-y-10">
        {pages.map((p) => (
          <div key={p.id} className="max-w-3xl rounded-lg border border-step-border bg-step-card p-5">
            <p className="text-xs text-step-muted">
              Publik:{" "}
              <Link href={`/${p.slug}`} className="text-step-gold underline" target="_blank">
                /{p.slug}
              </Link>
            </p>
            <form action={upsertContentPage} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={p.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="admin-label">Slug (URL)</label>
                  <input name="slug" className="admin-input font-mono text-sm" defaultValue={p.slug} required />
                </div>
                <div>
                  <label className="admin-label">Sidtitel</label>
                  <input name="title" className="admin-input" defaultValue={p.title} required />
                </div>
              </div>
              <div>
                <label className="admin-label">HTML-innehåll</label>
                <textarea
                  name="content"
                  rows={10}
                  className="admin-input min-h-[12rem] font-mono text-xs leading-relaxed"
                  defaultValue={p.content}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-step-muted">
                <input type="checkbox" name="visible" defaultChecked={p.visible} className="rounded" />
                Publicerad
              </label>
              <button type="submit" className="rounded bg-step-gold px-4 py-2 text-sm font-semibold text-black">
                Spara sida
              </button>
            </form>
            <form action={deleteContentPage.bind(null, p.id)} className="mt-3">
              <button type="submit" className="text-xs text-red-400 hover:underline">
                Ta bort sida
              </button>
            </form>
          </div>
        ))}
        <div className="max-w-3xl rounded-lg border border-dashed border-step-border p-5">
          <p className="text-sm font-semibold text-white">Ny sida</p>
          <form action={upsertContentPage} className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="admin-label">Slug</label>
                <input name="slug" className="admin-input font-mono text-sm" placeholder="blog/start" required />
              </div>
              <div>
                <label className="admin-label">Sidtitel</label>
                <input name="title" className="admin-input" required />
              </div>
            </div>
            <div>
              <label className="admin-label">HTML</label>
              <textarea name="content" rows={8} className="admin-input font-mono text-xs" placeholder="<p>...</p>" />
            </div>
            <label className="flex items-center gap-2 text-sm text-step-muted">
              <input type="checkbox" name="visible" defaultChecked className="rounded" />
              Publicerad
            </label>
            <button type="submit" className="rounded border border-step-gold px-4 py-2 text-sm text-step-gold">
              Skapa
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
