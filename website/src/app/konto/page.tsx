import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function KontoPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect("/auth/logga-in?callbackUrl=/konto");
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true },
  });
  if (!user) return null;

  const planName = user.plan?.name ?? "Ingen vald plan";
  const paused =
    user.subscriptionPausedUntil && user.subscriptionPausedUntil > new Date()
      ? user.subscriptionPausedUntil.toLocaleDateString("sv-SE")
      : null;

  return (
    <div className="reveal-stagger-v">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Översikt</h1>
      <p className="mt-2 text-sm text-step-muted">Välkommen tillbaka{user.name ? `, ${user.name}` : ""}.</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-step-border bg-step-card p-6">
          <p className="text-xs font-semibold tracking-widest text-step-gold">PRENUMERATION</p>
          <p className="mt-2 text-lg font-semibold text-white">{planName}</p>
          {paused ? (
            <p className="mt-2 text-sm text-amber-200/90">Pausad till {paused}</p>
          ) : (
            <p className="mt-2 text-sm text-step-muted">Aktiv leverans enligt plan.</p>
          )}
          <Link href="/konto/prenumeration" className="mt-4 inline-block text-sm text-step-gold underline">
            Hantera prenumeration
          </Link>
        </div>
        <div className="rounded-lg border border-step-border bg-step-card p-6">
          <p className="text-xs font-semibold tracking-widest text-step-gold">LEVERANS</p>
          <p className="mt-2 text-sm text-step-muted">
            {user.addressLine1
              ? [user.addressLine1, user.postalCode, user.city].filter(Boolean).join(", ")
              : "Ingen leveransadress än — lägg till under Profil."}
          </p>
          <Link href="/konto/profil" className="mt-4 inline-block text-sm text-step-gold underline">
            Uppdatera uppgifter
          </Link>
        </div>
      </div>

      <ul className="mt-10 space-y-2 text-sm text-step-muted">
        <li>
          <Link href="/konto/installningar" className="text-step-gold hover:underline">
            Notiser & språk
          </Link>
        </li>
        <li>
          <Link href="/konto/sakerhet" className="text-step-gold hover:underline">
            Lösenord, mejl & radera konto
          </Link>
        </li>
        <li>
          <Link href="/shop" className="text-step-gold hover:underline">
            Byt eller välj plan i shoppen
          </Link>
        </li>
      </ul>
    </div>
  );
}
