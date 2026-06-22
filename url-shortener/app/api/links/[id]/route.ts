/**
 * app/api/links/[id]/route.ts
 * PUT — edita um link (URL, slug, ativo, expiração).
 * DELETE — remove um link. Ambos exigem ser dono do link.
 */
import { updateLinkSchema } from "@/lib/validations";
import { linkService } from "@/services/link.service";
import { requireUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/api-response";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const body = await req.json();
    const input = updateLinkSchema.parse(body);
    const link = await linkService.updateLink(id, input, user.id);
    return ok(link);
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    await linkService.deleteLink(id, user.id);
    return ok({ id });
  } catch (error) {
    return handleError(error);
  }
}
