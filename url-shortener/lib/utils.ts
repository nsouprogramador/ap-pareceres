/**
 * lib/utils.ts
 * Utilitário `cn` (merge de classes Tailwind) usado por todos os componentes
 * shadcn/ui, além de helpers genéricos de URL.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** URL pública da aplicação (sem barra final). */
export function getAppUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXTAUTH_URL ??
    "http://localhost:3000";
  return url.replace(/\/+$/, "");
}

/** Monta o link curto completo a partir de um slug. */
export function buildShortUrl(slug: string): string {
  return `${getAppUrl()}/${slug}`;
}
