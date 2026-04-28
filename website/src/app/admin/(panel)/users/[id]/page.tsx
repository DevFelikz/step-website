import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { setUserBanned } from "@/app/admin/actions";

type Props = { params: Promise<{ id: string }> };

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      plan: { select: { id: true, name: true, priceLabel: true } },
    },
  });
  if (!user) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/users" className="text-sm text-step-gold underline hover:text-step-gold-dim">
        ← Till användare
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-white">Användare</h1>
      <dl className="mt-8 space-y-4 text-sm">
        <div>
          <dt className="text-step-muted">Mejl</dt>
          <dd className="mt-1 text-white">{user.email}</dd>
        </div>
        <div>
          <dt className="text-step-muted">Namn</dt>
          <dd className="mt-1 text-white">{user.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-step-muted">Plan</dt>
          <dd className="mt-1 text-white">{user.plan?.name ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-step-muted">Konto skapat</dt>
          <dd className="mt-1 text-white">
            {user.createdAt.toLocaleString("sv-SE", { dateStyle: "long", timeStyle: "short" })}
          </dd>
        </div>
        <div>
          <dt className="text-step-muted">Senast uppdaterad</dt>
          <dd className="mt-1 text-white">
            {user.updatedAt.toLocaleString("sv-SE", { dateStyle: "long", timeStyle: "short" })}
          </dd>
        </div>
        {user.banned ? (
          <div className="rounded-lg border border-red-900/60 bg-red-950/30 p-4">
            <p className="font-semibold text-red-200">Bannad</p>
            {user.bannedAt ? (
              <p className="mt-1 text-sm text-step-muted">
                {user.bannedAt.toLocaleString("sv-SE", { dateStyle: "long", timeStyle: "short" })}
              </p>
            ) : null}
            {user.banReason ? <p className="mt-2 text-sm text-red-100/90">{user.banReason}</p> : null}
          </div>
        ) : null}
      </dl>

      <div className="mt-10 space-y-6 border-t border-step-border pt-8">
        {user.banned ? (
          <form action={setUserBanned} className="space-y-3">
            <input type="hidden" name="userId" value={user.id} />
            <input type="hidden" name="action" value="unban" />
            <p className="text-sm text-step-muted">Ta bort spärr så att användaren kan logga in igen.</p>
            <button
              type="submit"
              className="rounded border border-step-border px-4 py-2 text-sm font-semibold text-white hover:bg-step-card"
            >
              Avbanna användare
            </button>
          </form>
        ) : (
          <form action={setUserBanned} className="space-y-3">
            <input type="hidden" name="userId" value={user.id} />
            <input type="hidden" name="action" value="ban" />
            <label className="block">
              <span className="admin-label">Anledning (valfritt)</span>
              <input name="reason" className="admin-input mt-1" placeholder="t.ex. Missbruk" />
            </label>
            <p className="text-xs text-step-muted">
              Användaren loggas ut och kan inte logga in igen förrän spärren tas bort.
            </p>
            <button
              type="submit"
              className="rounded bg-red-900/80 px-4 py-2 text-sm font-semibold text-red-100 hover:bg-red-900"
            >
              Banna användare
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
