/**
 * lib/api-response.ts
 * Helpers para respostas de API consistentes e tipadas.
 */
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function fail(message: string, status = 400, extra?: unknown) {
  return NextResponse.json(
    { success: false, error: message, details: extra },
    { status },
  );
}

/** Converte erros conhecidos (Zod, Error) em respostas HTTP adequadas. */
export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return fail("Dados inválidos.", 422, error.flatten().fieldErrors);
  }
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") return fail("Não autorizado.", 401);
    if (error.message === "FORBIDDEN") return fail("Acesso negado.", 403);
    if (error.message === "NOT_FOUND") return fail("Não encontrado.", 404);
    if (error.message === "SLUG_TAKEN")
      return fail("Esse slug já está em uso.", 409);
  }
  console.error("[API ERROR]", error);
  return fail("Erro interno do servidor.", 500);
}
