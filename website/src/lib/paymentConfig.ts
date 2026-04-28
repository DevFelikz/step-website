import { prisma } from "@/lib/db";

export type StripeConfig = {
  secretKey: string;
  webhookSecret: string;
  publishableKey: string;
};

export type SwishConfig = {
  merchantAlias: string;
  /** Base64-encoded PKCS#12 (.p12) certificate */
  certBase64: string;
  certPassword: string;
  /** Optional: base64-encoded CA cert (Swish root) */
  caBase64?: string;
  testMode: boolean;
};

export type KlarnaConfig = {
  apiKey: string;
  apiSecret: string;
  /** "eu" | "na" | "oc" */
  region: string;
};

export type ProviderConfig = StripeConfig | SwishConfig | KlarnaConfig;

export interface PaymentProviderRow {
  id: string;
  displayName: string;
  enabled: boolean;
  sort: number;
  configJson: string;
}

const DEFAULT_PROVIDERS: Omit<PaymentProviderRow, "configJson">[] = [
  { id: "stripe", displayName: "Kort (Visa / Mastercard)", enabled: false, sort: 1 },
  { id: "klarna", displayName: "Klarna", enabled: false, sort: 2 },
  { id: "swish", displayName: "Swish", enabled: false, sort: 3 },
];

/** Returns all providers; creates default rows if they don't exist yet. */
export async function getAllProviders(): Promise<PaymentProviderRow[]> {
  const existing = await prisma.paymentProvider.findMany({ orderBy: { sort: "asc" } });
  const existingIds = new Set(existing.map((p) => p.id));

  // Seed missing default rows
  for (const def of DEFAULT_PROVIDERS) {
    if (!existingIds.has(def.id)) {
      await prisma.paymentProvider.create({
        data: { ...def, configJson: "{}" },
      });
    }
  }

  return prisma.paymentProvider.findMany({ orderBy: { sort: "asc" } });
}

export async function getProvider(id: string): Promise<PaymentProviderRow | null> {
  return prisma.paymentProvider.findUnique({ where: { id } });
}

export function parseConfig<T>(row: PaymentProviderRow | null): Partial<T> {
  if (!row) return {};
  try {
    return JSON.parse(row.configJson) as Partial<T>;
  } catch {
    return {};
  }
}

/** True when Stripe is configured with a real key in DB or env fallback. */
export async function getStripeConfig(): Promise<StripeConfig | null> {
  const row = await getProvider("stripe");
  const cfg = parseConfig<StripeConfig>(row);

  const secretKey = cfg.secretKey || process.env.STRIPE_SECRET_KEY || "";
  const webhookSecret = cfg.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET || "";
  const publishableKey = cfg.publishableKey || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  if (!secretKey || secretKey === "sk_test_REPLACE_ME") return null;
  return { secretKey, webhookSecret, publishableKey };
}

export async function getSwishConfig(): Promise<SwishConfig | null> {
  const row = await getProvider("swish");
  if (!row?.enabled) return null;
  const cfg = parseConfig<SwishConfig>(row);
  if (!cfg.merchantAlias || !cfg.certBase64) return null;
  return {
    merchantAlias: cfg.merchantAlias,
    certBase64: cfg.certBase64,
    certPassword: cfg.certPassword ?? "",
    caBase64: cfg.caBase64,
    testMode: cfg.testMode ?? true,
  };
}
