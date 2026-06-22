/**
 * app/manifest.ts
 * Web App Manifest (PWA básica).
 */
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Linkly — Encurtador de Links",
    short_name: "Linkly",
    description: "Encurte URLs, gere QR Codes e acompanhe cliques.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e1a",
    theme_color: "#5b5bf0",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
