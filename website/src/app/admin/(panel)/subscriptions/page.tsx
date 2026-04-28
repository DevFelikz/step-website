import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  adminSetSubscriptionStatus,
  adminUpdateDelivery,
} from "@/app/actions/subscription";
import {
  SUBSCRIPTION_STATUS_LABELS,
  DELIVERY_STATUS_LABELS,
  strengthLabel,
} from "@/lib/planEngine";

export default async function AdminSubscriptionsPage() {
  const subs = await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, name: true } },
      plan: { select: { name: true } },
      deliveries: { orderBy: { deliveryIndex: "asc" } },
      orders: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Prenumerationer</h1>
      <p className="mt-2 text-sm text-step-muted">
        Alla aktiva och historiska prenumerationer. Klicka på en för att hantera leveranser.
      </p>

      <div className="mt-8 space-y-6">
        {subs.length === 0 ? (
          <p className="text-step-muted">Inga prenumerationer ännu.</p>
        ) : (
          subs.map((sub) => {
            const statusInfo =
              SUBSCRIPTION_STATUS_LABELS[sub.status] ?? SUBSCRIPTION_STATUS_LABELS["PENDING"];
            const completedDeliveries = sub.deliveries.filter(
              (d) => d.status === "DELIVERED",
            ).length;
            const totalDeliveries = sub.deliveries.length;

            return (
              <div
                key={sub.id}
                className="rounded-lg border border-step-border bg-step-card p-5"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">
                      {sub.user.name ?? sub.user.email}
                    </p>
                    <p className="text-xs text-step-muted">{sub.user.email}</p>
                    <p className="mt-1 text-sm text-step-muted">
                      Plan: <span className="text-white">{sub.plan?.name ?? "—"}</span>
                      {" · "}Start: {strengthLabel(sub.startStrengthMg)}
                      {" · "}
                      {sub.durationMonths} mån
                    </p>
                    <p className="mt-1 text-xs text-step-muted">
                      Leveranser: {completedDeliveries}/{totalDeliveries} slutförda
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                    {/* Quick status change */}
                    <form action={adminSetSubscriptionStatus} className="flex items-center gap-2">
                      <input type="hidden" name="subscriptionId" value={sub.id} />
                      <select
                        name="status"
                        defaultValue={sub.status}
                        className="rounded border border-step-border bg-step-surface px-2 py-1 text-xs text-step-muted"
                      >
                        <option value="PENDING">Avvaktar</option>
                        <option value="ACTIVE">Aktiv</option>
                        <option value="PAUSED">Pausad</option>
                        <option value="CANCELLED">Avslutad</option>
                      </select>
                      <button type="submit" className="text-xs text-step-gold underline">
                        Spara
                      </button>
                    </form>
                  </div>
                </div>

                {/* Delivery timeline */}
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[540px] text-left text-xs">
                    <thead className="border-b border-step-border/60 text-step-muted">
                      <tr>
                        <th className="pb-2 pr-4">Lev.</th>
                        <th className="pb-2 pr-4">Datum</th>
                        <th className="pb-2 pr-4">Styrka</th>
                        <th className="pb-2 pr-4">Burkar</th>
                        <th className="pb-2 pr-4">Status</th>
                        <th className="pb-2 pr-4">Spårning</th>
                        <th className="pb-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {sub.deliveries.map((d) => {
                        const ds =
                          DELIVERY_STATUS_LABELS[d.status] ?? DELIVERY_STATUS_LABELS["PENDING"];
                        return (
                          <tr key={d.id} className="border-b border-step-border/30">
                            <td className="py-2 pr-4 text-step-muted">#{d.deliveryIndex}</td>
                            <td className="py-2 pr-4 text-white">
                              {d.scheduledDate.toLocaleDateString("sv-SE")}
                            </td>
                            <td className="py-2 pr-4 text-white">{strengthLabel(d.strengthMg)}</td>
                            <td className="py-2 pr-4 text-step-muted">{d.quantityCans}</td>
                            <td className={`py-2 pr-4 font-semibold ${ds.color}`}>{ds.label}</td>
                            <td className="py-2 pr-4 text-step-muted">
                              {d.trackingNumber ?? "—"}
                            </td>
                            <td className="py-2">
                              <DeliveryEditForm delivery={d} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <p className="mt-3 text-xs text-step-muted">
                  Skapad:{" "}
                  {sub.createdAt.toLocaleString("sv-SE", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                  {sub.orders[0] && (
                    <>
                      {" · "}Order:{" "}
                      <Link
                        href="/admin/orders"
                        className="text-step-gold underline"
                      >
                        {sub.orders[0].status}
                      </Link>
                    </>
                  )}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function DeliveryEditForm({
  delivery,
}: {
  delivery: {
    id: string;
    status: string;
    trackingNumber: string | null;
    trackingUrl: string | null;
    notes: string | null;
  };
}) {
  return (
    <details className="inline">
      <summary className="cursor-pointer text-step-gold underline">Redigera</summary>
      <div className="mt-2 rounded border border-step-border bg-step-surface p-3">
        <form action={adminUpdateDelivery} className="space-y-2">
          <input type="hidden" name="deliveryId" value={delivery.id} />
          <div>
            <label className="admin-label">Status</label>
            <select
              name="status"
              defaultValue={delivery.status}
              className="admin-input"
            >
              <option value="PENDING">Planerad</option>
              <option value="SHIPPED">Skickad</option>
              <option value="DELIVERED">Levererad</option>
              <option value="SKIPPED">Hoppad</option>
              <option value="FAILED">Misslyckades</option>
            </select>
          </div>
          <div>
            <label className="admin-label">Spårningsnummer</label>
            <input
              name="trackingNumber"
              defaultValue={delivery.trackingNumber ?? ""}
              className="admin-input"
              placeholder="1Z999..."
            />
          </div>
          <div>
            <label className="admin-label">Spårnings-URL</label>
            <input
              name="trackingUrl"
              defaultValue={delivery.trackingUrl ?? ""}
              className="admin-input"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="admin-label">Noteringar</label>
            <input
              name="notes"
              defaultValue={delivery.notes ?? ""}
              className="admin-input"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-step-gold px-4 py-1.5 text-xs font-semibold text-black"
          >
            Spara
          </button>
        </form>
      </div>
    </details>
  );
}
