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

  const heroTrust = trust.slice(0, 3);

  return (
    <SiteShell activeHref="/shop">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden border-b border-step-border bg-step-bg">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Left: text + trust */}
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] text-step-gold">SHOP</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
                {settings.shopTitle}
              </h1>
              <p className="mt-5 max-w-md text-lg text-step-muted">{settings.shopSubtitle}</p>

              {heroTrust.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-6">
                  {heroTrust.map((t) => (
                    <div key={t.id} className="flex items-center gap-2.5">
                      <TrustIcon name={t.icon} className="h-5 w-5 text-step-gold" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-step-muted">
                        {t.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: decorative product visual */}
            <div className="relative flex items-center justify-center">
              <div className="relative h-72 w-72 sm:h-80 sm:w-80">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-step-gold/5 blur-3xl" />
                {/* Back can (black) */}
                <div className="absolute bottom-0 right-0 flex h-52 w-52 items-center justify-center rounded-full border border-step-border bg-[#111] shadow-2xl">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black tracking-[0.3em] text-white">STEP</span>
                    <span className="mt-1 text-[9px] font-semibold tracking-[0.2em] text-step-muted">BLACK</span>
                    <div className="mt-2 flex gap-1">
                      {[0,1,2,3].map(i => (
                        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-step-gold" : "bg-step-border"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Front can (white) */}
                <div className="absolute left-0 top-0 flex h-52 w-52 items-center justify-center rounded-full border border-white/10 bg-[#e8e8e0] shadow-2xl">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black tracking-[0.3em] text-[#111]">STEP</span>
                    <span className="mt-1 text-[9px] font-semibold tracking-[0.2em] text-[#555]">WHITE</span>
                    <div className="mt-2 flex gap-1">
                      {[0,1,2,3].map(i => (
                        <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < 1 ? "bg-[#555]" : "bg-[#ccc]"}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Plans ── */}
      <div className="border-b border-step-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold tracking-[0.25em] text-step-gold">OUR PLANS</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Find the right level for you.
            </h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {plans.map((p) => (
              <div key={p.id} className="w-full max-w-[320px] flex-1 basis-72">
                <PlanCard plan={p} />
              </div>
            ))}

            {/* Custom plan card */}
            <Link
              href="/shop/anpassa"
              className="group flex w-full max-w-[320px] flex-1 basis-72 flex-col rounded-2xl border border-dashed border-step-border bg-step-card p-6 transition hover:border-step-gold/50 hover:bg-step-gold/5"
            >
              <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-step-border bg-step-surface text-2xl group-hover:border-step-gold/40">
                  ✦
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-step-gold">Custom</p>
                <p className="mt-1 text-base font-bold text-white">Bygg din egna plan</p>
                <p className="mt-2 text-xs text-step-muted">
                  Anpassa styrka, längd och antal burkar efter dina egna förutsättningar.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-1.5 text-xs text-step-muted">
                  {["2–20 mg", "3–12 mån", "1–4 burkar"].map((tag) => (
                    <span key={tag} className="rounded-full border border-step-border px-2.5 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 rounded-lg border border-step-gold py-3 text-center text-sm font-semibold text-step-gold transition group-hover:bg-step-gold group-hover:text-black">
                Konfigurera →
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Included in every plan ── */}
      {trust.length > 0 && (
        <div className="border-b border-step-border">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <p className="mb-10 text-center text-xs font-semibold tracking-[0.25em] text-step-gold">
              {settings.includedTitle}
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {trust.map((t) => (
                <div key={t.id} className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-step-border bg-step-surface">
                    <TrustIcon name={t.icon} className="h-5 w-5 text-step-gold" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white">{t.title}</p>
                  <p className="mt-1 text-xs text-step-muted">{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </SiteShell>
  );
}
