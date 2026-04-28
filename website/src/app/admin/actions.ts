"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { clearAdminCookie, getAdminFromCookies } from "@/lib/auth";
import { sanitizeHeroImageUrl } from "@/lib/sanitizeHeroImageUrl";

export async function adminLogout() {
  await clearAdminCookie();
  redirect("/admin/login");
}

async function guard() {
  if (!(await getAdminFromCookies())) redirect("/admin/login");
}

export async function updateSiteSettings(data: FormData) {
  await guard();
  const pick = (k: string) => {
    const v = data.get(k);
    return typeof v === "string" ? v.trim() : "";
  };
  const heroRaw = pick("heroBackgroundImage");
  const heroBackgroundImage =
    heroRaw === "" ? null : sanitizeHeroImageUrl(heroRaw) ?? null;
  const navRaw = pick("navLogoUrl");
  const navLogoUrl = navRaw === "" ? null : sanitizeHeroImageUrl(navRaw) ?? null;

  await prisma.siteSettings.update({
    where: { id: "default" },
    data: {
      siteName: pick("siteName"),
      siteTagline: pick("siteTagline"),
      navCtaLabel: pick("navCtaLabel"),
      navCtaHref: pick("navCtaHref"),
      heroEyebrow: pick("heroEyebrow"),
      heroTitle: pick("heroTitle"),
      heroTitleAccent: pick("heroTitleAccent"),
      heroSubtitle: pick("heroSubtitle"),
      heroCtaLabel: pick("heroCtaLabel"),
      heroCtaHref: pick("heroCtaHref"),
      heroBackgroundImage,
      shopTitle: pick("shopTitle"),
      shopSubtitle: pick("shopSubtitle"),
      plansSectionTitle: pick("plansSectionTitle"),
      plansSectionSubtitle: pick("plansSectionSubtitle"),
      includedTitle: pick("includedTitle"),
      footerLine: pick("footerLine"),
      footerBlurb: pick("footerBlurb"),
      copyrightText: pick("copyrightText"),
      metaTitle: pick("metaTitle"),
      metaDescription: pick("metaDescription"),
      contactEmail: pick("contactEmail"),
      contactPhone: pick("contactPhone"),
      contactHours: pick("contactHours"),
      contactCity: pick("contactCity"),
      navLogoUrl,
    },
  });
  revalidatePath("/", "layout");
  revalidatePath("/shop");
}

export async function upsertNavLink(data: FormData) {
  await guard();
  const id = data.get("id");
  const label = String(data.get("label") ?? "");
  const href = String(data.get("href") ?? "");
  const sort = Number(data.get("sort") ?? 0);
  const visible = data.get("visible") === "on" || data.get("visible") === "true";
  if (typeof id === "string" && id) {
    await prisma.navLink.update({
      where: { id },
      data: { label, href, sort, visible },
    });
  } else {
    await prisma.navLink.create({ data: { label, href, sort, visible } });
  }
  revalidatePath("/", "layout");
}

export async function deleteNavLink(id: string) {
  await guard();
  await prisma.navLink.delete({ where: { id } });
  revalidatePath("/", "layout");
}

