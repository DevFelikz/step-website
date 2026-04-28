import { auth } from "@/auth";
import { KontoNav } from "@/components/site/KontoNav";
import { LogOutButton } from "@/components/site/LogOutButton";
import { SiteShell } from "@/components/site/SiteShell";
import { redirect } from "next/navigation";

export default async function KontoLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/logga-in?callbackUrl=/konto");
  }

  return (
    <SiteShell activeHref="/konto">
      <div className="reveal-stagger-v mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:py-14">
        <aside className="shrink-0 lg:w-56">
          <p className="text-xs font-semibold tracking-widest text-step-gold">MITT KONTO</p>
          <p className="mt-1 truncate text-sm text-white">{session.user?.email}</p>
          <div className="mt-6">
            <KontoNav />
          </div>
          <div className="mt-8">
            <LogOutButton />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </SiteShell>
  );
}
