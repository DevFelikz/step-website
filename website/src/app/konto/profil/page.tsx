import { auth } from "@/auth";
import {
  updateUserBilling,
  updateUserProfile,
} from "@/app/actions/user-account";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";

type Search = Promise<{ sparat?: string }>;

export default async function KontoProfilPage({ searchParams }: { searchParams: Search }) {
  const q = await searchParams;
  const session = await auth();
  const uid = session?.user?.id;
  if (!uid) redirect("/auth/logga-in?callbackUrl=/konto/profil");
  const user = await prisma.user.findUnique({ where: { id: uid } });
  if (!user) return null;

  return (
    <div className="reveal-stagger-v">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Profil & leverans</h1>
      <p className="mt-2 text-sm text-step-muted">Uppgifter som används för leverans och kontakt.</p>
      {q.sparat ? (
        <p className="mt-4 rounded border border-emerald-500/40 bg-emerald-950/30 px-4 py-2 text-sm text-emerald-200">
          Sparat.
        </p>
      ) : null}

      <form action={updateUserProfile} className="mt-10 space-y-4 rounded-lg border border-step-border bg-step-card p-6">
        <h2 className="text-sm font-semibold tracking-wide text-white">Kontakt & leveransadress</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="admin-label" htmlFor="name">
              Visningsnamn
            </label>
            <input id="name" name="name" className="admin-input" defaultValue={user.name ?? ""} />
          </div>
          <div>
            <label className="admin-label" htmlFor="phone">
              Telefon
            </label>
            <input id="phone" name="phone" type="tel" className="admin-input" defaultValue={user.phone ?? ""} />
          </div>
          <div>
            <label className="admin-label" htmlFor="country">
              Land
            </label>
            <input id="country" name="country" className="admin-input" defaultValue={user.country ?? "Sverige"} />
          </div>
          <div className="sm:col-span-2">
            <label className="admin-label" htmlFor="addressLine1">
              Adressrad 1
            </label>
            <input
              id="addressLine1"
              name="addressLine1"
              className="admin-input"
              defaultValue={user.addressLine1 ?? ""}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="admin-label" htmlFor="addressLine2">
              Adressrad 2 (valfritt)
            </label>
            <input
              id="addressLine2"
              name="addressLine2"
              className="admin-input"
              defaultValue={user.addressLine2 ?? ""}
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="postalCode">
              Postnummer
            </label>
            <input id="postalCode" name="postalCode" className="admin-input" defaultValue={user.postalCode ?? ""} />
          </div>
          <div>
            <label className="admin-label" htmlFor="city">
              Ort
            </label>
            <input id="city" name="city" className="admin-input" defaultValue={user.city ?? ""} />
          </div>
          <div className="sm:col-span-2">
            <label className="admin-label" htmlFor="deliveryNotes">
              Leveransanteckningar (t.ex. portkod)
            </label>
            <textarea
              id="deliveryNotes"
              name="deliveryNotes"
              rows={3}
              className="admin-input min-h-[5rem]"
              defaultValue={user.deliveryNotes ?? ""}
            />
          </div>
        </div>
        <button type="submit" className="rounded bg-step-gold px-5 py-2.5 text-sm font-semibold text-black hover:bg-step-gold-dim">
          Spara profil
        </button>
      </form>

      <form action={updateUserBilling} className="mt-10 space-y-4 rounded-lg border border-step-border bg-step-card p-6">
        <h2 className="text-sm font-semibold tracking-wide text-white">Fakturaadress</h2>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-step-muted">
          <input
            type="checkbox"
            name="sameBillingAsShipping"
            defaultChecked={user.sameBillingAsShipping}
            className="h-4 w-4 rounded border-step-border"
          />
          Samma som leveransadress
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="admin-label" htmlFor="billingAddressLine1">
              Fakturaadress
            </label>
            <input
              id="billingAddressLine1"
              name="billingAddressLine1"
              className="admin-input"
              defaultValue={user.billingAddressLine1 ?? ""}
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="billingPostalCode">
              Postnummer
            </label>
            <input
              id="billingPostalCode"
              name="billingPostalCode"
              className="admin-input"
              defaultValue={user.billingPostalCode ?? ""}
            />
          </div>
          <div>
            <label className="admin-label" htmlFor="billingCity">
              Ort
            </label>
            <input id="billingCity" name="billingCity" className="admin-input" defaultValue={user.billingCity ?? ""} />
          </div>
        </div>
        <button type="submit" className="rounded bg-step-gold px-5 py-2.5 text-sm font-semibold text-black hover:bg-step-gold-dim">
          Spara faktura
        </button>
      </form>
    </div>
  );
}
