/**
 * app/[slug]/route.ts
 * GET /:slug — Resolve o slug e redireciona (HTTP 302) para a URL de destino,
 * registrando a estatística do clique. Páginas de erro amigáveis para slug
 * inexistente, inativo ou expirado.
 */
import { redirectService } from "@/services/redirect.service";
import { extractClickMeta } from "@/lib/request-info";
import { getAppUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const meta = extractClickMeta(req);
  const result = await redirectService.resolve(slug, meta);

  if (result.status === "ok") {
    return new Response(null, {
      status: 302,
      headers: { Location: result.url, "Cache-Control": "no-store" },
    });
  }

  // Redireciona para uma página de status amigável na home.
  const reason =
    result.status === "not-found"
      ? "nao-encontrado"
      : result.status === "inactive"
        ? "inativo"
        : "expirado";

  return new Response(null, {
    status: 302,
    headers: {
      Location: `${getAppUrl()}/?status=${reason}&slug=${encodeURIComponent(slug)}`,
      "Cache-Control": "no-store",
    },
  });
}
