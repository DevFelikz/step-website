import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { RegisterForm } from "./RegisterForm";

export default function RegisterPage() {
  return (
    <SiteShell>
      <div className="reveal-stagger-v mx-auto max-w-lg px-4 py-16 sm:py-20">
        <p className="text-xs font-semibold tracking-widest text-step-gold">NYTT KONTO</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Registrera dig</h1>
        <p className="mt-2 text-sm text-step-muted">Ett konto räcker för att följa din plan och uppdatera leverans.</p>
        <RegisterForm />
        <p className="mt-8 text-center text-sm text-step-muted">
          <Link href="/" className="text-step-gold underline">
            Tillbaka till startsidan
          </Link>
        </p>
      </div>
    </SiteShell>
  );
}
