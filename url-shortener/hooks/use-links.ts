"use client";

/**
 * hooks/use-links.ts
 * Encapsula o estado e as operações CRUD da lista de links do dashboard
 * (busca, filtro, ordenação, paginação, editar, excluir, ativar/desativar).
 */
import { useCallback, useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { LinkDTO, Paginated } from "@/types";
import type { UpdateLinkInput } from "@/lib/validations";

export type StatusFilter = "all" | "active" | "inactive" | "expired";
export type SortOption = "recent" | "oldest" | "most-clicked" | "least-clicked";

interface UseLinksParams {
  search: string;
  status: StatusFilter;
  sort: SortOption;
  page: number;
  pageSize?: number;
}

export function useLinks({
  search,
  status,
  sort,
  page,
  pageSize = 10,
}: UseLinksParams) {
  const [data, setData] = useState<Paginated<LinkDTO> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        search,
        status,
        sort,
        page: String(page),
        pageSize: String(pageSize),
      });
      const result = await apiClient.get<Paginated<LinkDTO>>(
        `/api/links?${params.toString()}`,
      );
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar links.");
    } finally {
      setLoading(false);
    }
  }, [search, status, sort, page, pageSize]);

  useEffect(() => {
    void fetchLinks();
  }, [fetchLinks]);

  const updateLink = useCallback(
    async (id: string, input: UpdateLinkInput) => {
      const updated = await apiClient.put<LinkDTO>(`/api/links/${id}`, input);
      await fetchLinks();
      return updated;
    },
    [fetchLinks],
  );

  const deleteLink = useCallback(
    async (id: string) => {
      await apiClient.delete(`/api/links/${id}`);
      await fetchLinks();
    },
    [fetchLinks],
  );

  const toggleActive = useCallback(
    async (link: LinkDTO) => {
      await apiClient.put<LinkDTO>(`/api/links/${link.id}`, {
        active: !link.active,
      });
      await fetchLinks();
    },
    [fetchLinks],
  );

  return {
    data,
    loading,
    error,
    refetch: fetchLinks,
    updateLink,
    deleteLink,
    toggleActive,
  };
}
