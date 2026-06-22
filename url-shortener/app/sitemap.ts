/**
 * app/sitemap.ts
 * Gera /sitemap.xml com as páginas públicas.
 */
import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = getAppUrl();
  const now = new Date();
  return [
    { url: `${url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${url}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${url}/register`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];
}
