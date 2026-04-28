import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE = "https://step.se";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const plans = await prisma.plan.findMany({
    where: { visible: true },
    select: { id: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/shop`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/hur-det-fungerar`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/om-oss`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/kontakt`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/auth/logga-in`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/auth/registrera`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const planRoutes: MetadataRoute.Sitemap = plans.map((p) => ({
    url: `${BASE}/checkout/${p.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...planRoutes];
}
