/**
 * tests/rate-limit.test.ts
 * Verifica a janela do rate limiter em memória.
 */
import { describe, it, expect } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  it("permite requisições até o limite", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(rateLimit(key, 5, 60_000).success).toBe(true);
    }
  });

  it("bloqueia após exceder o limite", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 3; i++) rateLimit(key, 3, 60_000);
    expect(rateLimit(key, 3, 60_000).success).toBe(false);
  });

  it("decrementa o contador de remaining", () => {
    const key = `test-${Math.random()}`;
    const first = rateLimit(key, 10, 60_000);
    const second = rateLimit(key, 10, 60_000);
    expect(second.remaining).toBeLessThan(first.remaining);
  });
});
