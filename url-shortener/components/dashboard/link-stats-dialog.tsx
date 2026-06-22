"use client";

/**
 * components/dashboard/link-stats-dialog.tsx
 * Modal com as estatísticas detalhadas de um único link (consome /api/stats/:id).
 */
import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ClicksAreaChart,
  BreakdownChart,
} from "@/components/dashboard/charts";
import { apiClient } from "@/lib/api-client";
import { formatNumber } from "@/utils/format";
import type { LinkDTO, LinkStats } from "@/types";

interface Props {
  link: LinkDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LinkStatsDialog({ link, open, onOpenChange }: Props) {
  const [stats, setStats] = React.useState<LinkStats | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    apiClient
      .get<LinkStats>(`/api/stats/${link.id}`)
      .then(setStats)
      .catch((e) => setError(e instanceof Error ? e.message : "Erro."))
      .finally(() => setLoading(false));
  }, [open, link.id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Estatísticas · /{link.slug}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="py-8 text-center text-destructive">{error}</p>
        ) : stats ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="text-sm text-muted-foreground">Total de cliques</p>
              <p className="text-3xl font-bold">{formatNumber(stats.totalClicks)}</p>
            </div>
            <ClicksAreaChart data={stats.clicksByDay} />
            <div className="grid gap-4 sm:grid-cols-2">
              <BreakdownChart title="Navegadores" data={stats.browsers} />
              <BreakdownChart title="Sistemas operacionais" data={stats.os} />
              <BreakdownChart title="Dispositivos" data={stats.devices} />
              <BreakdownChart title="Países" data={stats.countries} />
              <BreakdownChart title="Referências" data={stats.referers} />
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
