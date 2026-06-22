/**
 * components/dashboard/stats-cards.tsx
 * Cards de resumo do dashboard (totais e cliques por período).
 */
import { Link2, MousePointerClick, CalendarDays, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/utils/format";
import type { DashboardSummary } from "@/types";

export function StatsCards({ summary }: { summary: DashboardSummary }) {
  const cards = [
    { label: "Total de Links", value: summary.totalLinks, icon: Link2 },
    { label: "Total de Cliques", value: summary.totalClicks, icon: MousePointerClick },
    { label: "Cliques Hoje", value: summary.clicksToday, icon: CalendarDays },
    { label: "Cliques no Mês", value: summary.clicksThisMonth, icon: TrendingUp },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <p className="mt-1 text-3xl font-bold tabular-nums">
                {formatNumber(c.value)}
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <c.icon className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
