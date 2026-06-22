/**
 * tests/nanoid.test.ts
 * Garante que slugs gerados têm o tamanho esperado, alfabeto seguro e são únicos.
 */
import { describe, it, expect } from "vitest";
import { generateSlug, DEFAULT_SLUG_LENGTH } from "@/lib/nanoid";

describe("generateSlug", () => {
  it("usa o tamanho padrão", () => {
    expect(generateSlug()).toHaveLength(DEFAULT_SLUG_LENGTH);
  });

  it("respeita um tamanho customizado", () => {
    expect(generateSlug(12)).toHaveLength(12);
  });

  it("não usa caracteres ambíguos (0, O, 1, l, I)", () => {
    const slug = generateSlug(200);
    expect(/[0O1lI]/.test(slug)).toBe(false);
  });

  it("gera valores diferentes (sem colisão trivial)", () => {
    const set = new Set(Array.from({ length: 1000 }, () => generateSlug()));
    expect(set.size).toBe(1000);
  });
});
