import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { adminUpdateOrder } from "@/app/actions/subscription";
import { ORDER_STATUS_LABELS, SUBSCRIPTION_STATUS_LABELS, strengthLabel } from "@/lib/planEngine";
import Link from "next/link";

export const metadata = { title: "Order — Admin" };

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          addressLine1: true,
          addressLine2: true,
          postalCode: true,
          city: true,
        },
      },
      subscription: {
        include: {
          plan: { select: { name: true, priceLabel: true } },
          deliveries: { orderBy: { deliveryIndex: "asc" } },
        },
      },
    },
  });

  if (!order) notFound();

  const statusInfo = ORDER_STATUS_LABELS[order.status] ?? ORDER_STATUS_LABELS["PENDING"];
  const amountKr = (order.totalAmountOre / 100).toLocaleString("sv-SE", {
    style: "currency",
    currency: order.currency,
    maximumFractionDigits: 0,
  });

  const sub = order.subscription;
  const subStatus = sub
    ? (SUBSCRIPTION_STATUS_LABELS[sub.status] ?? SUBSCRIPTION_STATUS_LABELS["PENDING"])
    : null;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-step-muted">
        <Link href="/admin/orders" className="hover:text-white transition">
          ← Ordrar
        </Link>
        <span className="text-step-border">/</span>
        <span className="font-mono text-xs text-white/60">{order.id}</span>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Order</h1>
          <p className="mt-1 text-sm text-step-muted">
            Skapad{" "}
            {order.createdAt.toLocaleString("sv-SE", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>
        </div>
        <span className={`rounded border border-step-border px-3 py-1 text-sm font-semibold ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Customer & shipping ── */}
        <div className="rounded-lg border border-step-border bg-step-card p-6 space-y-5">
          <h2 className="text-xs font-semibold tracking-widest text-step-gold">KUND & LEVERANSADRESS</h2>

          <dl className="space-y-3 text-sm">
            <Row label="Namn" value={order.user.name ?? "—"} />
            <Row label="E-post" value={order.user.email} />
            <Row label="Telefon" value={order.user.phone ?? "—"} />
            <div className="pt-1 border-t border-step-border/50" />
            <Row label="Adress" value={order.user.addressLine1 ?? "—"} />
            {order.user.addressLine2 && (
              <Row label="" value={order.user.addressLine2} />
            )}
            <Row
              label="Ort"
              value={
                [order.user.postalCode, order.user.city].filter(Boolean).join(" ") || "—"
              }
            />
          </dl>

          <div className="pt-3 border-t border-step-border/50">
            <Link
              href={`/admin/users/${order.user.id}`}
              className="text-xs text-step-gold hover:underline"
            >
              Visa kundprofil →
            </Link>
          </div>
        </div>

        {/* ── Payment ── */}
        <div className="rounded-lg border border-step-border bg-step-card p-6 space-y-5">
          <h2 className="text-xs font-semibold tracking-widest text-step-gold">BETALNING</h2>

          <dl className="space-y-3 text-sm">
            <Row label="Belopp" value={amountKr} highlight />
            <Row label="Valuta" value={order.currency} />
            <Row label="Status" value={statusInfo.label} colorClass={statusInfo.color} />
            {order.billingName && <Row label="Faktureringsnamn" value={order.billingName} />}
            {order.billingEmail && <Row label="Faktureringsmail" value={order.billingEmail} />}
            {order.billingAddress && <Row label="Faktureringsadress" value={order.billingAddress} />}
            <div className="pt-1 border-t border-step-border/50" />
            {order.stripePaymentIntentId && (
              <Row label="Stripe PI" value={order.stripePaymentIntentId} mono />
            )}
            {order.klarnaOrderId && (
              <Row label="Klarna Order" value={order.klarnaOrderId} mono />
            )}
            {order.swishPaymentRequestId && (
              <Row label="Swish Request" value={order.swishPaymentRequestId} mono />
            )}
          </dl>

          {/* Update status form */}
          <div className="pt-4 border-t border-step-border/50">
            <p className="mb-3 text-xs font-semibold text-step-muted">Uppdatera status</p>
            <form action={adminUpdateOrder} className="flex flex-wrap gap-2">
              <input type="hidden" name="orderId" value={order.id} />
              <select
                name="status"
                defaultValue={order.status}
                className="rounded border border-step-border bg-step-surface px-3 py-2 text-sm text-white"
              >
                <option value="PENDING">Väntar</option>
                <option value="PAID">Betald</option>
                <option value="FAILED">Misslyckades</option>
                <option value="REFUNDED">Återbetald</option>
              </select>
              <input
                name="stripePaymentIntentId"
                defaultValue={order.stripePaymentIntentId ?? ""}
                placeholder="pi_... (Stripe, valfritt)"
                className="flex-1 min-w-[180px] rounded border border-step-border bg-step-surface px-3 py-2 text-sm text-white placeholder:text-step-muted/40"
              />
              <button
                type="submit"
                className="rounded bg-step-gold px-4 py-2 text-sm font-semibold text-black hover:bg-step-gold-dim"
              >
                Spara
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Subscription & plan ── */}
      {sub && (
        <div className="rounded-lg border border-step-border bg-step-card p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xs font-semibold tracking-widest text-step-gold">PRENUMERATION</h2>
            {subStatus && (
              <span className={`text-xs font-semibold ${subStatus.color}`}>
                {subStatus.label}
              </span>
            )}
          </div>

          <dl className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Row label="Plan" value={sub.plan?.name ?? "—"} />
            <Row label="Pris" value={sub.plan?.priceLabel ?? "—"} />
            <Row label="Längd" value={`${sub.durationMonths} månader`} />
            <Row label="Startstyrka" value={strengthLabel(sub.startStrengthMg)} />
          </dl>

          {/* Delivery table */}
          {sub.deliveries.length > 0 && (
            <div className="pt-4 border-t border-step-border/50">
              <p className="mb-3 text-xs font-semibold text-step-muted">LEVERANSER</p>
              <div className="overflow-x-auto rounded border border-step-border">
                <table className="w-full min-w-[420px] text-left text-sm">
                  <thead className="border-b border-step-border bg-step-surface text-xs uppercase tracking-wider text-step-muted">
                    <tr>
                      <th className="px-3 py-2">#</th>
                      <th className="px-3 py-2">Datum</th>
                      <th className="px-3 py-2">Styrka</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Spårning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sub.deliveries.map((d) => {
                      const { DELIVERY_STATUS_LABELS } = require("@/lib/planEngine");
                      const ds = DELIVERY_STATUS_LABELS[d.status] ?? DELIVERY_STATUS_LABELS["PENDING"];
                      return (
                        <tr key={d.id} className="border-b border-step-border/50 last:border-b-0">
                          <td className="px-3 py-2 text-step-muted">{d.deliveryIndex}</td>
                          <td className="px-3 py-2 text-white">
                            {d.scheduledDate.toLocaleDateString("sv-SE")}
                          </td>
                          <td className="px-3 py-2 text-white">{strengthLabel(d.strengthMg)}</td>
                          <td className={`px-3 py-2 font-semibold ${ds.color}`}>{ds.label}</td>
                          <td className="px-3 py-2 text-step-muted">
                            {d.trackingUrl ? (
                              <a href={d.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-step-gold underline">
                                {d.trackingNumber ?? "Spåra"}
                              </a>
                            ) : (
                              d.trackingNumber ?? "—"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  highlight,
  mono,
  colorClass,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
  colorClass?: string;
}) {
  return (
    <div className="flex justify-between gap-4">
      {label && <dt className="shrink-0 text-step-muted">{label}</dt>}
      <dd
        className={`text-right break-all ${
          highlight
            ? "font-bold text-white"
            : mono
              ? "font-mono text-xs text-step-muted"
              : colorClass
                ? colorClass
                : "text-white"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
