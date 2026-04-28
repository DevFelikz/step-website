import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { plan: { select: { name: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Användare</h1>
      <p className="mt-2 text-sm text-step-muted">Alla registrerade konton.</p>
      <div className="mt-8 overflow-x-auto rounded-lg border border-step-border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-step-border bg-step-card/50 text-xs uppercase tracking-wider text-step-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Mejl</th>
              <th className="px-4 py-3 font-semibold">Namn</th>
              <th className="px-4 py-3 font-semibold">Plan</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Skapad</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-step-border/80 hover:bg-step-card/30">
                <td className="px-4 py-3 text-white">{u.email}</td>
                <td className="px-4 py-3 text-step-muted">{u.name ?? "—"}</td>
                <td className="px-4 py-3 text-step-muted">{u.plan?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  {u.banned ? (
                    <span className="rounded bg-red-950/60 px-2 py-0.5 text-xs text-red-200">Bannad</span>
                  ) : (
                    <span className="text-step-muted">Aktiv</span>
                  )}
                </td>
                <td className="px-4 py-3 text-step-muted">
                  {u.createdAt.toLocaleString("sv-SE", { dateStyle: "short", timeStyle: "short" })}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="text-step-gold underline hover:text-step-gold-dim"
                  >
                    Visa
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 ? <p className="mt-6 text-step-muted">Inga användare ännu.</p> : null}
    </div>
  );
}
