/**
 * app/api/shorten/route.ts
 * POST — cria um link curto. Funciona para visitantes (link temporário) e para
 * usuários autenticados (link permanente vinculado à conta).
 */
import { createLinkSchema } from "@/lib/validations";
import { linkService } from "@/services/link.service";
import { auth } from "@/lib/auth";
import { ok, handleError } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const input = createLinkSchema.parse(body);
    const link = await linkService.createLink(input, session?.user?.id ?? null);
    return ok(link, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
