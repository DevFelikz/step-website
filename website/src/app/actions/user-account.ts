"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { sendWelcomeEmail } from "@/lib/email";

async function requireUserId() {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) throw new Error("Ej inloggad");
  return id;
}

export async function registerUser(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .toLowerCase()
    .trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim() || null;
  if (!email || !password) return { error: "Fyll i mejl och lösenord" };
  if (password.length < 8) return { error: "Lösenordet måste vara minst 8 tecken" };
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: "Mejladressen används redan" };
  const passwordHash = await bcrypt.hash(password, 10);
  try {
    await prisma.user.create({ data: { email, passwordHash, name } });
  } catch {
    return { error: "Kunde inte skapa konto" };
  }

  // Fire-and-forget welcome email
  sendWelcomeEmail({ email, name: name ?? email.split("@")[0] }).catch((e) =>
    console.error("Welcome email failed:", e),
  );

  return { ok: true as const };
}

export async function updateUserProfile(formData: FormData) {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim() || null;
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const addressLine1 = String(formData.get("addressLine1") ?? "").trim() || null;
  const addressLine2 = String(formData.get("addressLine2") ?? "").trim() || null;
  const postalCode = String(formData.get("postalCode") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;
  const country = String(formData.get("country") ?? "").trim() || null;
  const deliveryNotes = String(formData.get("deliveryNotes") ?? "").trim() || null;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      phone,
      addressLine1,
      addressLine2,
      postalCode,
      city,
      country: country || "Sverige",
      deliveryNotes,
    },
  });
  revalidatePath("/konto", "layout");
  redirect("/konto/profil?sparat=1");
}

export async function updateUserBilling(formData: FormData) {
  const userId = await requireUserId();
  const sameBillingAsShipping = formData.get("sameBillingAsShipping") === "on";
  const billingAddressLine1 = String(formData.get("billingAddressLine1") ?? "").trim() || null;
  const billingPostalCode = String(formData.get("billingPostalCode") ?? "").trim() || null;
  const billingCity = String(formData.get("billingCity") ?? "").trim() || null;

  await prisma.user.update({
    where: { id: userId },
    data: {
      sameBillingAsShipping,
      billingAddressLine1,
      billingPostalCode,
      billingCity,
    },
  });
  revalidatePath("/konto", "layout");
  redirect("/konto/profil?sparat=1");
}

export async function updateUserPreferences(formData: FormData) {
  const userId = await requireUserId();
  const notifyShipmentEmail = formData.get("notifyShipmentEmail") === "on";
  const notifyMarketingEmail = formData.get("notifyMarketingEmail") === "on";
  const locale = String(formData.get("locale") ?? "sv").slice(0, 8) || "sv";

  await prisma.user.update({
    where: { id: userId },
    data: {
      notifyShipmentEmail,
      notifyMarketingEmail,
      locale,
    },
  });
  revalidatePath("/konto", "layout");
  redirect("/konto/installningar?sparat=1");
}

export async function updateUserSubscriptionPause(formData: FormData) {
  const userId = await requireUserId();
  const pause = formData.get("pause") === "on";
  const untilRaw = String(formData.get("pausedUntil") ?? "").trim();
  let subscriptionPausedUntil: Date | null = null;
  if (pause) {
    if (!untilRaw) redirect("/konto/prenumeration?fel=pause");
    const d = new Date(untilRaw);
    if (Number.isNaN(d.getTime())) redirect("/konto/prenumeration?fel=pause");
    subscriptionPausedUntil = d;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { subscriptionPausedUntil: pause ? subscriptionPausedUntil : null },
  });
  revalidatePath("/konto", "layout");
  redirect("/konto/prenumeration?sparat=1");
}

export async function changePassword(formData: FormData) {
  const userId = await requireUserId();
  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const repeat = String(formData.get("repeatPassword") ?? "");
  if (!current || !next) redirect("/konto/sakerhet?fel=fyll");
  if (next.length < 8) redirect("/konto/sakerhet?fel=kort");
  if (next !== repeat) redirect("/konto/sakerhet?fel=match");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/konto/sakerhet?fel=user");
  const ok = await bcrypt.compare(current, user.passwordHash);
  if (!ok) redirect("/konto/sakerhet?fel=losen");
  const passwordHash = await bcrypt.hash(next, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  redirect("/konto/sakerhet?losen=1");
}

export async function changeEmail(formData: FormData) {
  const userId = await requireUserId();
  const newEmail = String(formData.get("newEmail") ?? "")
    .toLowerCase()
    .trim();
  const password = String(formData.get("password") ?? "");
  if (!newEmail || !password) redirect("/konto/sakerhet?fel=mejl");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/konto/sakerhet?fel=user");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) redirect("/konto/sakerhet?fel=losen");
  const taken = await prisma.user.findUnique({ where: { email: newEmail } });
  if (taken && taken.id !== userId) redirect("/konto/sakerhet?fel=taken");
  await prisma.user.update({ where: { id: userId }, data: { email: newEmail } });
  await signOut({ redirectTo: "/auth/logga-in?meddelande=Mejl+uppdaterat+logga+in+igen" });
}

export async function changePlanForm(formData: FormData) {
  const userId = await requireUserId();
  const raw = String(formData.get("planId") ?? "").trim();
  const planId = raw === "" ? null : raw;
  if (planId) {
    const plan = await prisma.plan.findFirst({ where: { id: planId, visible: true } });
    if (!plan) redirect("/konto/prenumeration?fel=plan");
  }
  await prisma.user.update({
    where: { id: userId },
    data: { planId },
  });
  revalidatePath("/konto", "layout");
  redirect("/konto/prenumeration?sparat=1");
}

export async function deleteUserAccount(formData: FormData) {
  const userId = await requireUserId();
  const password = String(formData.get("password") ?? "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) redirect("/konto/sakerhet?fel=user");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) redirect("/konto/sakerhet?fel=radera");
  await prisma.user.delete({ where: { id: userId } });
  await signOut({ redirectTo: "/" });
}
