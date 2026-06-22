/**
 * app/layout.tsx
 * Layout raiz: fontes, metadata global (SEO/OG/Twitter), providers e o Toaster.
 */
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { getAppUrl } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const appUrl = getAppUrl();

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Linkly — Encurtador de Links",
    template: "%s · Linkly",
  },
  description:
    "Encurte URLs longas em links curtos e elegantes. QR Codes, estatísticas em tempo real e painel moderno.",
  keywords: ["encurtador de links", "url shortener", "qr code", "links curtos"],
  authors: [{ name: "Linkly" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: appUrl,
    siteName: "Linkly",
    title: "Linkly — Encurtador de Links",
    description:
      "Encurte URLs, gere QR Codes e acompanhe cliques em um painel moderno.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Linkly — Encurtador de Links",
    description: "Encurte URLs, gere QR Codes e acompanhe cliques.",
  },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg", apple: "/icon.svg" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <Providers>
          {children}
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
