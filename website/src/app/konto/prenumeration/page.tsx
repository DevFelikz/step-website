import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { pauseSubscription, cancelSubscription } from "@/app/actions/subscription";
import {
  strengthLabel,
  DELIVERY_STATUS_LABELS,
  SUBSCRIPTION_STATUS_LABELS,
} from "@/lib/planEngine";
import Link from "next/link";

type Search = Promise<{
  sparat?: string;
  startad?: string;
  avslutad?: string;
  fel?: string;
}>;

function pauseDateValue(d: Date | null) {
  if (!d) return "";
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 10);
}

export default async function KontoPrenumerationPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const q = await searchParams;
  const session = await auth();
  const uid = session?.user?.id;
  if (!uid) redirect("/auth/logga-in?callbackUrl=/konto/prenumeration");

  const user = await prisma.user.findUnique({
    where: { id: uid },
    include: {
      plan: true,
      subscriptions: {
        where: { status: { not: "CANCELLED" } },
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          deliveries: { orderBy: { deliveryIndex: "asc" } },
          orders: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      },
    },
  });
  if (!user) return null;

  const activeSub = user.subscriptions[0] ?? null;
  const hasPause =
    activeSub?.pausedUntil && activeSub.pausedUntil > new Date();
  const pauseUntil = pauseDateValue(activeSub?.pausedUntil ?? null);

  const subStatusInfo = activeSub
    ? (SUBSCRIPTION_STATUS_LABELS[activeSub.status] ?? SUBSCRIPTION_STATUS_LABELS["PENDING"])
    : null;

  return (
    <div className="reveal-stagger-v space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Prenumeration</h1>
        <p className="mt-2 text-sm text-step-muted">
          Din aktiva plan och leveransschema.
        </p>

        {q.startad ? (
          <p className="mt-4 rounded border border-emerald-500/40 bg-emerald-950/30 px-4 py-2 text-sm text-emerald-200">
            Din prenumeration är igång! Leveranserna visas nedan.
          </p>
        ) : null}
        {q.sparat ? (
          <p className="mt-4 rounded border border-emerald-500/40 bg-emerald-950/30 px-4 py-2 text-sm text-emerald-200">
            Sparat.
          </p>
        ) : null}
        {q.avslutad ? (
          <p className="mt-4 rounded border border-amber-500/40 bg-amber-950/30 px-4 py-2 text-sm text-amber-200">
            Din prenumeration har avslutats.
          </p>
        ) : null}
        {q.fel ? (
          <p className="mt-4 rounded border border-red-500/40 bg-red-950/30 px-4 py-2 text-sm text-red-200">
            {q.fel === "plan"
              ? "Ogiltig plan — välj en från listan."
              : q.fel === "datum"
                ? "Ange ett giltigt datum för paus."
                : "Något gick fel, försök igen."}
          </p>
        ) : null}
      </div>

      {/* Active subscription status */}
      {activeSub ? (
        <>
          <div className="rounded-lg border border-step-border bg-step-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-widest text-step-gold">
                  AKTIV PRENUMERATION
                </p>
                <p className="mt-1 text-lg font-semibold text-white">
                  {user.plan?.name ?? "Plan"}
                </p>
                <p className="mt-1 text-sm text-step-muted">
                  Start: {strengthLabel(activeSub.startStrengthMg)} · {activeSub.durationMonths} månaders program
                </p>
              </div>
              {subStatusInfo && (
                <span className={`rounded border border-step-border px-3 py-1 text-sm font-semibold ${subStatusInfo.color}`}>
                  {subStatusInfo.label}
                </span>
              )}
            </div>

            {/* Order payment status */}
            {activeSub.orders[0] && (
              <p className="mt-3 text-xs text-step-muted">
                Betalning:{" "}
                <span className={`font-semibold ${activeSub.orders[0].status === "PAID" ? "text-emerald-400" : "text-amber-300"}`}>
                  {activeSub.orders[0].status === "PAID"
                    ? "Bekräftad"
                    : activeSub.orders[0].status === "PENDING"
                      ? "Väntar på betalning"
                      : activeSub.orders[0].status}
                </span>
              </p>
            )}
          </div>

          {/* Delivery timeline */}
          <div>
            <h2 className="text-lg font-semibold text-white">Leveransschema</h2>
            <p className="mt-1 text-sm text-step-muted">
              Din stegvisa nedtrappning mot 0 mg.
            </p>
            <div className="mt-4 overflow-x-auto rounded-lg border border-step-border">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="border-b border-step-border bg-step-card/50 text-xs uppercase tracking-wider text-step-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Lev.</th>
                    <th className="px-4 py-3 font-semibold">Datum</th>
                    <th className="px-4 py-3 font-semibold">Styrka</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Spårning</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSub.deliveries.map((d, i) => {
                    const ds = DELIVERY_STATUS_LABELS[d.status] ?? DELIVERY_STATUS_LABELS["PENDING"];
                    const isNext =
                      d.status === "PENDING" &&
                      activeSub.deliveries.slice(0, i).every((prev) => prev.status !== "PENDING");
                    return (
                      <tr
                        key={d.id}
                        className={`border-b border-step-border/80 ${isNext ? "bg-step-gold/5" : "hover:bg-step-card/30"}`}
                      >
                        <td className="px-4 py-3 text-step-muted">
                          #{d.deliveryIndex}
                          {isNext && (
                            <span className="ml-2 rounded bg-step-gold/20 px-1.5 py-0.5 text-xs text-step-gold">
                              Näst
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-white">
                          {d.scheduledDate.toLocaleDateString("sv-SE")}
                        </td>
                        <td className="px-4 py-3 font-medium text-white">
                          {strengthLabel(d.strengthMg)}
                          {d.strengthMg === 0 && (
                            <span className="ml-2 text-xs text-emerald-400">🎉</span>
                          )}
                        </td>
                        <td className={`px-4 py-3 text-sm font-semibold ${ds.color}`}>
                          {ds.label}
                        </td>
                        <td className="px-4 py-3 text-step-muted">
                          {d.trackingUrl ? (
                            <a
                              href={d.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-step-gold underline"
                            >
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

          {/* Pause form */}
          <form
            action={pauseSubscription}
            className="rounded-lg border border-step-border bg-step-card p-6 space-y-4"
          >
            <h2 className="text-sm font-semibold tracking-wide text-white">
              Pausa leveranser
            </h2>
            <p className="text-sm text-step-muted">
              Välj ett slutdatum för pausen. Avmarkera för att återuppta direkt.
            </p>
            <input type="hidden" name="subscriptionId" value={activeSub.id} />
            <label className="flex cursor-pointer items-center gap-2 text-sm text-step-muted">
              <input
                type="checkbox"
                name="pause"
                defaultChecked={Boolean(hasPause)}
                className="h-4 w-4 rounded border-step-border"
              />
              Pausa prenumeration
            </label>
            <div>
              <label className="admin-label" htmlFor="pausedUntil">
                Paus till (datum)
              </label>
              <input
                id="pausedUntil"
                name="pausedUntil"
                type="date"
                className="admin-input max-w-xs"
                defaultValue={pauseUntil}
              />
            </div>
            <button
              type="submit"
              className="rounded bg-step-gold px-5 py-2.5 text-sm font-semibold text-black hover:bg-step-gold-dim"
            >
              Spara paus
            </button>
          </form>

          {/* Cancel */}
          <div className="rounded-lg border border-red-900/40 bg-red-950/10 p-6">
            <h2 className="text-sm font-semibold text-red-300">Avsluta prenumeration</h2>
            <p className="mt-1 text-sm text-step-muted">
              Inga framtida leveranser skickas. Du kan starta om när som helst.
            </p>
            <form action={cancelSubscription} className="mt-4 space-y-3">
              <input type="hidden" name="subscriptionId" value={activeSub.id} />
              <div>
                <label className="admin-label" htmlFor="cancelReason">
                  Anledning (valfri)
                </label>
                <input
                  id="cancelReason"
                  name="reason"
                  className="admin-input max-w-sm"
                  placeholder="T.ex. nådde mitt mål tidigare"
                />
              </div>
              <button
                type="submit"
                className="rounded border border-red-500/50 px-5 py-2 text-sm text-red-300 hover:bg-red-950/40"
              >
                Avsluta prenumeration
              </button>
            </form>
          </div>
        </>
      ) : (
        /* No active subscription — show plan picker */
        <div className="rounded-lg border border-step-border bg-step-card p-6">
          <p className="text-sm font-semibold text-white">Ingen aktiv prenumeration</p>
          <p className="mt-2 text-sm text-step-muted">
            Välj ett program i shoppen för att starta, eller koppla en plan nedan.
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-flex items-center gap-2 rounded bg-step-olive px-6 py-3 text-sm font-semibold text-white hover:bg-step-olive-hover"
          >
            Gå till shoppen →
          </Link>

        </div>
      )}
    </div>
  );
}
