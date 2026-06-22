/**
 * utils/format.ts
 * Formatação de exibição (datas, números) no padrão pt-BR.
 */

const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const dateTimeFmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const numberFmt = new Intl.NumberFormat("pt-BR");

export function formatDate(date: string | Date | null): string {
  if (!date) return "—";
  return dateFmt.format(new Date(date));
}

export function formatDateTime(date: string | Date | null): string {
  if (!date) return "—";
  return dateTimeFmt.format(new Date(date));
}

export function formatNumber(value: number): string {
  return numberFmt.format(value);
}

/** Encurta uma URL longa para exibição (ex.: example.com/path...). */
export function prettyUrl(url: string, max = 48): string {
  try {
    const u = new URL(url);
    const display = `${u.hostname}${u.pathname}`.replace(/\/$/, "");
    return display.length > max ? `${display.slice(0, max)}…` : display;
  } catch {
    return url.length > max ? `${url.slice(0, max)}…` : url;
  }
}
