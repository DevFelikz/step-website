import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { SiteShell } from "@/components/site/SiteShell";
import { strengthLabel, DELIVERY_STATUS_LABELS } from "@/lib/planEngine";
import { TrustIcon } from "@/components/site/TrustIcon";

export default async function CheckoutConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ sub?: string; metod?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) notFound();

  const { sub: subId } = await searchParams;
  if (!subId) notFound();

  const subscription = await prisma.subscription.findFirst({
    where: { id: subId, userId: session.user.id },
    include: {
      plan: true,
      deliveries: { orderBy: { deliveryIndex: "asc" } },
      orders: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  if (!subscription) notFound();

  const order = subscription.orders[0];
  const totalKr = order ? (order.totalAmountOre / 100).toLocaleString("sv-SE") : "—";
  const firstDelivery = subscription.deliveries[0];

  return (
    <SiteShell activeHref="/shop">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Success header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-step-gold/10 text-3xl">
            ✓
          </div>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Beställning mottagen!
          </h1>
          <p className="mt-4 text-step-muted">
            Tack för din beställning. Vi behandlar din betalning och skickar en
            bekräftelse till din e-post.
          </p>
        </div>

        {/* Order summary card */}
        <div className="mt-10 rounded-xl border border-step-border bg-step-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-widest text-step-gold">ORDERSAMMANFATTNING</p>
            <span className="rounded border border-step-border px-2 py-0.5 text-xs text-amber-300">
              Väntar på betalning
            </span>
          </div>

          <div className="space-y-3 border-t border-step-border pt-5 text-sm">
            <Row label="Plan" value={subscription.plan?.name ?? "—"} />
            <Row
              label="Startstyrka"
              value={strengthLabel(subscription.startStrengthMg)}
            />
            <Row label="Programlängd" value={`${subscription.durationMonths} månader`} />
            <Row
              label="Leveranser"
              value={`${subscription.deliveries.length} st`}
            />
            {firstDelivery && (
              <Row
                label="Första leverans"
                value={firstDelivery.scheduledDate.toLocaleDateString("sv-SE")}
              />
            )}
            {order && (
              <div className="flex justify-between border-t border-step-border pt-3">
                <span className="font-semibold text-white">Totalt</span>
                <span className="font-bold text-white">{totalKr} kr</span>
              </div>
            )}
          </div>
        </div>

        {/* Delivery schedule preview */}
        <div className="mt-8">
          <h2 className="text-sm font-semibold tracking-widest text-step-gold">
            DITT NEDTRAPPNINGSPROGRAM
          </h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-step-border">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-step-border bg-step-card/50 text-xs uppercase tracking-wider text-step-muted">
                <tr>
                  <th className="px-4 py-3">Leverans</th>
                  <th className="px-4 py-3">Datum</th>
                  <th className="px-4 py-3">Styrka</th>
                </tr>
              </thead>
              <tbody>
                {subscription.deliveries.map((d) => {
                  const ds = DELIVERY_STATUS_LABELS[d.status] ?? DELIVERY_STATUS_LABELS["PENDING"];
                  return (
                    <tr key={d.id} className="border-b border-step-border/60 last:border-0">
                      <td className="px-4 py-3 text-step-muted">#{d.deliveryIndex}</td>
                      <td className="px-4 py-3 text-white">
                        {d.scheduledDate.toLocaleDateString("sv-SE")}
                      </td>
                      <td className={`px-4 py-3 font-medium ${d.strengthMg === 0 ? "text-emerald-400" : "text-white"}`}>
                        {strengthLabel(d.strengthMg)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trust row */}
        <div className="mt-8 grid grid-cols-3 gap-4 rounded-lg border border-step-border bg-step-card/40 p-5 text-center text-xs text-step-muted">
          <div className="flex flex-col items-center gap-2">
            <TrustIcon name="shield" className="h-6 w-6 text-step-gold" />
            Diskret leverans
          </div>
          <div className="flex flex-col items-center gap-2">
            <TrustIcon name="sliders" className="h-6 w-6 text-step-gold" />
            Ingen bindning
          </div>
          <div className="flex flex-col items-center gap-2">
            <TrustIcon name="target" className="h-6 w-6 text-step-gold" />
            Steg mot 0 mg
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/konto/prenumeration"
            className="inline-flex items-center gap-2 rounded-lg bg-step-gold px-8 py-4 text-sm font-bold text-black hover:bg-step-gold-dim"
          >
            Mitt konto →
          </Link>
          <Link
            href="/"
            className="text-sm text-step-muted hover:text-white"
          >
            Tillbaka till startsidan
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-step-muted">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
