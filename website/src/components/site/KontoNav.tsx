"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/konto", label: "Översikt" },
  { href: "/konto/profil", label: "Profil & leverans" },
  { href: "/konto/prenumeration", label: "Prenumeration" },
  { href: "/konto/installningar", label: "Inställningar" },
  { href: "/konto/sakerhet", label: "Säkerhet" },
] as const;

export function KontoNav() {
  const path = usePathname();
  return (
    <nav className="flex flex-col gap-1">
      {links.map((l) => {
        const active =
          l.href === "/konto" ? path === "/konto" : path === l.href || path.startsWith(`${l.href}/`);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-step-card text-step-gold"
                : "text-step-muted hover:bg-step-card/60 hover:text-white"
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
