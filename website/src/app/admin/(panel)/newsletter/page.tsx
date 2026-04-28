import { prisma } from "@/lib/db";

export const metadata = { title: "Nyhetsbrev — Admin" };

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Nyhetsbrev</h1>
          <p className="mt-1 text-sm text-step-muted">{subscribers.length} prenumeranter totalt</p>
        </div>
        <a
          href={`data:text/csv;charset=utf-8,email,datum\n${subscribers.map((s) => `${s.email},${s.createdAt.toISOString().slice(0, 10)}`).join("\n")}`}
          download="nyhetsbrev-prenumeranter.csv"
          className="rounded border border-step-border px-4 py-2 text-xs text-step-muted hover:text-white"
        >
          Exportera CSV
        </a>
      </div>

      {subscribers.length === 0 ? (
        <p className="text-step-muted">Inga prenumeranter ännu.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-step-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-step-border bg-step-surface text-left">
                <th className="px-4 py-3 text-xs font-semibold tracking-widest text-step-gold">E-post</th>
                <th className="px-4 py-3 text-xs font-semibold tracking-widest text-step-gold">Datum</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-step-border/50 last:border-b-0">
                  <td className="px-4 py-3 text-white">{sub.email}</td>
                  <td className="px-4 py-3 text-step-muted">
                    {sub.createdAt.toLocaleDateString("sv-SE")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
