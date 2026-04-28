import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY ?? "";
const resendConfigured =
  resendKey.startsWith("re_") && resendKey !== "re_REPLACE_ME" && resendKey.length > 10;

const from =
  process.env.RESEND_FROM_EMAIL ?? "no-reply@step.se";

function getResend(): Resend {
  if (!resendConfigured) throw new Error("Resend is not configured.");
  return new Resend(resendKey);
}

// ─── Templates ───────────────────────────────────────────────────────────────

function orderConfirmationHtml({
  name,
  planName,
  totalKr,
  orderId,
}: {
  name: string;
  planName: string;
  totalKr: number;
  orderId: string;
}) {
  return `<!DOCTYPE html>
<html lang="sv">
<head><meta charset="UTF-8"><title>Orderbekräftelse</title></head>
<body style="font-family:sans-serif;background:#0a0a0a;color:#f5f5f5;padding:40px">
  <div style="max-width:560px;margin:auto;background:#141414;border-radius:12px;padding:40px;border:1px solid #2a2a2a">
    <div style="text-align:center;margin-bottom:32px">
      <span style="font-size:28px;font-weight:800;letter-spacing:-.05em;color:#c9a227">STEP</span>
    </div>
    <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Tack för din beställning, ${name}!</h1>
    <p style="color:#9ca3af;margin:0 0 32px">Din prenumeration är aktiverad och första leveransen är på väg.</p>
    <div style="background:#111;border-radius:8px;padding:20px;margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="color:#9ca3af;font-size:14px">Plan</span>
        <span style="font-weight:600">${planName}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <span style="color:#9ca3af;font-size:14px">Totalbelopp</span>
        <span style="font-weight:600">${totalKr} kr</span>
      </div>
      <div style="display:flex;justify-content:space-between">
        <span style="color:#9ca3af;font-size:14px">Ordernummer</span>
        <span style="font-family:monospace;font-size:12px;color:#9ca3af">${orderId}</span>
      </div>
    </div>
    <a href="https://step.se/konto/prenumeration"
       style="display:block;text-align:center;background:#c9a227;color:#000;font-weight:700;padding:14px;border-radius:8px;text-decoration:none">
      Visa min prenumeration →
    </a>
    <p style="text-align:center;color:#555;font-size:12px;margin-top:24px">
      STEP • support@step.se<br>
      Du får detta mejl för att du registrerade ett konto hos STEP.
    </p>
  </div>
</body>
</html>`;
}

function welcomeHtml({ name }: { name: string }) {
  return `<!DOCTYPE html>
<html lang="sv">
<head><meta charset="UTF-8"><title>Välkommen till STEP</title></head>
<body style="font-family:sans-serif;background:#0a0a0a;color:#f5f5f5;padding:40px">
  <div style="max-width:560px;margin:auto;background:#141414;border-radius:12px;padding:40px;border:1px solid #2a2a2a">
    <div style="text-align:center;margin-bottom:32px">
      <span style="font-size:28px;font-weight:800;letter-spacing:-.05em;color:#c9a227">STEP</span>
    </div>
    <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Välkommen, ${name}!</h1>
    <p style="color:#9ca3af;margin:0 0 24px">
      Du är nu registrerad hos STEP. Utforska våra planer och ta det första steget mot ett liv med mindre nikotin.
    </p>
    <a href="https://step.se/shop"
       style="display:block;text-align:center;background:#c9a227;color:#000;font-weight:700;padding:14px;border-radius:8px;text-decoration:none">
      Välj din plan →
    </a>
    <p style="text-align:center;color:#555;font-size:12px;margin-top:24px">STEP • support@step.se</p>
  </div>
</body>
</html>`;
}

function shippingNoticeHtml({
  name,
  strengthMg,
  trackingUrl,
}: {
  name: string;
  strengthMg: number;
  trackingUrl?: string | null;
}) {
  return `<!DOCTYPE html>
<html lang="sv">
<head><meta charset="UTF-8"><title>Din STEP-leverans är på väg</title></head>
<body style="font-family:sans-serif;background:#0a0a0a;color:#f5f5f5;padding:40px">
  <div style="max-width:560px;margin:auto;background:#141414;border-radius:12px;padding:40px;border:1px solid #2a2a2a">
    <div style="text-align:center;margin-bottom:32px">
      <span style="font-size:28px;font-weight:800;letter-spacing:-.05em;color:#c9a227">STEP</span>
    </div>
    <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Din leverans är på väg, ${name}!</h1>
    <p style="color:#9ca3af;margin:0 0 24px">
      Denna månads portion — <strong style="color:#fff">${strengthMg} mg</strong> — är nu skickad.
    </p>
    ${
      trackingUrl
        ? `<a href="${trackingUrl}" style="display:block;text-align:center;background:#c9a227;color:#000;font-weight:700;padding:14px;border-radius:8px;text-decoration:none">Spåra försändelsen →</a>`
        : ""
    }
    <p style="text-align:center;color:#555;font-size:12px;margin-top:24px">STEP • support@step.se</p>
  </div>
</body>
</html>`;
}

// ─── Exported send functions ──────────────────────────────────────────────────

export async function sendOrderConfirmation(opts: {
  email: string;
  name: string;
  planName: string;
  totalKr: number;
  orderId: string;
}) {
  if (!resendConfigured) {
    console.log("[email] Resend not configured — skipping orderConfirmation");
    return;
  }
  const resend = getResend();
  await resend.emails.send({
    from,
    to: opts.email,
    subject: "Din beställning hos STEP är bekräftad",
    html: orderConfirmationHtml(opts),
  });
}

export async function sendWelcomeEmail(opts: { email: string; name: string }) {
  if (!resendConfigured) {
    console.log("[email] Resend not configured — skipping welcome");
    return;
  }
  const resend = getResend();
  await resend.emails.send({
    from,
    to: opts.email,
    subject: "Välkommen till STEP",
    html: welcomeHtml(opts),
  });
}

export async function sendShippingNotice(opts: {
  email: string;
  name: string;
  strengthMg: number;
  trackingUrl?: string | null;
}) {
  if (!resendConfigured) {
    console.log("[email] Resend not configured — skipping shippingNotice");
    return;
  }
  const resend = getResend();
  await resend.emails.send({
    from,
    to: opts.email,
    subject: "Din STEP-leverans är på väg 📦",
    html: shippingNoticeHtml(opts),
  });
}
