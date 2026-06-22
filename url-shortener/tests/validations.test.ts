/**
 * tests/validations.test.ts
 * Testes dos schemas Zod: normalização de URL, slugs reservados e regras.
 */
import { describe, it, expect } from "vitest";
import { urlSchema, slugSchema, createLinkSchema } from "@/lib/validations";

describe("urlSchema", () => {
  it("adiciona https:// quando o protocolo é omitido", () => {
    expect(urlSchema.parse("example.com")).toBe("https://example.com");
  });

  it("mantém URLs já válidas", () => {
    expect(urlSchema.parse("http://example.com/path")).toBe(
      "http://example.com/path",
    );
  });

  it("rejeita esquemas perigosos", () => {
    expect(urlSchema.safeParse("javascript:alert(1)").success).toBe(false);
  });

  it("rejeita domínios sem ponto", () => {
    expect(urlSchema.safeParse("localhost").success).toBe(false);
  });
});

describe("slugSchema", () => {
  it("aceita slugs válidos", () => {
    expect(slugSchema.parse("meu-link_1")).toBe("meu-link_1");
  });

  it("rejeita caracteres inválidos", () => {
    expect(slugSchema.safeParse("com espaço").success).toBe(false);
  });

  it("rejeita slugs reservados", () => {
    expect(slugSchema.safeParse("api").success).toBe(false);
    expect(slugSchema.safeParse("dashboard").success).toBe(false);
  });

  it("rejeita slugs muito curtos", () => {
    expect(slugSchema.safeParse("ab").success).toBe(false);
  });
});

describe("createLinkSchema", () => {
  it("aceita payload mínimo válido", () => {
    const result = createLinkSchema.safeParse({ originalUrl: "vercel.com" });
    expect(result.success).toBe(true);
  });
});
