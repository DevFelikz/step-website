import {
  changeEmail,
  changePassword,
  deleteUserAccount,
} from "@/app/actions/user-account";

type Search = Promise<{ losen?: string; fel?: string; meddelande?: string }>;

const felMeddelanden: Record<string, string> = {
  fyll: "Fyll i alla fält.",
  kort: "Nytt lösenord måste vara minst 8 tecken.",
  match: "Nya lösenord matchar inte.",
  user: "Kunde inte hitta kontot.",
  losen: "Fel nuvarande lösenord.",
  mejl: "Fyll i ny mejl och lösenord.",
  taken: "Mejladressen används redan.",
  radera: "Fel lösenord — kontot raderades inte.",
};

export default async function KontoSakerhetPage({ searchParams }: { searchParams: Search }) {
  const q = await searchParams;
  const fel = q.fel ? felMeddelanden[q.fel] ?? "Något gick fel." : null;

  return (
    <div className="reveal-stagger-v">
      <h1 className="text-2xl font-bold text-white sm:text-3xl">Säkerhet</h1>
      <p className="mt-2 text-sm text-step-muted">Lösenord, mejl och radering av konto.</p>
      {q.losen ? (
        <p className="mt-4 rounded border border-emerald-500/40 bg-emerald-950/30 px-4 py-2 text-sm text-emerald-200">
          Lösenordet är uppdaterat.
        </p>
      ) : null}
      {fel ? (
        <p className="mt-4 rounded border border-red-500/40 bg-red-950/30 px-4 py-2 text-sm text-red-200">{fel}</p>
      ) : null}

      <form action={changePassword} className="mt-10 space-y-4 rounded-lg border border-step-border bg-step-card p-6">
        <h2 className="text-sm font-semibold tracking-wide text-white">Byt lösenord</h2>
        <div>
          <label className="admin-label" htmlFor="currentPassword">
            Nuvarande lösenord
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            className="admin-input"
            required
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="newPassword">
            Nytt lösenord
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            className="admin-input"
            minLength={8}
            required
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="repeatPassword">
            Upprepa nytt lösenord
          </label>
          <input
            id="repeatPassword"
            name="repeatPassword"
            type="password"
            autoComplete="new-password"
            className="admin-input"
            minLength={8}
            required
          />
        </div>
        <button type="submit" className="rounded bg-step-gold px-5 py-2.5 text-sm font-semibold text-black hover:bg-step-gold-dim">
          Uppdatera lösenord
        </button>
      </form>

      <form action={changeEmail} className="mt-10 space-y-4 rounded-lg border border-step-border bg-step-card p-6">
        <h2 className="text-sm font-semibold tracking-wide text-white">Byt mejl</h2>
        <p className="text-sm text-step-muted">Du loggas ut och får logga in igen med den nya adressen.</p>
        <div>
          <label className="admin-label" htmlFor="newEmail">
            Ny mejladress
          </label>
          <input id="newEmail" name="newEmail" type="email" autoComplete="email" className="admin-input" required />
        </div>
        <div>
          <label className="admin-label" htmlFor="emailPassword">
            Nuvarande lösenord (bekräftelse)
          </label>
          <input
            id="emailPassword"
            name="password"
            type="password"
            autoComplete="current-password"
            className="admin-input"
            required
          />
        </div>
        <button type="submit" className="rounded bg-step-gold px-5 py-2.5 text-sm font-semibold text-black hover:bg-step-gold-dim">
          Byt mejl
        </button>
      </form>

      <form action={deleteUserAccount} className="mt-10 space-y-4 rounded-lg border border-red-900/40 bg-red-950/20 p-6">
        <h2 className="text-sm font-semibold tracking-wide text-red-200">Radera konto</h2>
        <p className="text-sm text-step-muted">
          Permanent borttagning. Prenumerationsdata försvinner; åtgärden kan inte ångras.
        </p>
        <div>
          <label className="admin-label" htmlFor="deletePassword">
            Skriv ditt lösenord för att bekräfta
          </label>
          <input
            id="deletePassword"
            name="password"
            type="password"
            autoComplete="current-password"
            className="admin-input"
            required
          />
        </div>
        <button
          type="submit"
          className="rounded border border-red-500/60 bg-transparent px-5 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-950/40"
        >
          Radera mitt konto
        </button>
      </form>
    </div>
  );
}
