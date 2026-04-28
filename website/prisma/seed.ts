import { prisma } from "../src/lib/db";
import { cmsPages, siteDefaults } from "./seed-copy";

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...siteDefaults },
    update: { ...siteDefaults },
  });

  const navCount = await prisma.navLink.count();
  if (navCount === 0) {
    await prisma.navLink.createMany({
      data: [
        { label: "SHOP", href: "/shop", sort: 0 },
        { label: "SÅ FUNGERAR DET", href: "/how-it-works", sort: 1 },
        { label: "OM STEP", href: "/about", sort: 2 },
        { label: "FAQ", href: "/faq", sort: 3 },
        { label: "KONTAKT", href: "/contact", sort: 4 },
      ],
    });
  }

  const planCount = await prisma.plan.count();
  if (planCount === 0) {
    await prisma.plan.createMany({
      data: [
        {
          name: "STEP ONE",
          subtitle: "Lättare eller nyfiken på nedsteg",
          description:
            "10 burkar per månad passar dig som redan vill skala ner, kombinera med andra vanor eller prova programmet utan att committa till hög volym.",
          priceLabel: "499 kr / månad",
          cansLabel: "10 BURKAR / MÅNAD",
          featured: false,
          bullets: JSON.stringify([
            "Tydlig månadskurva i styrka",
            "Diskret leverans till box eller dörr",
            "Pausa eller säg upp utan bindning",
            "Samma kvalitet som övriga planer",
          ]),
          ctaLabel: "BÖRJA HÄR",
          sort: 0,
        },
        {
          name: "STEP TWO",
          subtitle: "Daglig användning — vårt mittfång",
          description:
            "20 burkar per månad är vår mest valda nivå: tillräckligt för stabil förbrukning samtidigt som du följer programmet steg för steg mot lägre nikotin.",
          priceLabel: "999 kr / månad",
          cansLabel: "20 BURKAR / MÅNAD",
          badge: "MEST POPULÄR",
          featured: true,
          bullets: JSON.stringify([
            "Bäst värde för regelbunden användning",
            "Månadsvis plan du slipper pussla ihop själv",
            "Justerbar leveransadress i kontot",
            "Support på svenska vardagar",
          ]),
          ctaLabel: "BÖRJA HÄR",
          sort: 1,
        },
        {
          name: "STEP THREE",
          subtitle: "Högre volym under resan",
          description:
            "30 burkar per månad när du behöver mer marginal under stressiga perioder — samma strukturerade metod, bara fler burkar i lådan.",
          priceLabel: "1 499 kr / månad",
          cansLabel: "30 BURKAR / MÅNAD",
          featured: false,
          bullets: JSON.stringify([
            "Mer volym utan att tappa programspåret",
            "Lämplig vid hög förbrukning idag",
            "Enkel upp- eller nedgradering över tid",
            "Samma diskreta leverans som alltid",
          ]),
          ctaLabel: "BÖRJA HÄR",
          sort: 2,
        },
      ],
    });
  }

  const trustCount = await prisma.trustItem.count();
  if (trustCount === 0) {
    await prisma.trustItem.createMany({
      data: [
        {
          icon: "target",
          title: "Stegvis minskning",
          body: "Tydliga mål per månad i stället för diffusa löften.",
          sort: 0,
        },
        {
          icon: "shield",
          title: "Premiumkvalitet",
          body: "Utvalda portioner med fokus på smak och konsistens.",
          sort: 1,
        },
        {
          icon: "truck",
          title: "Månadsleverans",
          body: "Automatisk takt så du inte behöver tänka på nästa köp.",
          sort: 2,
        },
        {
          icon: "sliders",
          title: "Flexibelt",
          body: "Ändra adress, pausa eller hoppa över när livet kräver det.",
          sort: 3,
        },
        {
          icon: "lock",
          title: "Ingen bindning",
          body: "Säg upp när du vill — inga dolda perioder.",
          sort: 4,
        },
      ],
    });
  }

  for (const p of cmsPages) {
    await prisma.contentPage.upsert({
      where: { slug: p.slug },
      create: p,
      update: { title: p.title, content: p.content },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
