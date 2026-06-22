/**
 * utils/date.ts
 * Helpers de data sem dependências externas (formatação BR e séries temporais).
 */

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startOfMonth(): Date {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function daysAgo(days: number): Date {
  const d = startOfToday();
  d.setDate(d.getDate() - days);
  return d;
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Constrói uma série temporal contínua dos últimos N dias a partir de uma lista
 * de datas de eventos, preenchendo com zero os dias sem cliques.
 */
export function buildDailySeries(
  dates: { createdAt: Date }[],
  days: number,
): { date: string; clicks: number }[] {
  const counts = new Map<string, number>();
  for (const { createdAt } of dates) {
    const key = toISODate(new Date(createdAt));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const series: { date: string; clicks: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const key = toISODate(daysAgo(i));
    series.push({ date: key, clicks: counts.get(key) ?? 0 });
  }
  return series;
}
