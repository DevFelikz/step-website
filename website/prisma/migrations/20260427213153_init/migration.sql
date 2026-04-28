-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "siteName" TEXT NOT NULL DEFAULT 'STEP',
    "siteTagline" TEXT NOT NULL DEFAULT 'Steg för steg mot mindre nikotin',
    "navCtaLabel" TEXT NOT NULL DEFAULT 'STARTA PLAN',
    "navCtaHref" TEXT NOT NULL DEFAULT '/shop',
    "heroEyebrow" TEXT NOT NULL DEFAULT 'Sluta med nikotin',
    "heroTitle" TEXT NOT NULL DEFAULT 'Ta kontroll',
    "heroTitleAccent" TEXT NOT NULL DEFAULT 'steg för steg',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'En strukturerad metod med månadsleveranser — anpassad för dig.',
    "heroCtaLabel" TEXT NOT NULL DEFAULT 'STARTA DIN RESA',
    "heroCtaHref" TEXT NOT NULL DEFAULT '/shop',
    "shopTitle" TEXT NOT NULL DEFAULT 'Välj din nivå',
    "shopSubtitle" TEXT NOT NULL DEFAULT 'Vi guidar dig nedåt i styrka — i din takt.',
    "plansSectionTitle" TEXT NOT NULL DEFAULT 'VÅRA PLANER',
    "plansSectionSubtitle" TEXT NOT NULL DEFAULT 'Hitta rätt nivå för dig.',
    "includedTitle" TEXT NOT NULL DEFAULT 'INGÅR I ALLA PLANER',
    "footerLine" TEXT NOT NULL DEFAULT 'Designad i Sverige.',
    "footerBlurb" TEXT NOT NULL DEFAULT 'STEP är ett program för att trappa ner nikotin över tid — inte medicinsk rådgivning.',
    "copyrightText" TEXT NOT NULL DEFAULT 'STEP',
    "metaTitle" TEXT NOT NULL DEFAULT 'STEP — Steg för steg',
    "metaDescription" TEXT NOT NULL DEFAULT 'Prenumeration på nikotinportioner med planerad nedtrappning.',
    "contactEmail" TEXT NOT NULL DEFAULT 'support@example.com',
    "contactPhone" TEXT NOT NULL DEFAULT '+46 8 123 45 67',
    "contactHours" TEXT NOT NULL DEFAULT 'Mån–Fre 09:00–17:00',
    "contactCity" TEXT NOT NULL DEFAULT 'Stockholm, Sverige'
);

-- CreateTable
CREATE TABLE "NavLink" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceLabel" TEXT NOT NULL,
    "cansLabel" TEXT NOT NULL,
    "badge" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "bullets" TEXT NOT NULL DEFAULT '[]',
    "ctaLabel" TEXT NOT NULL,
    "ctaHref" TEXT NOT NULL DEFAULT '/shop',
    "sort" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "TrustItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "ContentPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "visible" BOOLEAN NOT NULL DEFAULT true
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentPage_slug_key" ON "ContentPage"("slug");
