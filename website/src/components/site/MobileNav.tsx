"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface NavItem {
  href: string;
  label: string;
}

interface Props {
  navItems: NavItem[];
  ctaLabel: string;
  ctaHref: string;
  isLoggedIn: boolean;
  activeHref?: string;
}

export function MobileNav({ navItems, ctaLabel, ctaHref, isLoggedIn, activeHref }: Props) {
  const [open, setOpen] = useState(false);

  // Close on route change (any navigation)
  useEffect(() => {
    setOpen(false);
  }, [activeHref]);

  // Prevent scroll behind overlay
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const existingHrefs = new Set(navItems.map((n) => n.href));
  const allItems: NavItem[] = [
    { href: "/", label: "HEM" },
    ...navItems,
    ...([
      { href: "/hur-det-fungerar", label: "HUR DET FUNGERAR" },
      { href: "/faq", label: "FAQ" },
    ].filter((item) => !existingHrefs.has(item.href))),
  ];

  return (
    <>
      {/* Hamburger button */}
      <button
        aria-label={open ? "Stäng meny" : "Öppna meny"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md transition md:hidden"
      >
        <span
          className={`block h-0.5 w-5 bg-white transition-all duration-200 ${open ? "translate-y-2 rotate-45" : ""}`}
        />
        <span
          className={`block h-0.5 w-5 bg-white transition-all duration-200 ${open ? "opacity-0" : ""}`}
        />
        <span
          className={`block h-0.5 w-5 bg-white transition-all duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`}
        />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-in drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-step-surface shadow-2xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header row */}
        <div className="flex h-20 items-center justify-between border-b border-step-border px-6">
          <span className="text-lg font-black tracking-tighter text-step-gold">STEP</span>
          <button
            aria-label="Stäng meny"
            onClick={() => setOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded text-step-muted hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-6 py-8">
          <ul className="space-y-1">
            {allItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-4 py-3 text-sm font-semibold tracking-wider transition ${
                    activeHref === item.href
                      ? "bg-step-gold/10 text-step-gold"
                      : "text-step-muted hover:bg-step-card hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-3 border-t border-step-border pt-8">
            {isLoggedIn ? (
              <Link
                href="/konto"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm font-semibold tracking-wider text-step-muted transition hover:bg-step-card hover:text-white"
              >
                MITT KONTO
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/logga-in"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-semibold tracking-wider text-step-muted transition hover:bg-step-card hover:text-white"
                >
                  LOGGA IN
                </Link>
                <Link
                  href="/auth/registrera"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-semibold tracking-wider text-step-gold transition hover:bg-step-card"
                >
                  REGISTRERA
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* CTA pinned at bottom */}
        <div className="border-t border-step-border p-6">
          <Link
            href={ctaHref}
            onClick={() => setOpen(false)}
            className="block rounded border border-step-gold px-4 py-3 text-center text-sm font-semibold tracking-wide text-step-gold transition hover:bg-step-gold hover:text-black"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </>
  );
}
