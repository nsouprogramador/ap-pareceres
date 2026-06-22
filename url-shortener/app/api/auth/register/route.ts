/**
 * app/api/auth/register/route.ts
 * POST — cadastro de novo usuário com validação Zod.
 */
import { registerSchema } from "@/lib/validations";
import { authService } from "@/services/auth.service";
import { ok, fail, handleError } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = registerSchema.parse(body);
    const user = await authService.register(input);
    return ok(user, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      return fail("Este e-mail já está cadastrado.", 409);
    }
    return handleError(error);
  }
}
