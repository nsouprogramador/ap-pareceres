/**
 * app/api/links/route.ts
 * GET — lista paginada/filtrada/ordenada dos links do usuário autenticado.
 */
import { listLinksQuerySchema } from "@/lib/validations";
import { linkService } from "@/services/link.service";
import { requireUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/api-response";

export async function GET(req: Request) {
  try {
    const user = await requireUser();
    const { searchParams } = new URL(req.url);
    const query = listLinksQuerySchema.parse(
      Object.fromEntries(searchParams.entries()),
    );
    const result = await linkService.listLinks(query, user.id);
    return ok(result);
  } catch (error) {
    return handleError(error);
  }
}
