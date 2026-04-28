import { sanitizeHeroImageUrl } from "@/lib/sanitizeHeroImageUrl";

type Props = {
  siteName: string;
  navLogoUrl: string | null | undefined;
  className?: string;
};

/** Header-varumärke: valfri bild från inställningar, annars siteName som text (ingen inbyggd SVG). */
export function SiteNavLogo({ siteName, navLogoUrl, className = "" }: Props) {
  const safe = sanitizeHeroImageUrl(String(navLogoUrl ?? ""));
  /** ~68–72px höjd i h-20-navbar (80px): lite luft så den ser centrerad ut utan massiv overflow. */
  const imgClasses =
    "block self-center h-[68px] w-auto max-w-[520px] object-contain object-left sm:h-[72px]";
  /** Parent är inline-grid items-center — vertikal mitt i navbar-slotten även vid overflow. */
  const textSlot =
    "max-w-[520px] font-black italic leading-none tracking-tight text-white text-2xl sm:text-3xl";
  if (safe) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={safe} alt={siteName} className={`${imgClasses} ${className}`} />
      </>
    );
  }
  return <span className={`${textSlot} self-center ${className}`}>{siteName}</span>;
}
