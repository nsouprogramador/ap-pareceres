/**
 * lib/prisma.ts
 * Instância singleton do PrismaClient. Em desenvolvimento o Next.js recarrega
 * os módulos a cada alteração; reutilizar a instância evita esgotar o pool de
 * conexões do PostgreSQL ("too many connections").
 */
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
