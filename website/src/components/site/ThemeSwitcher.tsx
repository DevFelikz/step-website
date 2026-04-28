"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder with the same dimensions to prevent layout shift
    return <div className="h-8 w-[3.75rem] rounded-full" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isDark}
      aria-label={isDark ? "Byt till ljust tema" : "Byt till mörkt tema"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative flex h-8 w-[3.75rem] shrink-0 cursor-pointer items-center rounded-full border border-step-border bg-step-surface px-1 transition-colors duration-300 hover:border-step-gold/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-step-gold"
    >
      {/* Track fill */}
      <span
        className={`absolute inset-0 rounded-full transition-colors duration-300 ${
          isDark ? "bg-step-surface" : "bg-step-gold/15"
        }`}
        aria-hidden
      />

      {/* Thumb */}
      <span
        className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-all duration-300 ${
          isDark
            ? "translate-x-0 bg-step-card"
            : "translate-x-[1.75rem] bg-step-gold"
        }`}
        aria-hidden
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>

      {/* Secondary icon (faded, opposite side) */}
      <span
        className={`absolute z-10 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ${
          isDark ? "right-1 opacity-30" : "left-1 opacity-30"
        }`}
        aria-hidden
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5 text-step-gold"
      aria-hidden
    >
      <path d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zm5.303 2.697a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 01-1.06-1.06l1.06-1.061a.75.75 0 011.06 0zm-10.606 0a.75.75 0 011.06 0l1.061 1.06a.75.75 0 01-1.06 1.06L4.697 5.758a.75.75 0 010-1.06zM10 6a4 4 0 100 8 4 4 0 000-8zm-7.25 3.25a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zm13 0a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1.5zm-9.97 4.47a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06L5.78 15.78a.75.75 0 010-1.06zm8.5 0a.75.75 0 011.06 1.06l-1.06 1.06a.75.75 0 01-1.06-1.06l1.06-1.06zM10 15.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5 text-step-muted"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
        clipRule="evenodd"
      />
    </svg>
  );
}
