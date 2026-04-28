import Link from "next/link";
import { Suspense } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <SiteShell>
      <div className="reveal-stagger-v mx-auto max-w-lg px-4 py-16 sm:py-20">
        <p className="text-xs font-semibold tracking-widest text-step-gold">INLOGGNING</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Logga in</h1>
        <p className="mt-2 text-sm text-step-muted">Hantera din prenumeration och leveransuppgifter.</p>
        <Suspense fallback={<p className="mt-10 text-step-muted">Laddar…</p>}>
          <LoginForm />
        </Suspense>
        <p className="mt-8 text-center text-sm text-step-muted">
          <Link href="/" className="text-step-gold underline">
            Tillbaka till startsidan
          </Link>
        </p>
      </div>
    </SiteShell>
  );
}
