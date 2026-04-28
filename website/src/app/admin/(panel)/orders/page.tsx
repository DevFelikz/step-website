import { prisma } from "@/lib/db";
import { adminUpdateOrder } from "@/app/actions/subscription";
import { ORDER_STATUS_LABELS } from "@/lib/planEngine";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, name: true } },
      subscription: {
        select: { plan: { select: { name: true } }, durationMonths: true },
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Ordrar</h1>
      <p className="mt-2 text-sm text-step-muted">
        Alla betalningsordrar. Markera som Betald för att aktivera prenumerationen.
      </p>

      <div className="mt-8 overflow-x-auto rounded-lg border border-step-border">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-step-border bg-step-card/50 text-xs uppercase tracking-wider text-step-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Kund</th>
              <th className="px-4 py-3 font-semibold">Plan</th>
              <th className="px-4 py-3 font-semibold">Belopp</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Skapad</th>
              <th className="px-4 py-3 font-semibold">Åtgärd</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const statusInfo =
                ORDER_STATUS_LABELS[o.status] ?? ORDER_STATUS_LABELS["PENDING"];
              const amountKr = (o.totalAmountOre / 100).toLocaleString("sv-SE", {
                style: "currency",
                currency: o.currency,
                maximumFractionDigits: 0,
              });

              return (
                <tr key={o.id} className="border-b border-step-border/80 hover:bg-step-card/30">
                  <td className="px-4 py-3">
                    <p className="text-white">{o.user.name ?? o.user.email}</p>
                    <p className="text-xs text-step-muted">{o.user.email}</p>
                  </td>
                  <td className="px-4 py-3 text-step-muted">
                    {o.subscription?.plan?.name ?? "—"}
                    {o.subscription?.durationMonths
                      ? ` · ${o.subscription.durationMonths} mån`
                      : ""}
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">{amountKr}</td>
                  <td className={`px-4 py-3 font-semibold ${statusInfo.color}`}>
                    {statusInfo.label}
                  </td>
                  <td className="px-4 py-3 text-step-muted">
                    {o.createdAt.toLocaleString("sv-SE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <OrderStatusForm order={o} />
                    <a
                      href={`/admin/orders/${o.id}`}
                      className="shrink-0 text-xs text-step-gold hover:underline"
                    >
                      Detaljer →
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {orders.length === 0 ? (
        <p className="mt-6 text-step-muted">Inga ordrar ännu.</p>
      ) : null}
    </div>
  );
}

function OrderStatusForm({
  order,
}: {
  order: {
    id: string;
    status: string;
    stripePaymentIntentId: string | null;
  };
}) {
  return (
    <form action={adminUpdateOrder} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="orderId" value={order.id} />
      <select
        name="status"
        defaultValue={order.status}
        className="rounded border border-step-border bg-step-surface px-2 py-1 text-xs text-step-muted"
      >
        <option value="PENDING">Väntar</option>
        <option value="PAID">Betald</option>
        <option value="FAILED">Misslyckades</option>
        <option value="REFUNDED">Återbetald</option>
      </select>
      <input
        name="stripePaymentIntentId"
        defaultValue={order.stripePaymentIntentId ?? ""}
        placeholder="pi_... (Stripe)"
        className="w-40 rounded border border-step-border bg-step-surface px-2 py-1 text-xs text-step-muted placeholder:text-step-muted/40"
      />
      <button
        type="submit"
        className="rounded bg-step-gold px-3 py-1 text-xs font-semibold text-black"
      >
        Spara
      </button>
    </form>
  );
}
