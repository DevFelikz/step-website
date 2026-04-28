import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Publik layout: footer hålls längst ner även när innehållet är kort (flex + min-h-dvh).
 */
export async function SiteShell({
  children,
  activeHref,
}: {
  children: React.ReactNode;
  activeHref?: string;
}) {
  return (
    <div className="flex min-h-dvh flex-col bg-step-bg">
      <Header activeHref={activeHref} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
