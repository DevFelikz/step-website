import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getAllProviders } from "@/lib/paymentConfig";
import { submitCheckout } from "@/app/actions/checkout";
import { SiteShell } from "@/components/site/SiteShell";
import { TrustIcon } from "@/components/site/TrustIcon";

const STRENGTH_OPTIONS = [4, 6, 8, 10, 14, 20] as const;
const DURATION_OPTIONS = [3, 6, 12] as const;
const QUANTITY_OPTIONS = [1, 2, 3] as const;

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect(`/auth/logga-in?callbackUrl=/checkout/${planId}`);
  }

  const [plan, user, providers] = await Promise.all([
    prisma.plan.findFirst({ where: { id: planId, visible: true } }),
    prisma.user.findUnique({ where: { id: userId } }),
    getAllProviders(),
  ]);

  if (!plan || !user) notFound();

  const enabledProviders = providers.filter((p) => p.enabled);
  // Fallback: if nothing configured, show all options with a "coming soon" note
  const paymentMethods = enabledProviders.length > 0
    ? [
        enabledProviders.find((p) => p.id === "stripe") && { id: "card", label: "Kort", sub: "Visa, Mastercard, Amex" },
        enabledProviders.find((p) => p.id === "stripe" || p.id === "klarna") && { id: "klarna", label: "Klarna", sub: "Betala nu, dela upp eller faktura" },
        enabledProviders.find((p) => p.id === "swish") && { id: "swish", label: "Swish", sub: "Betala direkt med Swish" },
      ].filter(Boolean) as { id: string; label: string; sub: string }[]
    : [
        { id: "card", label: "Kort", sub: "Visa, Mastercard, Amex" },
        { id: "klarna", label: "Klarna", sub: "Betala nu, dela upp eller faktura" },
        { id: "swish", label: "Swish", sub: "Betala direkt med Swish" },
      ];

  let bullets: string[] = [];
  try {
    bullets = JSON.parse(plan.bullets) as string[];
  } catch {
    bullets = [];
  }

  const monthlyKr = parseInt((plan.priceLabel.match(/\d+/) ?? ["0"])[0], 10);

  return (
    <SiteShell activeHref="/shop">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-xs text-step-muted">
          <Link href="/" className="hover:text-white">Hem</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-white">Shop</Link>
          <span>/</span>
          <span className="text-white">Checkout</span>
        </nav>

        <form action={submitCheckout}>
          <input type="hidden" name="planId" value={plan.id} />
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* ── LEFT: sections ──────────────────────────────────────────── */}
          <div className="space-y-10">

            {/* 1. Kontaktuppgifter */}
            <section>
              <SectionHeader number={1} title="Kontaktuppgifter" />
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Förnamn & efternamn" required>
                  <input
                    name="name"
                    className="checkout-input"
                    defaultValue={user.name ?? ""}
                    placeholder="Anna Lindgren"
                    required
                  />
                </Field>
                <Field label="Telefonnummer">
                  <input
                    name="phone"
                    type="tel"
                    className="checkout-input"
                    defaultValue={user.phone ?? ""}
                    placeholder="+46 70 000 00 00"
                  />
                </Field>
                <Field label="E-postadress" className="sm:col-span-2">
                  <input
                    name="email"
                    type="email"
                    className="checkout-input bg-step-surface/50 text-step-muted"
                    value={user.email}
                    readOnly
                    tabIndex={-1}
                  />
                  <p className="mt-1 text-xs text-step-muted">
                    Kopplad till ditt konto.{" "}
                    <Link href="/konto/sakerhet" className="text-step-gold underline">
                      Byt mejl
                    </Link>
                  </p>
                </Field>
              </div>
            </section>

            <Divider />

            {/* 2. Leveransadress */}
            <section>
              <SectionHeader number={2} title="Leveransadress" />
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Gatuadress" required className="sm:col-span-2">
                  <input
                    name="addressLine1"
                    className="checkout-input"
                    defaultValue={user.addressLine1 ?? ""}
                    placeholder="Storgatan 12"
                    required
                  />
                </Field>
                <Field label="Lägenhetsnummer / C/O" className="sm:col-span-2">
                  <input
                    name="addressLine2"
                    className="checkout-input"
                    defaultValue={user.addressLine2 ?? ""}
                    placeholder="Lgh 1201"
                  />
                </Field>
                <Field label="Postnummer" required>
                  <input
                    name="postalCode"
                    className="checkout-input"
                    defaultValue={user.postalCode ?? ""}
                    placeholder="113 20"
                    required
                  />
                </Field>
                <Field label="Stad" required>
                  <input
                    name="city"
                    className="checkout-input"
                    defaultValue={user.city ?? ""}
                    placeholder="Stockholm"
                    required
                  />
                </Field>
                <Field label="Land" className="sm:col-span-2">
                  <select name="country" className="checkout-input" defaultValue={user.country ?? "Sverige"}>
                    <option value="Sverige">Sverige</option>
                    <option value="Norge">Norge</option>
                    <option value="Danmark">Danmark</option>
                    <option value="Finland">Finland</option>
                  </select>
                </Field>
                <Field label="Leveransinstruktioner" className="sm:col-span-2">
                  <textarea
                    name="deliveryNotes"
                    className="checkout-input min-h-[4rem] resize-none"
                    defaultValue={user.deliveryNotes ?? ""}
                    placeholder="Lämna vid dörren, kod 1234, ej framsida…"
                  />
                </Field>
              </div>
            </section>

            <Divider />

            {/* 3. Faktureringsadress */}
            <section>
              <SectionHeader number={3} title="Faktureringsadress" />
              <div className="mt-5 space-y-4">
                <label className="flex cursor-pointer items-center gap-3 text-sm text-white">
                  <input
                    type="checkbox"
                    name="sameBillingAsShipping"
                    defaultChecked={user.sameBillingAsShipping}
                    className="h-4 w-4 rounded border-step-border bg-step-card text-step-gold"
                    id="sameBilling"
                  />
                  Samma som leveransadress
                </label>
                {/* JS-less fallback: always render but visually hidden via details hack
                    If user unchecks, they scroll and fill in.
                    For a real app you'd use a client component. */}
                <div className="space-y-4 rounded-lg border border-step-border/60 p-4">
                  <p className="text-xs text-step-muted">
                    Fyll i nedan om faktureringsadressen skiljer sig från leveransadressen.
                  </p>
                  <Field label="Faktureringsadress">
                    <input
                      name="billingAddressLine1"
                      className="checkout-input"
                      defaultValue={user.billingAddressLine1 ?? ""}
                      placeholder="Fakturavägen 1"
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Postnummer">
                      <input
                        name="billingPostalCode"
                        className="checkout-input"
                        defaultValue={user.billingPostalCode ?? ""}
                        placeholder="111 22"
                      />
                    </Field>
                    <Field label="Stad">
                      <input
                        name="billingCity"
                        className="checkout-input"
                        defaultValue={user.billingCity ?? ""}
                        placeholder="Göteborg"
                      />
                    </Field>
                  </div>
                </div>
              </div>
            </section>

            <Divider />

            {/* 4. Planval */}
            <section>
              <SectionHeader number={4} title="Anpassa din plan" />
              <p className="mt-1 text-sm text-step-muted">
                Välj startstryka, hur många månader och antal burkar per leverans.
              </p>

              <div className="mt-6 space-y-6">
                {/* Start strength */}
                <div>
                  <label className="checkout-label">Startstyrka (mg nikotin)</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {STRENGTH_OPTIONS.map((mg) => (
                      <label key={mg} className="cursor-pointer">
                        <input
                          type="radio"
                          name="startStrengthMg"
                          value={mg}
                          defaultChecked={mg === 20}
                          className="peer sr-only"
                        />
                        <span className="block rounded border border-step-border bg-step-card px-4 py-2 text-sm text-step-muted transition peer-checked:border-step-gold peer-checked:bg-step-gold/10 peer-checked:text-white hover:border-step-gold/50">
                          {mg} mg
                        </span>
                      </label>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-step-muted">
                    Välj den styrka du normalt använder — programmet trappar sedan ner mot 0 mg.
                  </p>
                </div>

                {/* Duration */}
                <div>
                  <label className="checkout-label">Programlängd</label>
                  <div className="mt-2 flex flex-wrap gap-3">
                    {DURATION_OPTIONS.map((months) => (
                      <label key={months} className="cursor-pointer">
                        <input
                          type="radio"
                          name="durationMonths"
                          value={months}
                          defaultChecked={months === 6}
                          className="peer sr-only"
                        />
                        <span className="block rounded border border-step-border bg-step-card px-5 py-3 text-center transition peer-checked:border-step-gold peer-checked:bg-step-gold/10 peer-checked:text-white hover:border-step-gold/50">
                          <span className="block text-base font-semibold text-white peer-checked:text-white">
                            {months} mån
                          </span>
                          <span className="mt-0.5 block text-xs text-step-muted">
                            {monthlyKr > 0
                              ? `${(monthlyKr * months).toLocaleString("sv-SE")} kr totalt`
                              : ""}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="checkout-label">Burkar per leverans</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {QUANTITY_OPTIONS.map((q) => (
                      <label key={q} className="cursor-pointer">
                        <input
                          type="radio"
                          name="quantityCans"
                          value={q}
                          defaultChecked={q === 1}
                          className="peer sr-only"
                        />
                        <span className="block rounded border border-step-border bg-step-card px-4 py-2 text-sm text-step-muted transition peer-checked:border-step-gold peer-checked:bg-step-gold/10 peer-checked:text-white hover:border-step-gold/50">
                          {q} {q === 1 ? "burk" : "burkar"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <Divider />

            {/* 5. Betalsätt */}
            <section>
              <SectionHeader number={5} title="Betalsätt" />
              <div className="mt-5 space-y-3">
                {paymentMethods.map((m) => (
                  <label
                    key={m.id}
                    className="flex cursor-pointer items-center gap-4 rounded-lg border border-step-border bg-step-card p-4 transition hover:border-step-gold/40 has-[:checked]:border-step-gold has-[:checked]:bg-step-gold/5"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.id}
                      defaultChecked={m.id === "klarna"}
                      className="h-4 w-4 border-step-border text-step-gold"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{m.label}</p>
                      <p className="text-xs text-step-muted">{m.sub}</p>
                    </div>
                    <PaymentIcon method={m.id} />
                  </label>
                ))}
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-step-muted">
                <TrustIcon name="shield" className="h-3.5 w-3.5 text-step-gold" />
                Säker betalning — krypterad med TLS
              </p>
            </section>

            {/* Mobile: submit */}
            <div className="lg:hidden">
              <SubmitBlock plan={plan} bullets={bullets} monthlyKr={monthlyKr} mobile />
            </div>
          </div>

          {/* ── RIGHT: Order summary (sticky) ───────────────────────────── */}
          <aside className="hidden lg:block">
            <div className="sticky top-6 space-y-6">
              <OrderSummary plan={plan} bullets={bullets} monthlyKr={monthlyKr} />
            </div>
          </aside>
          </div>
        </form>
      </div>
    </SiteShell>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-step-gold text-xs font-bold text-black">
        {number}
      </span>
      <h2 className="text-base font-semibold tracking-wide text-white">{title}</h2>
    </div>
  );
}

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="checkout-label">
        {label}
        {required && <span className="ml-0.5 text-step-gold">*</span>}
      </label>
      {children}
    </div>
  );
}

function Divider() {
  return <hr className="border-step-border" />;
}

function PaymentIcon({ method }: { method: string }) {
  const icons: Record<string, string> = {
    klarna: "K",
    card: "💳",
    swish: "S",
  };
  return (
    <span className="ml-auto flex h-8 w-12 items-center justify-center rounded border border-step-border bg-step-surface text-xs font-bold text-step-muted">
      {icons[method] ?? "?"}
    </span>
  );
}

function OrderSummary({
  plan,
  bullets,
  monthlyKr,
  mobile,
}: {
  plan: { id: string; name: string; subtitle: string; priceLabel: string; cansLabel: string };
  bullets: string[];
  monthlyKr: number;
  mobile?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-step-border bg-step-card p-6 ${mobile ? "" : ""}`}
    >
      <p className="text-xs font-semibold tracking-widest text-step-gold">DIN BESTÄLLNING</p>
      <h3 className="mt-2 text-xl font-bold text-white">{plan.name}</h3>
      <p className="text-sm text-step-muted">{plan.subtitle}</p>

      <div className="mt-5 space-y-2 border-t border-step-border pt-5 text-sm">
        <div className="flex justify-between">
          <span className="text-step-muted">Pris per månad</span>
          <span className="font-semibold text-white">{plan.priceLabel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-step-muted">{plan.cansLabel}</span>
          <span className="text-step-muted">per leverans</span>
        </div>
      </div>

      {bullets.length > 0 && (
        <ul className="mt-5 space-y-2 border-t border-step-border pt-5">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-xs text-step-muted">
              <span className="text-step-gold">✓</span>
              {b}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 space-y-3 border-t border-step-border pt-5">
        <div className="flex items-center gap-2 text-xs text-step-muted">
          <TrustIcon name="shield" className="h-4 w-4 shrink-0 text-step-gold" />
          Diskret förpackning
        </div>
        <div className="flex items-center gap-2 text-xs text-step-muted">
          <TrustIcon name="target" className="h-4 w-4 shrink-0 text-step-gold" />
          Ingen bindningstid
        </div>
        <div className="flex items-center gap-2 text-xs text-step-muted">
          <TrustIcon name="sliders" className="h-4 w-4 shrink-0 text-step-gold" />
          Pausa eller avsluta när som helst
        </div>
      </div>

      <SubmitBlock plan={plan} bullets={bullets} monthlyKr={monthlyKr} />
    </div>
  );
}

function SubmitBlock({
  plan,
  bullets: _bullets,
  monthlyKr,
  mobile,
}: {
  plan: { id: string; name: string };
  bullets: string[];
  monthlyKr: number;
  mobile?: boolean;
}) {
  void plan;
  void monthlyKr;
  return (
    <button
      type="submit"
      className={`mt-6 w-full rounded-lg bg-step-gold py-4 text-sm font-bold tracking-wide text-black shadow-lg shadow-black/30 transition hover:bg-step-gold-dim active:scale-[0.98] ${mobile ? "block lg:hidden" : ""}`}
    >
      Slutför beställning →
    </button>
  );
}
