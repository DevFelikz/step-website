import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY ?? "";
const resendConfigured =
  resendKey.startsWith("re_") && resendKey !== "re_REPLACE_ME" && resendKey.length > 10;

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = (await req.json()) as {
    name: string;
    email: string;
    subject: string;
    message: string;
  };

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Fyll i alla fält" }, { status: 400 });
  }

  const toEmail = process.env.RESEND_FROM_EMAIL ?? "support@step.se";

  if (resendConfigured) {
    const resend = new Resend(resendKey);
    await resend.emails.send({
      from: toEmail,
      to: toEmail,
      replyTo: email,
      subject: `[STEP kontakt] ${subject} — ${name}`,
      html: `<p><b>Från:</b> ${name} &lt;${email}&gt;</p><p><b>Ämne:</b> ${subject}</p><p>${message.replace(/\n/g, "<br>")}</p>`,
    });
  } else {
    // Dev mode — log to console
    console.log("[contact form]", { name, email, subject, message });
  }

  return NextResponse.json({ ok: true });
}
