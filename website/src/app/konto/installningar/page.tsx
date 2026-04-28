import { auth } from "@/auth";
import { updateUserPreferences } from "@/app/actions/user-account";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

type Search = Promise<{ sparat?: string }>;

export default async function KontoInstallningarPage({ searchParams }: { searchParams: Search }) {
  const q = await searchParams;
  const session = await auth();
  const uid = session?.user?.id;
  if (!uid) redirect("/auth/logga-in?callbackUrl=/konto/installningar");
  const user = await prisma.user.findUnique({ where: { id: uid } });
  if (!user) return null;

  return (
    <div className="reveal-stagger-v">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Inställningar</h1>
      <p className="mt-2 text-sm text-step-muted">Notiser och språk för kontot.</p>
      {q.sparat ? (
        <p className="mt-4 rounded border border-emerald-500/40 bg-emerald-950/30 px-4 py-2 text-sm text-emerald-200">
          Sparat.
        </p>
      ) : null}

      <form action={updateUserPreferences} className="mt-10 space-y-6 rounded-lg border border-step-border bg-step-card p-6">
        <div>
          <p className="text-sm font-semibold text-white">Mejlnotiser</p>
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-step-muted">
            <input
              type="checkbox"
              name="notifyShipmentEmail"
              defaultChecked={user.notifyShipmentEmail}
              className="h-4 w-4 rounded border-step-border"
            />
            Leverans- och spårningsuppdateringar
          </label>
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-step-muted">
            <input
              type="checkbox"
              name="notifyMarketingEmail"
              defaultChecked={user.notifyMarketingEmail}
              className="h-4 w-4 rounded border-step-border"
            />
            Tips, erbjudanden och nyheter (valfritt)
          </label>
        </div>
        <div>
          <label className="admin-label" htmlFor="locale">
            Språk / locale
          </label>
          <select id="locale" name="locale" className="admin-input max-w-xs" defaultValue={user.locale ?? "sv"}>
            <option value="sv">Svenska (sv)</option>
            <option value="en">English (en)</option>
          </select>
          <p className="mt-1 text-xs text-step-muted">Används för framtida mejl och gränssnitt där det stöds.</p>
        </div>
        <button type="submit" className="rounded bg-step-gold px-5 py-2.5 text-sm font-semibold text-black hover:bg-step-gold-dim">
          Spara inställningar
        </button>
      </form>
    </div>
  );
}
