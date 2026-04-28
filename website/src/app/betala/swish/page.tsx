import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getSwishConfig } from "@/lib/paymentConfig";
import { createSwishPayment, swishDeeplink } from "@/lib/swish";
import { SiteShell } from "@/components/site/SiteShell";
import { SwishPayPage } from "./SwishPayPage";

export default async function SwishPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  if (!orderId) redirect("/shop");

  const session = await auth();
  if (!session?.user?.id) redirect(`/auth/logga-in?callbackUrl=/betala/swish?orderId=${orderId}`);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { subscription: { include: { plan: true } } },
  });

  if (!order || order.userId !== session.user.id) redirect("/shop");

  // Already paid — go straight to confirmation
  if (order.status === "PAID") {
    redirect(`/checkout/${order.subscription?.planId}/bekraftelse?orderId=${orderId}`);
  }

  const cfg = await getSwishConfig();
  if (!cfg) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-md py-20 text-center">
          <p className="text-xl font-bold text-white">Swish är inte konfigurerat</p>
          <p className="mt-2 text-sm text-step-muted">
            Kontakta support eller välj en annan betalningsmetod.
          </p>
        </div>
      </SiteShell>
    );
  }

  // Create Swish payment request (server side so we have cert access)
  let requestId = order.swishPaymentRequestId ?? "";
  let token = "";

  if (!requestId) {
    const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://step.se";
    const callbackUrl = `${origin}/api/payments/swish/callback`;

    const result = await createSwishPayment(cfg, {
      payeeAlias: cfg.merchantAlias,
      amount: order.totalAmountOre / 100,
      currency: "SEK",
      callbackUrl,
      message: `STEP ${order.subscription?.plan?.name ?? "prenumeration"}`.slice(0, 50),
    });

    requestId = result.id;
    token = result.token ?? "";

    await prisma.order.update({
      where: { id: orderId },
      data: { swishPaymentRequestId: requestId },
    });
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://step.se";
  const deeplink = token
    ? swishDeeplink(token, `${origin}/betala/swish?orderId=${orderId}`)
    : null;

  return (
    <SiteShell>
      <SwishPayPage
        orderId={orderId}
        planId={order.subscription?.planId ?? ""}
        amountKr={Math.round(order.totalAmountOre / 100)}
        deeplink={deeplink}
        requestId={requestId}
      />
    </SiteShell>
  );
}
