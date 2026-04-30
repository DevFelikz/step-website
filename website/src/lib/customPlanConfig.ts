import { prisma } from "@/lib/db";

export type CustomPlanConfigRow = {
  id: string;
  pageTitle: string;
  pageSubtitle: string;
  bannerTitle: string;
  bannerSubtitle: string;
  ctaLabel: string;
  strengths: string;
  durations: string;
  minCans: number;
  maxCans: number;
  pricePerMg: string;
  discountByMonths: string;
};

export type ParsedCustomPlanConfig = {
  pageTitle: string;
  pageSubtitle: string;
  bannerTitle: string;
  bannerSubtitle: string;
  ctaLabel: string;
  strengths: number[];
  durations: number[];
  minCans: number;
  maxCans: number;
  pricePerMg: Record<number, number>;
  discountByMonths: Record<number, number>;
};

export async function getCustomPlanConfig(): Promise<ParsedCustomPlanConfig> {
  const raw = await prisma.customPlanConfig.upsert({
    where: { id: "default" },
    create: {},
    update: {},
  });
  return parseConfig(raw);
}

export function parseConfig(raw: CustomPlanConfigRow): ParsedCustomPlanConfig {
  const strengths: number[] = safeJson(raw.strengths, [2, 4, 6, 8, 10, 12, 16, 20]);
  const durations: number[] = safeJson(raw.durations, [3, 6, 9, 12]);
  const pricePerMg: Record<number, number> = safeJson(raw.pricePerMg, {});
  const discountByMonths: Record<number, number> = safeJson(raw.discountByMonths, {});

  return {
    pageTitle: raw.pageTitle,
    pageSubtitle: raw.pageSubtitle,
    bannerTitle: raw.bannerTitle,
    bannerSubtitle: raw.bannerSubtitle,
    ctaLabel: raw.ctaLabel,
    strengths,
    durations,
    minCans: raw.minCans,
    maxCans: raw.maxCans,
    pricePerMg,
    discountByMonths,
  };
}

function safeJson<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}
