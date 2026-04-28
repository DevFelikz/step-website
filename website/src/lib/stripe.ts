import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY ?? "";

/** True when a real (non-placeholder) Stripe key exists. */
export const stripeEnabled =
  key.startsWith("sk_test_") &&
  key !== "sk_test_REPLACE_ME" &&
  key.length > 20;

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeEnabled) throw new Error("Stripe is not configured.");
  if (!_stripe) {
    _stripe = new Stripe(key, { apiVersion: "2026-04-22.dahlia", typescript: true });
  }
  return _stripe;
}
