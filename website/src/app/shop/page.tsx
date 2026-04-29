import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/siteSettings";
import { SiteShell } from "@/components/site/SiteShell";
import { PlanCard } from "@/components/site/PlanCard";
import { TrustIcon } from "@/components/site/TrustIcon";
import Link from "next/link";

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

            {/* Custom plan card */}
            <Link
              href="/shop/anpassa"
              className="group flex flex-col rounded-2xl border border-dashed border-step-border bg-step-card p-6 transition hover:border-step-gold/50 hover:bg-step-gold/5"
            >
              <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-step-border bg-step-surface text-2xl group-hover:border-step-gold/40">
                  ✦
                </div>
                <p className="text-lg font-bold text-white">Bygg din egna plan</p>
                <p className="mt-2 text-sm text-step-muted">
                  Anpassa startstyrka, programlängd och antal burkar efter dina egna förutsättningar.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-1.5 text-xs text-step-muted">
                  {["2–20 mg", "3–12 mån", "1–4 burkar/lev."].map((tag) => (
                    <span key={tag} className="rounded-full border border-step-border px-2.5 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-step-surface py-3 text-center text-sm font-semibold text-step-gold transition group-hover:bg-step-gold group-hover:text-black">
                Konfigurera →
              </div>
            </Link>
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
