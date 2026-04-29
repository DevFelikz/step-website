"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

// Price per can (SEK) by nicotine strength
const PRICE_PER_CAN: Record<number, number> = {
  2: 149, 4: 159, 6: 169, 8: 179,
  10: 189, 12: 199, 16: 219, 20: 239,
};

// Discount factor by program duration
const DURATION_DISCOUNT: Record<number, number> = {
  3: 1.0, 6: 0.95, 9: 0.9, 12: 0.85,
};

export async function createCustomPlan(formData: FormData) {
  const startMg = parseInt(String(formData.get("startMg") ?? "12"), 10);
  const durationMonths = parseInt(String(formData.get("durationMonths") ?? "6"), 10);
  const cansPerDelivery = parseInt(String(formData.get("cansPerDelivery") ?? "2"), 10);

  const validMg = [2, 4, 6, 8, 10, 12, 16, 20];
  const validDurations = [3, 6, 9, 12];
  const validCans = [1, 2, 3, 4];

  if (!validMg.includes(startMg) || !validDurations.includes(durationMonths) || !validCans.includes(cansPerDelivery)) {
    redirect("/shop?fel=ogiltig-konfiguration");
  }

  const pricePerCan = PRICE_PER_CAN[startMg] ?? 199;
  const discount = DURATION_DISCOUNT[durationMonths] ?? 1.0;
  const monthlyKr = Math.round(pricePerCan * cansPerDelivery);
  const totalKr = Math.round(monthlyKr * durationMonths * discount);
  const savings = durationMonths > 3 ? Math.round(monthlyKr * durationMonths * (1 - discount)) : 0;

  const bullets = JSON.stringify([
    `Startar på ${startMg} mg — trappas stegvis ned till 0 mg`,
    `${cansPerDelivery} burk${cansPerDelivery > 1 ? "ar" : ""} per månadsleveras`,
    `${durationMonths} leveranser totalt`,
    savings > 0 ? `Du sparar ${savings} kr jämfört med månadsabonnemang` : "Ingen bindningstid",
    "Anpassad nedtrappningstakt baserad på din startdos",
  ]);

  const plan = await prisma.plan.create({
    data: {
      name: `Anpassad plan — ${startMg} mg`,
      subtitle: `${durationMonths} månader · ${cansPerDelivery} burk${cansPerDelivery > 1 ? "ar" : ""}/lev.`,
      description: `Skräddarsydd nedtrappningsplan från ${startMg} mg till 0 mg på ${durationMonths} månader.`,
      priceLabel: `${monthlyKr} kr/mån`,
      cansLabel: `${cansPerDelivery} burk${cansPerDelivery > 1 ? "ar" : ""}/lev.`,
      ctaLabel: "Beställ nu",
      ctaHref: "/shop",
      bullets,
      visible: false,
      isCustom: true,
      sort: 999,
    },
  });

  redirect(`/checkout/${plan.id}`);
}
