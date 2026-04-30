import Image from "next/image";
import Link from "next/link";
import { sanitizeHeroImageUrl } from "@/lib/sanitizeHeroImageUrl";

export type PlanCardPlan = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  priceLabel: string;
  cansLabel: string;
  badge: string | null;
  featured: boolean;
  bullets: string;
  ctaLabel: string;
  ctaHref: string;
  cardImage: string | null;
};

export function PlanCard({ plan }: { plan: PlanCardPlan }) {
  let bullets: string[] = [];
  try {
    bullets = JSON.parse(plan.bullets) as string[];
  } catch {
    bullets = [];
  }

  const imageSrc = sanitizeHeroImageUrl(plan.cardImage ?? "");

  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border p-6 transition ${
        plan.badge ? "pt-9" : ""
      } ${
        plan.featured
          ? "border-step-gold bg-step-card shadow-[0_0_0_1px_rgba(201,162,39,0.2),0_0_40px_rgba(201,162,39,0.08)]"
          : "border-step-border bg-step-card hover:border-step-gold/40"
      }`}
    >
      {/* Badge */}
      {plan.badge ? (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-step-gold bg-step-bg px-3 py-0.5 text-[10px] font-bold tracking-widest text-step-gold">
          {plan.badge}
        </span>
      ) : null}

      {/* Plan name in gold */}
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-step-gold">{plan.name}</p>

      {/* Subtitle / cans info */}
      <p className="mt-0.5 text-sm text-step-muted">{plan.cansLabel}</p>
      <p className="text-sm text-step-muted">{plan.subtitle}</p>

      {/* Product image */}
      {imageSrc ? (
        <div className="relative mx-auto my-6 h-36 w-36 sm:h-40 sm:w-40">
          {imageSrc.startsWith("/") ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 144px, 160px"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- godkänd https-URL från admin
            <img
              src={imageSrc}
              alt=""
              className="absolute inset-0 h-full w-full object-contain object-center"
            />
          )}
        </div>
      ) : (
        /* Placeholder circle when no image */
        <div className="mx-auto my-6 flex h-36 w-36 items-center justify-center rounded-full border border-step-border bg-step-surface">
          <span className="text-2xl font-black tracking-[0.25em] text-white">STEP</span>
        </div>
      )}

      {/* Price */}
      <p className="text-2xl font-bold text-white">{plan.priceLabel}</p>
      <p className="mt-0.5 text-xs text-step-muted">{plan.description}</p>

      {/* CTA */}
      <Link
        href={`/checkout/${plan.id}`}
        className={`mt-6 block rounded-lg py-3 text-center text-sm font-bold tracking-wider transition ${
          plan.featured
            ? "bg-step-gold text-black hover:bg-step-gold-dim"
            : "border border-step-gold text-step-gold hover:bg-step-gold/10"
        }`}
      >
        {plan.ctaLabel}
      </Link>

      {/* Bullets */}
      {bullets.length > 0 && (
        <ul className="mt-6 space-y-2 border-t border-step-border pt-6 text-sm text-step-muted">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-px text-step-gold">✓</span>
              {b}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
