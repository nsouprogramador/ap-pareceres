/**
 * repositories/link.repository.ts
 * Camada de acesso a dados para Links. Isola toda interação com o Prisma,
 * permitindo que os Services não conheçam detalhes de persistência (SOLID/DIP).
 */
import { prisma } from "@/lib/prisma";
import type { Link, Prisma } from "@prisma/client";

export type LinkSort =
  | "recent"
  | "oldest"
  | "most-clicked"
  | "least-clicked";

export type LinkStatusFilter = "all" | "active" | "inactive" | "expired";

interface FindManyOptions {
  userId: string;
  search?: string;
  status: LinkStatusFilter;
  sort: LinkSort;
  page: number;
  pageSize: number;
}

function buildWhere(
  userId: string,
  search?: string,
  status: LinkStatusFilter = "all",
): Prisma.LinkWhereInput {
  const where: Prisma.LinkWhereInput = { userId };

  if (search) {
    where.OR = [
      { slug: { contains: search, mode: "insensitive" } },
      { originalUrl: { contains: search, mode: "insensitive" } },
    ];
  }

  const now = new Date();
  if (status === "active") {
    where.active = true;
    where.OR = [{ expirationDate: null }, { expirationDate: { gt: now } }];
  } else if (status === "inactive") {
    where.active = false;
  } else if (status === "expired") {
    where.expirationDate = { lt: now };
  }

  return where;
}

function buildOrderBy(sort: LinkSort): Prisma.LinkOrderByWithRelationInput {
  switch (sort) {
    case "oldest":
      return { createdAt: "asc" };
    case "most-clicked":
      return { clicks: "desc" };
    case "least-clicked":
      return { clicks: "asc" };
    case "recent":
    default:
      return { createdAt: "desc" };
  }
}

export const linkRepository = {
  findBySlug(slug: string) {
    return prisma.link.findUnique({ where: { slug } });
  },

  findById(id: string) {
    return prisma.link.findUnique({ where: { id } });
  },

  async slugExists(slug: string): Promise<boolean> {
    const count = await prisma.link.count({ where: { slug } });
    return count > 0;
  },

  create(data: Prisma.LinkUncheckedCreateInput): Promise<Link> {
    return prisma.link.create({ data });
  },

  update(id: string, data: Prisma.LinkUncheckedUpdateInput): Promise<Link> {
    return prisma.link.update({ where: { id }, data });
  },

  delete(id: string): Promise<Link> {
    return prisma.link.delete({ where: { id } });
  },

  incrementClicks(id: string) {
    return prisma.link.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });
  },

  async findManyByUser(opts: FindManyOptions) {
    const where = buildWhere(opts.userId, opts.search, opts.status);
    const [items, total] = await Promise.all([
      prisma.link.findMany({
        where,
        orderBy: buildOrderBy(opts.sort),
        skip: (opts.page - 1) * opts.pageSize,
        take: opts.pageSize,
      }),
      prisma.link.count({ where }),
    ]);
    return { items, total };
  },

  countByUser(userId: string) {
    return prisma.link.count({ where: { userId } });
  },

  /** Soma de cliques de todos os links do usuário (campo desnormalizado). */
  async sumClicksByUser(userId: string): Promise<number> {
    const result = await prisma.link.aggregate({
      where: { userId },
      _sum: { clicks: true },
    });
    return result._sum.clicks ?? 0;
  },
};
