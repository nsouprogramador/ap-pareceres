/**
 * services/stats.service.ts
 * Agregações para o dashboard e para a página de estatísticas de um link.
 */
import { linkRepository } from "@/repositories/link.repository";
import { clickRepository } from "@/repositories/click.repository";
import { prisma } from "@/lib/prisma";
import { getAppUrl } from "@/lib/utils";
import { toLinkDTO } from "@/types";
import { startOfToday, startOfMonth, daysAgo, buildDailySeries } from "@/utils/date";
import type { DashboardStats, LinkStats } from "@/types";

export const statsService = {
  /** Visão consolidada do dashboard de um usuário. */
  async getDashboard(userId: string): Promise<DashboardStats> {
    const links = await prisma.link.findMany({
      where: { userId },
      select: { id: true, slug: true, originalUrl: true, clicks: true },
    });
    const linkIds = links.map((l) => l.id);

    const [totalClicks, clicksToday, clicksThisMonth, rawDates] =
      await Promise.all([
        clickRepository.countByLinkIds(linkIds),
        clickRepository.countByLinkIds(linkIds, startOfToday()),
        clickRepository.countByLinkIds(linkIds, startOfMonth()),
        clickRepository.rawDatesByLinkIds(linkIds, daysAgo(29)),
      ]);

    const [browsers, os, devices, countries] = await Promise.all([
      clickRepository.groupByField(linkIds, "browser"),
      clickRepository.groupByField(linkIds, "os"),
      clickRepository.groupByField(linkIds, "device"),
      clickRepository.groupByField(linkIds, "country"),
    ]);

    const topLinks = [...links]
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 5)
      .map((l) => ({
        id: l.id,
        slug: l.slug,
        originalUrl: l.originalUrl,
        clicks: l.clicks,
      }));

    return {
      summary: {
        totalLinks: links.length,
        totalClicks,
        clicksToday,
        clicksThisMonth,
      },
      clicksByDay: buildDailySeries(rawDates, 30),
      topLinks,
      browsers,
      os,
      devices,
      countries,
    };
  },

  /** Estatísticas detalhadas de um único link (com checagem de dono). */
  async getLinkStats(linkId: string, userId: string): Promise<LinkStats> {
    const link = await linkRepository.findById(linkId);
    if (!link) throw new Error("NOT_FOUND");
    if (link.userId !== userId) throw new Error("FORBIDDEN");

    const ids = [link.id];
    const [totalClicks, rawDates, browsers, os, devices, countries, referers] =
      await Promise.all([
        clickRepository.countByLinkIds(ids),
        clickRepository.rawDatesByLinkIds(ids, daysAgo(29)),
        clickRepository.groupByField(ids, "browser"),
        clickRepository.groupByField(ids, "os"),
        clickRepository.groupByField(ids, "device"),
        clickRepository.groupByField(ids, "country"),
        clickRepository.groupByField(ids, "referer"),
      ]);

    return {
      link: toLinkDTO(link, getAppUrl()),
      totalClicks,
      clicksByDay: buildDailySeries(rawDates, 30),
      browsers,
      os,
      devices,
      countries,
      referers,
    };
  },
};
