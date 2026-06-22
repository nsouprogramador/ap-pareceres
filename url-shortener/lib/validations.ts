/**
 * lib/validations.ts
 * Schemas Zod centralizados. Toda entrada de API/formulário passa por aqui,
 * garantindo validação, sanitização e proteção contra payloads maliciosos.
 */
import { z } from "zod";

// Slugs reservados que não podem ser usados como link curto.
export const RESERVED_SLUGS = new Set([
  "api",
  "dashboard",
  "login",
  "register",
  "admin",
  "settings",
  "stats",
  "_next",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "manifest.webmanifest",
]);

const SLUG_REGEX = /^[a-zA-Z0-9-_]+$/;

/** Valida e normaliza uma URL de destino. Bloqueia esquemas perigosos. */
export const urlSchema = z
  .string({ required_error: "Informe uma URL." })
  .trim()
  .min(1, "Informe uma URL.")
  .max(2048, "URL muito longa (máx. 2048 caracteres).")
  .transform((val) => (/^https?:\/\//i.test(val) ? val : `https://${val}`))
  .refine((val) => {
    try {
      const u = new URL(val);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }, "URL inválida. Use http:// ou https://")
  .refine((val) => {
    try {
      const host = new URL(val).hostname;
      // Exige um host com ponto (evita "localhost"/hosts internos óbvios).
      return host.includes(".") && !host.endsWith(".local");
    } catch {
      return false;
    }
  }, "Domínio inválido.");

export const slugSchema = z
  .string()
  .trim()
  .min(3, "O slug deve ter ao menos 3 caracteres.")
  .max(40, "O slug deve ter no máximo 40 caracteres.")
  .regex(SLUG_REGEX, "Use apenas letras, números, hífen e underline.")
  .refine((s) => !RESERVED_SLUGS.has(s.toLowerCase()), "Esse slug é reservado.");

/** Body do POST /api/shorten. */
export const createLinkSchema = z.object({
  originalUrl: urlSchema,
  slug: slugSchema.optional(),
  expirationDate: z
    .string()
    .datetime({ offset: true })
    .or(z.string().datetime())
    .optional()
    .nullable(),
});

/** Body do PUT /api/links/:id. */
export const updateLinkSchema = z
  .object({
    originalUrl: urlSchema.optional(),
    slug: slugSchema.optional(),
    active: z.boolean().optional(),
    expirationDate: z.string().datetime().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, "Nenhum campo para atualizar.");

/** Filtros/paginação do GET /api/links. */
export const listLinksQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  status: z.enum(["all", "active", "inactive", "expired"]).default("all"),
  sort: z
    .enum(["recent", "oldest", "most-clicked", "least-clicked"])
    .default("recent"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome.").max(80),
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  password: z
    .string()
    .min(8, "A senha deve ter ao menos 8 caracteres.")
    .max(72, "Senha muito longa."),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  password: z.string().min(1, "Informe a senha."),
});

export type CreateLinkInput = z.infer<typeof createLinkSchema>;
export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;
export type ListLinksQuery = z.infer<typeof listLinksQuerySchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
