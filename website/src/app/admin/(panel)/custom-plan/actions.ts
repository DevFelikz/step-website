"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function saveCustomPlanConfig(fd: FormData) {
  const strengths = (fd.get("strengths") as string ?? "")
    .split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n) && n > 0);
  const durations = (fd.get("durations") as string ?? "")
    .split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n) && n > 0);

  const minCans = parseInt(fd.get("minCans") as string) || 1;
  const maxCans = parseInt(fd.get("maxCans") as string) || 4;

  // Build pricePerMg from fields like price_2, price_4, ...
  const pricePerMg: Record<string, number> = {};
  for (const mg of strengths) {
    const val = parseFloat(fd.get(`price_${mg}`) as string);
    if (!isNaN(val)) pricePerMg[mg] = Math.round(val);
  }

  // Build discountByMonths from fields like discount_3, discount_6, ...
  const discountByMonths: Record<string, number> = {};
  for (const d of durations) {
    const pct = parseFloat(fd.get(`discount_${d}`) as string);
    if (!isNaN(pct)) discountByMonths[d] = +(1 - pct / 100).toFixed(4);
  }

  await prisma.customPlanConfig.upsert({
    where: { id: "default" },
    create: {
      pageTitle:       fd.get("pageTitle") as string,
      pageSubtitle:    fd.get("pageSubtitle") as string,
      bannerTitle:     fd.get("bannerTitle") as string,
      bannerSubtitle:  fd.get("bannerSubtitle") as string,
      ctaLabel:        fd.get("ctaLabel") as string,
      strengths:       JSON.stringify(strengths),
      durations:       JSON.stringify(durations),
      minCans,
      maxCans,
      pricePerMg:      JSON.stringify(pricePerMg),
      discountByMonths: JSON.stringify(discountByMonths),
    },
    update: {
      pageTitle:       fd.get("pageTitle") as string,
      pageSubtitle:    fd.get("pageSubtitle") as string,
      bannerTitle:     fd.get("bannerTitle") as string,
      bannerSubtitle:  fd.get("bannerSubtitle") as string,
      ctaLabel:        fd.get("ctaLabel") as string,
      strengths:       JSON.stringify(strengths),
      durations:       JSON.stringify(durations),
      minCans,
      maxCans,
      pricePerMg:      JSON.stringify(pricePerMg),
      discountByMonths: JSON.stringify(discountByMonths),
    },
  });

  revalidatePath("/shop/anpassa");
  revalidatePath("/shop");
}
