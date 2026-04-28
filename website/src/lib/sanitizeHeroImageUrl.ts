/**
 * Hero-bakgrund: https-URL, eller lokal sökväg från webbrot (/images/...).
 */
export function sanitizeHeroImageUrl(input: string): string | null {
  const t = input.trim();
  if (!t) return null;

  if (t.startsWith("/")) {
    if (t.includes("..") || t.includes("//") || t.includes("\n") || t.includes("\0")) return null;
    // tillåt /images/uploads/<uuid>.jpg m.m. — håll mönstret restriktivt
    if (!/^\/[A-Za-z0-9_./?=&%-]+$/.test(t)) return null;
    return t;
  }

  let url: URL;
  try {
    url = new URL(t);
  } catch {
    return null;
  }
  const ok =
    url.protocol === "https:" ||
    (process.env.NODE_ENV !== "production" && url.protocol === "http:");
  if (!ok) return null;
  if (url.username || url.password) return null;
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local")) {
    return url.toString();
  }
  if (url.protocol === "http:") return null;
  return url.toString();
}
