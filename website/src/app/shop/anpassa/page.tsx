import { SiteShell } from "@/components/site/SiteShell";
import { CustomPlanConfigurator } from "@/components/site/CustomPlanConfigurator";
import { getCustomPlanConfig } from "@/lib/customPlanConfig";
import Link from "next/link";

export const metadata = { title: "Bygg din egna plan — STEP" };

export default async function AnpassaPlanPage() {
  const cfg = await getCustomPlanConfig();

  return (
    <SiteShell activeHref="/shop">
      <div className="border-b border-step-border">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-3">
            <Link href="/shop" className="text-sm text-step-muted transition hover:text-white">
              ← Tillbaka till planer
            </Link>
          </div>

          <div className="mb-10">
            <p className="text-xs font-semibold tracking-[0.25em] text-step-gold">SKRÄDDARSY</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {cfg.pageTitle}
            </h1>
            <p className="mt-4 text-lg text-step-muted">{cfg.pageSubtitle}</p>
          </div>

          <CustomPlanConfigurator cfg={cfg} />
        </div>
      </div>
    </SiteShell>
  );
}
