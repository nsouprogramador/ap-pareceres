"use client";

/**
 * components/dashboard/links-manager.tsx
 * Orquestra busca/filtro/ordenação/paginação da lista de links e a tabela.
 * Inclui a criação rápida de novos links no topo.
 */
import * as React from "react";
import { Plus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LinksTable } from "@/components/dashboard/links-table";
import { useLinks, type StatusFilter, type SortOption } from "@/hooks/use-links";
import { useDebounce } from "@/hooks/use-debounce";
import { apiClient } from "@/lib/api-client";
import { createLinkSchema } from "@/lib/validations";
import type { LinkDTO } from "@/types";

export function LinksManager() {
  const [searchInput, setSearchInput] = React.useState("");
  const search = useDebounce(searchInput, 400);
  const [status, setStatus] = React.useState<StatusFilter>("all");
  const [sort, setSort] = React.useState<SortOption>("recent");
  const [page, setPage] = React.useState(1);

  const [newUrl, setNewUrl] = React.useState("");
  const [creating, setCreating] = React.useState(false);

  const { data, loading, error, refetch, updateLink, deleteLink, toggleActive } =
    useLinks({ search, status, sort, page });

  React.useEffect(() => setPage(1), [search, status, sort]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const parsed = createLinkSchema.safeParse({ originalUrl: newUrl });
    if (!parsed.success) {
      toast.error(parsed.error.flatten().fieldErrors.originalUrl?.[0] ?? "URL inválida.");
      return;
    }
    setCreating(true);
    try {
      await apiClient.post<LinkDTO>("/api/shorten", parsed.data);
      toast.success("Link criado!");
      setNewUrl("");
      await refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar link.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Criação rápida */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleCreate} className="flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Cole uma URL para encurtar..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={creating}>
              {creating ? <Loader2 className="animate-spin" /> : <Plus />}
              Criar link
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Filtros */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por slug ou URL..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
            <SelectItem value="expired">Expirados</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Mais recentes</SelectItem>
            <SelectItem value="oldest">Mais antigos</SelectItem>
            <SelectItem value="most-clicked">Mais clicados</SelectItem>
            <SelectItem value="least-clicked">Menos clicados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conteúdo */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="p-8 text-center text-destructive">{error}</CardContent>
        </Card>
      ) : data && data.items.length > 0 ? (
        <>
          <LinksTable
            links={data.items}
            onUpdate={updateLink}
            onDelete={deleteLink}
            onToggle={toggleActive}
          />
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Página {data.page} de {data.totalPages} · {data.total} links
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            Nenhum link encontrado. Crie o primeiro acima! 🚀
          </CardContent>
        </Card>
      )}
    </div>
  );
}
