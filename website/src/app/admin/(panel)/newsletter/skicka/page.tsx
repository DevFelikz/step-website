import { prisma } from "@/lib/db";
import { NewsletterComposer } from "./NewsletterComposer";

export const metadata = { title: "Skicka nyhetsbrev — Admin" };

export default async function SendNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, createdAt: true },
  });

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <a
          href="/admin/newsletter"
          className="text-step-muted transition hover:text-white"
        >
          ← Nyhetsbrev
        </a>
        <span className="text-step-border">/</span>
        <h1 className="text-2xl font-bold text-white">Skicka nyhetsbrev</h1>
      </div>

      {subscribers.length === 0 ? (
        <div className="rounded-lg border border-step-border bg-step-surface px-6 py-10 text-center">
          <p className="text-step-muted">Inga prenumeranter ännu — nyhetsbrevet kan inte skickas.</p>
        </div>
      ) : (
        <NewsletterComposer subscribers={subscribers} />
      )}
    </div>
  );
}
