/**
 * Payment method logo badges.
 * SVG paths sourced from simple-icons (https://simpleicons.org, CC0 1.0 Universal).
 * Mastercard uses official dual-colour design (EB001B / F79E1B).
 * Swish uses the official logo mark from swish.nu.
 */
import Image from "next/image";

export function PaymentLogos() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {LOGOS.map((logo) => (
        <span
          key={logo.label}
          title={logo.label}
          aria-label={logo.label}
          className={`flex h-8 w-[3.25rem] shrink-0 items-center justify-center overflow-hidden rounded border px-1 shadow-sm ${
            logo.darkBg
              ? "border-black/20 bg-black"
              : "border-black/10 bg-white"
          }`}
        >
          {logo.element}
        </span>
      ))}
    </div>
  );
}

/* ─── Individual logos ───────────────────────────────────────────────────── */

const LOGOS: { label: string; darkBg?: boolean; element: React.ReactNode }[] = [
  {
    label: "Visa",
    element: (
      /* Official VISA navy #1A1F71 wordmark, viewBox 0 0 24 24 */
      <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-auto" role="img">
        <path
          fill="#1A1F71"
          d="M9.112 8.262L5.97 15.758H3.92L2.374 9.775c-.094-.368-.175-.503-.461-.658C1.447 8.864.677 8.627 0 8.479l.046-.217h3.3a.904.904 0 01.894.764l.817 4.338 2.018-5.102zm8.033 5.049c.008-1.979-2.736-2.088-2.717-2.972.006-.269.262-.555.822-.628a3.66 3.66 0 011.913.336l.34-1.59a5.207 5.207 0 00-1.814-.333c-1.917 0-3.266 1.02-3.278 2.479-.012 1.079.963 1.68 1.698 2.04.756.367 1.01.603 1.006.931-.005.504-.602.725-1.16.734-.975.015-1.54-.263-1.992-.473l-.351 1.642c.453.208 1.289.39 2.156.398 2.037 0 3.37-1.006 3.377-2.564m5.061 2.447H24l-1.565-7.496h-1.656a.883.883 0 00-.826.55l-2.909 6.946h2.036l.405-1.12h2.488zm-2.163-2.656l1.02-2.815.588 2.815zm-8.16-4.84l-1.603 7.496H8.34l1.605-7.496z"
        />
      </svg>
    ),
  },
  {
    label: "Mastercard",
    element: (
      /* Dual-colour overlapping circles — official brand colours */
      <svg viewBox="0 0 38 24" aria-hidden className="h-5 w-auto" role="img">
        <circle cx="14.5" cy="12" r="10" fill="#EB001B" />
        <circle cx="23.5" cy="12" r="10" fill="#F79E1B" />
        <path
          d="M19 4.27a10 10 0 0 1 0 15.46A10 10 0 0 1 19 4.27z"
          fill="#FF5F00"
        />
      </svg>
    ),
  },
  {
    label: "Klarna",
    element: (
      /* Klarna pink #FFB3C7 brand, path from simple-icons */
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-auto" role="img">
        <path
          fill="#FFB3C7"
          d="M4.592 2v20H0V2h4.592zm11.46 0c0 4.194-1.583 8.105-4.415 11.068l-.278.283L17.702 22h-5.668l-6.893-9.4 1.779-1.332c2.858-2.14 4.535-5.378 4.637-8.924L11.562 2h4.49zM21.5 17a2.5 2.5 0 110 5 2.5 2.5 0 010-5z"
        />
      </svg>
    ),
  },
  {
    label: "Swish",
    element: (
      <Image
        src="/swish-logo.png"
        alt="Swish"
        width={52}
        height={52}
        className="h-7 w-7 object-contain"
      />
    ),
  },
  {
    label: "American Express",
    element: (
      /* Amex #2E77BC, simplified wordmark */
      <svg viewBox="0 0 52 24" aria-hidden className="h-5 w-auto" role="img">
        <rect width="52" height="24" rx="3" fill="#2E77BC" />
        <text
          x="26"
          y="16.5"
          textAnchor="middle"
          fontFamily="Arial,sans-serif"
          fontWeight="bold"
          fontSize="8.5"
          fill="white"
          letterSpacing="0.5"
        >
          AMEX
        </text>
      </svg>
    ),
  },
];
