import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/siteSettings";
import { Providers } from "@/components/Providers";

export const dynamic = "force-dynamic";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: { default: s.metaTitle, template: `%s — ${s.siteName}` },
    description: s.metaDescription,
    metadataBase: new URL("https://step.se"),
    openGraph: {
      type: "website",
      locale: "sv_SE",
      siteName: s.siteName,
    },
    twitter: { card: "summary_large_image" },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${dmSans.variable} step-motion h-full`} suppressHydrationWarning>
      <body className="min-h-dvh">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
