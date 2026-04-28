import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/konto", "/api/", "/checkout/"],
      },
    ],
    sitemap: "https://step.se/sitemap.xml",
  };
}
