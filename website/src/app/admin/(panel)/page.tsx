import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminHomePage() {
  const [navCount, planCount, trustCount, pageCount, subCount, orderCount, pendingOrders, userCount] =
    await Promise.all([
      prisma.navLink.count(),
      prisma.plan.count(),
      prisma.trustItem.count(),
      prisma.contentPage.count(),
      prisma.subscription.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.user.count(),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Översikt</h1>
      <p className="mt-2 text-sm text-step-muted">
        Redigera allt publikt innehåll från menyn till vänster. Ändringar syns direkt på sajten.
      </p>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard href="/admin/subscriptions" label="Prenumerationer" value={subCount} />
        <StatCard
          href="/admin/orders"
          label="Ordrar"
          value={orderCount}
          badge={pendingOrders > 0 ? `${pendingOrders} väntande` : undefined}
        />
        <StatCard href="/admin/users" label="Användare" value={userCount} />
        <StatCard href="/admin/plans" label="Planer" value={planCount} />
        <StatCard href="/admin/trust" label="Förtroendeikoner" value={trustCount} />
        <StatCard href="/admin/pages" label="CMS-sidor" value={pageCount} />
      </ul>
      <p className="mt-10 text-sm text-step-muted">
        Publik startsida: <Link className="text-step-gold underline" href="/">/</Link> · Shop:{" "}
        <Link className="text-step-gold underline" href="/shop">
          /shop
        </Link>
      </p>
    </div>
  );
}

function StatCard({
  href,
  label,
  value,
  badge,
}: {
  href: string;
  label: string;
  value: number;
  badge?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="block rounded-lg border border-step-border bg-step-card p-5 transition hover:border-step-gold/50"
      >
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="mt-1 text-sm text-step-muted">{label}</p>
        {badge ? (
          <p className="mt-1 rounded bg-amber-950/60 px-2 py-0.5 text-xs text-amber-200 inline-block">{badge}</p>
        ) : null}
      </Link>
    </li>
  );
}
