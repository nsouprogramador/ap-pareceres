/**
 * app/api/stats/[id]/route.ts
 * GET — estatísticas detalhadas de um link específico do usuário.
 */
import { statsService } from "@/services/stats.service";
import { requireUser } from "@/lib/auth";
import { ok, handleError } from "@/lib/api-response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const stats = await statsService.getLinkStats(id, user.id);
    return ok(stats);
  } catch (error) {
    return handleError(error);
  }
}
