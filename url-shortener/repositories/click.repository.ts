/**
 * repositories/click.repository.ts
 * Acesso a dados de eventos de clique e agregações estatísticas.
 */
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const clickRepository = {
  create(data: Prisma.ClickUncheckedCreateInput) {
    return prisma.click.create({ data });
  },

  countByLinkIds(linkIds: string[], since?: Date) {
    return prisma.click.count({
      where: {
        linkId: { in: linkIds },
        ...(since ? { createdAt: { gte: since } } : {}),
      },
    });
  },

  /** Agrupa cliques por um campo categórico (browser, os, device, country...). */
  async groupByField(
    linkIds: string[],
    field: "browser" | "os" | "device" | "country" | "referer",
    limit = 8,
  ) {
    if (linkIds.length === 0) return [];
    const rows = await prisma.click.groupBy({
      by: [field],
      where: { linkId: { in: linkIds } },
      _count: { _all: true },
      orderBy: { _count: { [field]: "desc" } },
      take: limit,
    });
    return rows.map((r) => ({
      label: (r[field] as string | null) ?? "Desconhecido",
      value: r._count._all,
    }));
  },

  /** Retorna eventos brutos (data + ...) para montar a série temporal. */
  rawDatesByLinkIds(linkIds: string[], since: Date) {
    if (linkIds.length === 0) return Promise.resolve([]);
    return prisma.click.findMany({
      where: { linkId: { in: linkIds }, createdAt: { gte: since } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    });
  },
};
