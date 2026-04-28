import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { SiteShell } from "@/components/site/SiteShell";

const reserved = new Set(["shop", "admin", "api", "auth", "konto"]);

type Props = { params: Promise<{ slug: string }> };

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  if (reserved.has(slug)) notFound();

  const page = await prisma.contentPage.findFirst({
    where: { slug, visible: true },
  });
  if (!page) notFound();

  const href = `/${slug}`;
  return (
    <SiteShell activeHref={href}>
      <div className="reveal-stagger-v mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6 sm:py-20">
        <h1 className="text-3xl font-bold text-white">{page.title}</h1>
        <div className="cms-content mt-8" dangerouslySetInnerHTML={{ __html: page.content }} />
      </div>
    </SiteShell>
  );
}
