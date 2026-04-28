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
      className={`relative flex flex-col rounded-lg border p-6 transition ${
        plan.badge ? "pt-9" : ""
      } ${
        plan.featured
          ? "border-step-gold bg-step-card shadow-[0_0_0_1px_rgba(201,162,39,0.35)]"
          : "border-step-border bg-step-card/60 hover:border-step-gold/40"
      }`}
    >
      {plan.badge ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-step-gold bg-step-bg px-3 py-0.5 text-[10px] font-bold tracking-widest text-step-gold">
          {plan.badge}
        </span>
      ) : null}
      {imageSrc ? (
        <div className="relative mx-auto mb-4 h-36 w-36 sm:h-40 sm:w-40">
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
      ) : null}
      <h3 className="text-lg font-bold tracking-wide text-white">{plan.name}</h3>
      <p className="mt-1 text-sm text-step-gold">{plan.subtitle}</p>
      <p className="mt-3 text-sm text-step-muted">{plan.description}</p>
      <p className="mt-6 text-2xl font-semibold text-white">{plan.priceLabel}</p>
      <p className="text-xs font-semibold tracking-widest text-step-muted">{plan.cansLabel}</p>
      <ul className="mt-6 flex-1 space-y-2 text-sm text-step-muted">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="text-step-gold">✓</span>
            {b}
          </li>
        ))}
      </ul>
      <Link
        href={`/checkout/${plan.id}`}
        className={`mt-8 block rounded py-3 text-center text-sm font-semibold tracking-wide transition ${
          plan.featured
            ? "bg-step-gold text-black hover:bg-step-gold-dim"
            : "border border-step-gold text-step-gold hover:bg-step-gold/10"
        }`}
      >
        {plan.ctaLabel}
      </Link>
    </article>
  );
}
