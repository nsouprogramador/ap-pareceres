/**
 * app/robots.ts
 * Gera /robots.txt dinamicamente.
 */
import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const url = getAppUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard"],
    },
    sitemap: `${url}/sitemap.xml`,
  };
}
