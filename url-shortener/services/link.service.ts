/**
 * services/link.service.ts
 * Regras de negócio de criação/edição/listagem de links. Orquestra o
 * repositório, validações de slug e geração de slug único.
 */
import { linkRepository } from "@/repositories/link.repository";
import { generateSlug } from "@/lib/nanoid";
import { RESERVED_SLUGS } from "@/lib/validations";
import { getAppUrl } from "@/lib/utils";
import { toLinkDTO, type LinkDTO, type Paginated } from "@/types";
import type {
  CreateLinkInput,
  ListLinksQuery,
  UpdateLinkInput,
} from "@/lib/validations";

/** Gera um slug aleatório garantidamente livre (com algumas tentativas). */
async function generateUniqueSlug(): Promise<string> {
  for (let attempt = 0; attempt < 6; attempt++) {
    const slug = generateSlug();
    if (!(await linkRepository.slugExists(slug))) return slug;
  }
  // Fallback: aumenta o comprimento para reduzir colisões.
  return generateSlug(10);
}

async function assertSlugAvailable(slug: string, ignoreId?: string) {
  if (RESERVED_SLUGS.has(slug.toLowerCase())) throw new Error("SLUG_TAKEN");
  const existing = await linkRepository.findBySlug(slug);
  if (existing && existing.id !== ignoreId) throw new Error("SLUG_TAKEN");
}

export const linkService = {
  /** Cria um link. `userId` nulo = link anônimo/temporário. */
  async createLink(
    input: CreateLinkInput,
    userId: string | null,
  ): Promise<LinkDTO> {
    let slug = input.slug?.trim();
    if (slug) {
      await assertSlugAvailable(slug);
    } else {
      slug = await generateUniqueSlug();
    }

    // Links anônimos expiram automaticamente em 7 dias se nada for definido.
    let expirationDate: Date | null = input.expirationDate
      ? new Date(input.expirationDate)
      : null;
    if (!userId && !expirationDate) {
      expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    const link = await linkRepository.create({
      slug,
      originalUrl: input.originalUrl,
      userId: userId ?? null,
      expirationDate,
    });

    return toLinkDTO(link, getAppUrl());
  },

  async updateLink(
    id: string,
    input: UpdateLinkInput,
    userId: string,
  ): Promise<LinkDTO> {
    const link = await linkRepository.findById(id);
    if (!link) throw new Error("NOT_FOUND");
    if (link.userId !== userId) throw new Error("FORBIDDEN");

    if (input.slug && input.slug !== link.slug) {
      await assertSlugAvailable(input.slug, id);
    }

    const updated = await linkRepository.update(id, {
      originalUrl: input.originalUrl ?? undefined,
      slug: input.slug ?? undefined,
      active: input.active ?? undefined,
      expirationDate:
        input.expirationDate === undefined
          ? undefined
          : input.expirationDate === null
            ? null
            : new Date(input.expirationDate),
    });

    return toLinkDTO(updated, getAppUrl());
  },

  async deleteLink(id: string, userId: string): Promise<void> {
    const link = await linkRepository.findById(id);
    if (!link) throw new Error("NOT_FOUND");
    if (link.userId !== userId) throw new Error("FORBIDDEN");
    await linkRepository.delete(id);
  },

  async listLinks(
    query: ListLinksQuery,
    userId: string,
  ): Promise<Paginated<LinkDTO>> {
    const { items, total } = await linkRepository.findManyByUser({
      userId,
      search: query.search,
      status: query.status,
      sort: query.sort,
      page: query.page,
      pageSize: query.pageSize,
    });

    const appUrl = getAppUrl();
    return {
      items: items.map((l) => toLinkDTO(l, appUrl)),
      total,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.max(1, Math.ceil(total / query.pageSize)),
    };
  },
};
