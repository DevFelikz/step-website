import { getAllProviders } from "@/lib/paymentConfig";
import { updatePaymentProvider } from "@/app/admin/actions";

export const metadata = { title: "Betalningsmetoder — Admin" };

function MaskedInput({
  name,
  label,
  hint,
  placeholder,
  value,
  textarea,
}: {
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
  value?: string;
  textarea?: boolean;
}) {
  const hasValue = !!value;
  const Tag = textarea ? "textarea" : "input";
  return (
    <div>
      <label className="admin-label">{label}</label>
      {hint && <p className="mb-1 text-xs text-step-muted/70">{hint}</p>}
      <Tag
        name={name}
        className="admin-input font-mono text-sm"
        placeholder={hasValue ? "••••••• (lämna tomt för att behålla)" : placeholder}
        rows={textarea ? 4 : undefined}
        autoComplete="off"
      />
      {hasValue && (
        <p className="mt-0.5 text-xs text-step-gold/70">✓ Sparad — ersätt bara om du vill ändra</p>
      )}
    </div>
  );
}

const PROVIDER_META: Record<
  string,
  {
    title: string;
    description: string;
    docsUrl: string;
    fields: {
      key: string;
      label: string;
      hint?: string;
      placeholder?: string;
      textarea?: boolean;
      isCheckbox?: boolean;
    }[];
  }
> = {
  stripe: {
    title: "Stripe (Kort / Visa / Mastercard)",
    description: "Hanterar kortbetalningar. Klarna aktiveras automatiskt via Stripe om din Stripe-konto har Klarna aktiverat.",
    docsUrl: "https://dashboard.stripe.com/test/apikeys",
    fields: [
      {
        key: "secretKey",
        label: "Secret Key",
        hint: "Börjar med sk_test_ eller sk_live_",
        placeholder: "sk_test_…",
      },
      {
        key: "webhookSecret",
        label: "Webhook Secret",
        hint: "Börjar med whsec_ — hämta från Stripe Webhooks-dashboarden",
        placeholder: "whsec_…",
      },
      {
        key: "publishableKey",
        label: "Publishable Key",
        hint: "Börjar med pk_test_ eller pk_live_ (används om du byter till Stripe Elements)",
        placeholder: "pk_test_…",
      },
    ],
  },
  klarna: {
    title: "Klarna Checkout (standalone)",
    description:
      "Fristående Klarna-integration. Rekommenderas om du INTE använder Stripe. Om du kör Stripe kan du aktivera Klarna direkt i Stripe-dashboarden istället.",
    docsUrl: "https://docs.klarna.com/klarna-checkout/",
    fields: [
      {
        key: "apiKey",
        label: "API Key (UID)",
        hint: "Hämta från Klarna-portalen under My apps",
        placeholder: "K_…",
      },
      {
        key: "apiSecret",
        label: "API Secret",
        placeholder: "Shared secret",
      },
      {
        key: "region",
        label: "Region",
        hint: "eu (Europa), na (Nordamerika), oc (Oceanien)",
        placeholder: "eu",
      },
    ],
  },
  swish: {
    title: "Swish Handel",
    description:
      "Kräver ett Swish-handelskonto och ett PKCS#12-certifikat från din bank. Testa med Swish testmiljö (MSS) innan du aktiverar i produktion.",
    docsUrl: "https://developer.swish.nu/api/payment-request/v2",
    fields: [
      {
        key: "merchantAlias",
        label: "Swish-nummer (Merchant Alias)",
        hint: "Ditt 10-siffriga Swish-handels­nummer",
        placeholder: "1234567890",
      },
      {
        key: "certBase64",
        label: "PKCS#12-certifikat (Base64)",
        hint: "Konvertera .p12-filen: openssl base64 -in cert.p12 | tr -d '\\n'",
        placeholder: "MIIKMgIBA…",
        textarea: true,
      },
      {
        key: "certPassword",
        label: "Certifikatslösenord",
        placeholder: "swish",
      },
      {
        key: "caBase64",
        label: "CA-certifikat Base64 (valfritt)",
        hint: "Swish root CA — lämna tomt om du använder systemets standardcertifikat",
        textarea: true,
        placeholder: "MIIDxTCC…",
      },
      {
        key: "testMode",
        label: "Testläge (MSS)",
        hint: "Använd Swish testmiljö — stäng av i produktion",
        isCheckbox: true,
      },
    ],
  },
};

