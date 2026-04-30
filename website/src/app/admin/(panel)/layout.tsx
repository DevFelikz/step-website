import Link from "next/link";
import { adminLogout } from "@/app/admin/actions";

type NavLink = { href: string; label: string; divider?: never };
type NavDivider = { divider: string; href?: never; label?: never };
type NavItem = NavLink | NavDivider;

const links: NavItem[] = [
  { href: "/admin", label: "Översikt" },
  { href: "/admin/subscriptions", label: "Prenumerationer" },
  { href: "/admin/orders", label: "Ordrar" },
  { href: "/admin/users", label: "Användare" },
  { href: "/admin/newsletter", label: "Nyhetsbrev" },
  { divider: "Innehåll" },
  { href: "/admin/payments", label: "Betalningsmetoder" },
  { href: "/admin/plans", label: "Planer" },
  { href: "/admin/custom-plan", label: "Bygg din egna plan" },
  { href: "/admin/trust", label: "Förtroenderad" },
  { href: "/admin/pages", label: "Sidor (CMS)" },
  { divider: "Inställningar" },
  { href: "/admin/settings", label: "Webbplats" },
  { href: "/admin/nav", label: "Meny" },
];

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="reveal-stagger-v flex min-h-screen">
      <aside className="hidden w-56 shrink-0 border-r border-step-border bg-step-surface p-4 md:block">
        <p className="text-xs font-bold tracking-widest text-step-gold">ADMIN</p>
        <nav className="mt-6 flex flex-col gap-0.5">
          {links.map((l) =>
            l.divider ? (
              <p
                key={l.divider}
                className="mt-4 mb-1 px-3 text-[10px] font-bold tracking-widest text-step-gold/50 uppercase"
              >
                {l.divider}
              </p>
            ) : (
              <Link
                key={l.href}
                href={l.href!}
                className="rounded px-3 py-2 text-sm text-step-muted hover:bg-step-card hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ),
          )}
        </nav>
        <form action={adminLogout} className="mt-8">
          <button
            type="submit"
            className="w-full rounded border border-step-border px-3 py-2 text-left text-sm text-step-muted hover:text-white"
          >
            Logga ut
          </button>
        </form>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Mobile nav */}
        <div className="border-b border-step-border bg-step-surface px-4 py-3 md:hidden">
          <p className="text-xs font-bold text-step-gold">ADMIN</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {links.filter((l): l is NavLink => !l.divider).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded border border-step-border px-2 py-1 text-xs text-step-muted"
              >
                {l.label}
              </Link>
            ))}
          </div>
          <form action={adminLogout} className="mt-2">
            <button type="submit" className="text-xs text-step-muted underline">
              Logga ut
            </button>
          </form>
        </div>

        <div className="p-4 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
