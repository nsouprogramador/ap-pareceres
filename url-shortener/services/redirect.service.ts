/**
 * services/redirect.service.ts
 * Lógica do fluxo de redirecionamento: localizar slug, validar (existe, ativo,
 * não expirado), registrar a estatística do clique e incrementar o contador.
 */
import { linkRepository } from "@/repositories/link.repository";
import { clickRepository } from "@/repositories/click.repository";
import { isExpired } from "@/types";
import type { ClickMeta } from "@/lib/request-info";

export type RedirectResult =
  | { status: "ok"; url: string }
  | { status: "not-found" }
  | { status: "inactive" }
  | { status: "expired" };

export const redirectService = {
  async resolve(slug: string, meta: ClickMeta): Promise<RedirectResult> {
    // 1 + 2. Localiza o slug e verifica existência.
    const link = await linkRepository.findBySlug(slug);
    if (!link) return { status: "not-found" };

    // 3. Verifica se está ativo.
    if (!link.active) return { status: "inactive" };

    // 4. Verifica expiração.
    if (isExpired(link.expirationDate)) return { status: "expired" };

    // 5 + 6. Registra estatística e incrementa contador.
    // Executado de forma resiliente: falha de telemetria não bloqueia o redirect.
    try {
      await Promise.all([
        clickRepository.create({
          linkId: link.id,
          ip: meta.ip,
          city: meta.city,
          country: meta.country,
          browser: meta.browser,
          os: meta.os,
          device: meta.device,
          referer: meta.referer,
          userAgent: meta.userAgent,
        }),
        linkRepository.incrementClicks(link.id),
      ]);
    } catch (err) {
      console.error("[redirect] falha ao registrar clique", err);
    }

    // 7. Retorna a URL de destino (o handler responde com 302).
    return { status: "ok", url: link.originalUrl };
  },
};
