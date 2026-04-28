import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/siteSettings";
import { SiteShell } from "@/components/site/SiteShell";
import { PlanCard } from "@/components/site/PlanCard";
import { TrustIcon } from "@/components/site/TrustIcon";

export default async function ShopPage() {
  const [settings, plans, trust] = await Promise.all([
    getSettings(),
    prisma.plan.findMany({ where: { visible: true }, orderBy: { sort: "asc" } }),
    prisma.trustItem.findMany({ where: { visible: true }, orderBy: { sort: "asc" } }),
  ]);

  return (
    <SiteShell activeHref="/shop">
      <div className="border-b border-step-border">
        <div className="reveal-stagger-v mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{settings.shopTitle}</h1>
          <p className="mt-4 max-w-2xl text-lg text-step-muted">{settings.shopSubtitle}</p>
          <div className="reveal-stagger-grid mt-14 grid gap-6 md:grid-cols-3">
            {plans.map((p) => (
              <PlanCard key={p.id} plan={p} />
            ))}
          </div>
          <div className="mt-16 rounded-lg border border-step-border/80 p-6">
            <p className="text-center text-xs font-semibold tracking-[0.25em] text-step-gold">
              {settings.includedTitle}
            </p>
            <div className="reveal-stagger-grid mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {trust.map((t) => (
                <div key={t.id} className="flex flex-col items-center text-center">
                  <TrustIcon name={t.icon} className="h-7 w-7 text-step-gold" />
                  <p className="mt-2 text-sm font-semibold text-white">{t.title}</p>
                  <p className="mt-1 text-xs text-step-muted">{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
