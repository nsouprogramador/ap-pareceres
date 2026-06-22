/**
 * tests/date.test.ts
 * Testa a construção da série temporal de cliques (preenchimento de zeros).
 */
import { describe, it, expect } from "vitest";
import { buildDailySeries } from "@/utils/date";

describe("buildDailySeries", () => {
  it("retorna uma série contínua dos N dias", () => {
    const series = buildDailySeries([], 7);
    expect(series).toHaveLength(7);
    expect(series.every((p) => p.clicks === 0)).toBe(true);
  });

  it("agrega cliques no dia correto", () => {
    const today = new Date();
    const series = buildDailySeries(
      [{ createdAt: today }, { createdAt: today }],
      7,
    );
    const last = series[series.length - 1];
    expect(last.clicks).toBe(2);
  });

  it("ordena do mais antigo para o mais recente", () => {
    const series = buildDailySeries([], 5);
    const dates = series.map((p) => p.date);
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
  });
});