export async function upsertPlan(data: FormData) {
  await guard();
  const id = data.get("id");
  const bulletsRaw = String(data.get("bullets") ?? "");
  let bullets = "[]";
  try {
    const lines = bulletsRaw.split("\n").map((l) => l.trim()).filter(Boolean);
    bullets = JSON.stringify(lines);
  } catch {
    bullets = "[]";
  }
  const cardRaw = String(data.get("cardImage") ?? "").trim();
  const cardImage = cardRaw === "" ? null : sanitizeHeroImageUrl(cardRaw) ?? null;

  const sortRaw = Number(data.get("sort") ?? 0);
  const sort = Number.isFinite(sortRaw) ? Math.trunc(sortRaw) : 0;

  const payload = {
    name: String(data.get("name") ?? ""),
    subtitle: String(data.get("subtitle") ?? ""),
    description: String(data.get("description") ?? ""),
    priceLabel: String(data.get("priceLabel") ?? ""),
    cansLabel: String(data.get("cansLabel") ?? ""),
    badge: String(data.get("badge") ?? "") || null,
    featured: data.get("featured") === "on",
    bullets,
    ctaLabel: String(data.get("ctaLabel") ?? ""),
    ctaHref: String(data.get("ctaHref") ?? "/shop"),
    sort,
    visible: data.get("visible") === "on",
    cardImage,
  };
  if (typeof id === "string" && id) {
    await prisma.plan.update({ where: { id }, data: payload });
  } else {
    await prisma.plan.create({ data: payload });
  }
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function deletePlan(id: string) {
  await guard();
  await prisma.plan.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function upsertTrustItem(data: FormData) {
  await guard();
  const id = data.get("id");
  const payload = {
    icon: String(data.get("icon") ?? "target"),
    title: String(data.get("title") ?? ""),
    body: String(data.get("body") ?? ""),
    sort: Number(data.get("sort") ?? 0),
    visible: data.get("visible") === "on",
  };
  if (typeof id === "string" && id) {
    await prisma.trustItem.update({ where: { id }, data: payload });
  } else {
    await prisma.trustItem.create({ data: payload });
  }
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function deleteTrustItem(id: string) {
  await guard();
  await prisma.trustItem.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/shop");
}

export async function upsertContentPage(data: FormData) {
  await guard();
  const id = data.get("id");
  const slug = String(data.get("slug") ?? "").toLowerCase().replace(/\s+/g, "-");
  const title = String(data.get("title") ?? "");
  const content = String(data.get("content") ?? "");
  const visible = data.get("visible") === "on";
  if (!slug) return;
  if (typeof id === "string" && id) {
    await prisma.contentPage.update({
      where: { id },
      data: { slug, title, content, visible },
    });
  } else {
    await prisma.contentPage.create({ data: { slug, title, content, visible } });
  }
  revalidatePath(`/${slug}`);
}

export async function deleteContentPage(id: string) {
  await guard();
  await prisma.contentPage.delete({ where: { id } });
  revalidatePath("/", "layout");
}

export async function setUserBanned(data: FormData) {
  await guard();
  const id = String(data.get("userId") ?? "").trim();
  const action = String(data.get("action") ?? "");
  const reason = String(data.get("reason") ?? "").trim();
  if (!id) return;
  if (action === "ban") {
    await prisma.user.update({
      where: { id },
      data: {
        banned: true,
        bannedAt: new Date(),
        banReason: reason || "Administratör",
      },
    });
  } else if (action === "unban") {
    await prisma.user.update({
      where: { id },
      data: { banned: false, bannedAt: null, banReason: null },
    });
  }
  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
  revalidatePath("/", "layout");
}

// ── Payment providers ────────────────────────────────────────────────────────

export async function updatePaymentProvider(data: FormData) {
  await guard();
  const id = String(data.get("providerId") ?? "").trim();
  if (!id) return;

  const enabled = data.get("enabled") === "on";

  // Collect all config_* fields into one JSON object, merging with existing
  const existing = await prisma.paymentProvider.findUnique({ where: { id } });
  let merged: Record<string, unknown> = {};
  try { merged = JSON.parse(existing?.configJson ?? "{}") as Record<string, unknown>; } catch {}

  for (const [key, value] of data.entries()) {
    if (!key.startsWith("config_")) continue;
    const cfgKey = key.slice("config_".length);
    if (cfgKey === "testMode") {
      merged[cfgKey] = value === "on";
    } else if (String(value).trim() !== "") {
      merged[cfgKey] = String(value).trim();
    }
  }

  await prisma.paymentProvider.upsert({
    where: { id },
    update: { enabled, configJson: JSON.stringify(merged) },
    create: { id, displayName: id, enabled, configJson: JSON.stringify(merged) },
  });

  revalidatePath("/admin/payments");
}

// ── FAQ ───────────────────────────────────────────────────────────────────────

export async function upsertFaqItem(data: FormData) {
  await guard();
  const id = String(data.get("id") ?? "").trim() || undefined;
  const category = String(data.get("category") ?? "Allmänt").trim();
  const question = String(data.get("question") ?? "").trim();
  const answer = String(data.get("answer") ?? "").trim();
  const sort = parseInt(String(data.get("sort") ?? "0"), 10) || 0;
  const visible = data.get("visible") !== null;

  if (!question || !answer) return;

  if (id) {
    await prisma.faqItem.update({ where: { id }, data: { category, question, answer, sort, visible } });
  } else {
    await prisma.faqItem.create({ data: { category, question, answer, sort, visible } });
  }
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

export async function deleteFaqItem(id: string) {
  await guard();
  await prisma.faqItem.delete({ where: { id } });
  revalidatePath("/admin/faq");
  revalidatePath("/faq");
}

// ── Newsletter sending ────────────────────────────────────────────────────────

export type SendNewsletterResult =
  | { ok: true; sent: number; failed: number }
  | { ok: false; error: string };

export async function sendNewsletter(formData: FormData): Promise<SendNewsletterResult> {
  await guard();

  const subject = String(formData.get("subject") ?? "").trim();
  const bodyHtml = String(formData.get("bodyHtml") ?? "").trim();
  const recipientMode = String(formData.get("recipientMode") ?? "all");

  if (!subject) return { ok: false, error: "Ämnesrad saknas" };
  if (!bodyHtml) return { ok: false, error: "Innehåll saknas" };

  // Collect recipient emails
  let emails: string[] = [];
  if (recipientMode === "selected") {
    const ids = formData.getAll("recipientIds").map(String).filter(Boolean);
    if (ids.length === 0) return { ok: false, error: "Välj minst en mottagare" };
    const subs = await prisma.newsletterSubscriber.findMany({
      where: { id: { in: ids } },
      select: { email: true },
    });
    emails = subs.map((s) => s.email);
  } else {
    const all = await prisma.newsletterSubscriber.findMany({ select: { email: true } });
    emails = all.map((s) => s.email);
  }

  if (emails.length === 0) return { ok: false, error: "Inga mottagare" };

  // Check Resend config
  const resendKey = process.env.RESEND_API_KEY ?? "";
  const resendConfigured =
    resendKey.startsWith("re_") && resendKey !== "re_REPLACE_ME" && resendKey.length > 10;

  if (!resendConfigured) {
    // Dev mode — log and pretend it worked
    console.log(`[newsletter] Would send to ${emails.length} recipients:`, subject);
    await prisma.sentNewsletter.create({
      data: { subject, bodyHtml, recipientCount: emails.length },
    });
    revalidatePath("/admin/newsletter");
    return { ok: true, sent: emails.length, failed: 0 };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);
  const from = process.env.RESEND_FROM_EMAIL ?? "no-reply@step.se";

  let sent = 0;
  let failed = 0;

  // Send in batches of 100 (Resend batch limit)
  const BATCH = 100;
  for (let i = 0; i < emails.length; i += BATCH) {
    const batch = emails.slice(i, i + BATCH);
    try {
      await resend.batch.send(
        batch.map((to) => ({
          from,
          to,
          subject,
          html: bodyHtml,
        })),
      );
      sent += batch.length;
    } catch (err) {
      console.error("Newsletter batch failed:", err);
      failed += batch.length;
    }
  }

  // Save to history
  await prisma.sentNewsletter.create({
    data: { subject, bodyHtml, recipientCount: sent },
  });

  revalidatePath("/admin/newsletter");
  return { ok: true, sent, failed };
}