export default async function AdminPaymentsPage() {
  const providers = await getAllProviders();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Betalningsmetoder</h1>
        <p className="mt-1 text-sm text-step-muted">
          Aktivera och konfigurera betalningsleverantörer. Känsliga värden sparas krypterat i databasen.
        </p>
      </div>

      <div className="space-y-8">
        {providers.map((provider) => {
          const meta = PROVIDER_META[provider.id];
          if (!meta) return null;

          let cfg: Record<string, unknown> = {};
          try { cfg = JSON.parse(provider.configJson) as Record<string, unknown>; } catch {}

          return (
            <div
              key={provider.id}
              className={`rounded-xl border bg-step-card p-6 transition ${
                provider.enabled ? "border-step-gold/30" : "border-step-border"
              }`}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white">{meta.title}</h2>
                    {provider.enabled ? (
                      <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-400">
                        Aktiv
                      </span>
                    ) : (
                      <span className="rounded-full bg-step-border/60 px-2 py-0.5 text-xs text-step-muted">
                        Inaktiv
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-step-muted">{meta.description}</p>
                  <a
                    href={meta.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-step-gold hover:underline"
                  >
                    Dokumentation ↗
                  </a>
                </div>
              </div>

              <form action={updatePaymentProvider} className="space-y-4">
                <input type="hidden" name="providerId" value={provider.id} />

                {/* Enable toggle */}
                <label className="flex cursor-pointer items-center gap-3">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="enabled"
                      value="on"
                      defaultChecked={provider.enabled}
                      className="peer sr-only"
                    />
                    <div className="h-6 w-11 rounded-full bg-step-border transition peer-checked:bg-step-gold" />
                    <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                  </div>
                  <span className="text-sm font-medium text-white">Aktivera betalningsmetod</span>
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  {meta.fields.map((field) => {
                    if (field.isCheckbox) {
                      return (
                        <div key={field.key} className="sm:col-span-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              name={`config_${field.key}`}
                              defaultChecked={Boolean(cfg[field.key] ?? true)}
                              className="rounded border-step-border"
                            />
                            <span className="text-sm text-white">{field.label}</span>
                          </label>
                          {field.hint && <p className="mt-0.5 pl-5 text-xs text-step-muted/70">{field.hint}</p>}
                        </div>
                      );
                    }

                    const existing = cfg[field.key] ? String(cfg[field.key]) : undefined;
                    return (
                      <div key={field.key} className={field.textarea ? "sm:col-span-2" : ""}>
                        <MaskedInput
                          name={`config_${field.key}`}
                          label={field.label}
                          hint={field.hint}
                          placeholder={field.placeholder}
                          value={existing}
                          textarea={field.textarea}
                        />
                      </div>
                    );
                  })}
                </div>

                <button
                  type="submit"
                  className="rounded bg-step-gold px-5 py-2 text-sm font-semibold text-black hover:bg-step-gold-dim transition"
                >
                  Spara {meta.title.split(" ")[0]}
                </button>
              </form>
            </div>
          );
        })}
      </div>

      {/* Info box */}
      <div className="mt-10 rounded-lg border border-step-border bg-step-surface p-5 text-sm">
        <p className="font-semibold text-white">Hur det fungerar</p>
        <ul className="mt-3 space-y-1.5 text-step-muted">
          <li>• <strong className="text-white">Stripe</strong>: aktivera &rarr; klistra in nycklar &rarr; sätt upp webhook på <code className="text-step-gold">yourdomain.com/api/stripe/webhook</code></li>
          <li>• <strong className="text-white">Klarna standalone</strong>: använd bara om du INTE kör Stripe; annars aktivera Klarna i Stripe-dashboarden</li>
          <li>• <strong className="text-white">Swish</strong>: kräver Swish-handelskonto + p12-cert från bank → konvertera till Base64 → klistra in</li>
          <li>• Betalningsmetoder som är inaktiva visas inte för kunden i kassan</li>
          <li>• Känsliga värden (API-nycklar, certifikat) lagras i databasen — se till att databasfilen är skyddad i produktion</li>
        </ul>
      </div>
    </div>
  );
}
