import { prisma } from "@/lib/db";

export const metadata = { title: "Nyhetsbrev — Admin" };

export default async function AdminNewsletterPage() {
  const [subscribers, history] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.sentNewsletter.findMany({ orderBy: { sentAt: "desc" }, take: 20 }),
  ]);

  const csvHref = `data:text/csv;charset=utf-8,email,datum\n${subscribers
    .map((s) => `${s.email},${s.createdAt.toISOString().slice(0, 10)}`)
    .join("\n")}`;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Nyhetsbrev</h1>
          <p className="mt-1 text-sm text-step-muted">{subscribers.length} prenumeranter totalt</p>
        </div>
        <div className="flex gap-3">
          <a
            href={csvHref}
            download="nyhetsbrev-prenumeranter.csv"
            className="rounded border border-step-border px-4 py-2 text-xs text-step-muted hover:text-white"
          >
            Exportera CSV
          </a>
          <a
            href="/admin/newsletter/skicka"
            className="rounded bg-step-gold px-4 py-2 text-xs font-semibold text-black hover:bg-step-gold-dim"
          >
            + Skicka nyhetsbrev
          </a>
        </div>
      </div>

      {/* Subscriber list */}
      <section>
        <h2 className="mb-3 text-sm font-semibold tracking-widest text-step-gold">PRENUMERANTER</h2>
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
      </section>

      {/* Send history */}
      <section>
        <h2 className="mb-3 text-sm font-semibold tracking-widest text-step-gold">SKICKADE NYHETSBREV</h2>
        {history.length === 0 ? (
          <p className="text-step-muted">Inga nyhetsbrev har skickats ännu.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-step-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-step-border bg-step-surface text-left">
                  <th className="px-4 py-3 text-xs font-semibold tracking-widest text-step-gold">Ämne</th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-widest text-step-gold">Mottagare</th>
                  <th className="px-4 py-3 text-xs font-semibold tracking-widest text-step-gold">Datum</th>
                </tr>
              </thead>
              <tbody>
                {history.map((n) => (
                  <tr key={n.id} className="border-b border-step-border/50 last:border-b-0">
                    <td className="px-4 py-3 text-white">{n.subject}</td>
                    <td className="px-4 py-3 text-step-muted">{n.recipientCount} st</td>
                    <td className="px-4 py-3 text-step-muted">
                      {n.sentAt.toLocaleDateString("sv-SE")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
