/**
 * app/dashboard/page.tsx
 * Visão geral (Server Component): busca as estatísticas agregadas diretamente
 * via service e renderiza cards + gráficos. Os gráficos client são montados
 * dentro de Suspense para streaming.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { statsService } from "@/services/stats.service";
import { Button } from "@/components/ui/button";
import { StatsCards } from "@/components/dashboard/stats-cards";
import {
  ClicksAreaChart,
  BreakdownChart,
  TopLinksCard,
} from "@/components/dashboard/charts";

export const metadata: Metadata = { title: "Visão geral" };

export default async function DashboardPage() {
  const user = await requireUser();
  const stats = await statsService.getDashboard(user.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Visão geral</h1>
          <p className="text-muted-foreground">
            Acompanhe o desempenho dos seus links.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/links">
            Gerenciar links <ArrowRight />
          </Link>
        </Button>
      </div>

      <StatsCards summary={stats.summary} />

      <div className="grid gap-4">
        <ClicksAreaChart data={stats.clicksByDay} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <TopLinksCard links={stats.topLinks} />
        <BreakdownChart title="Navegadores" data={stats.browsers} />
        <BreakdownChart title="Sistemas operacionais" data={stats.os} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BreakdownChart title="Dispositivos" data={stats.devices} />
        <BreakdownChart title="Países" data={stats.countries} />
      </div>
    </div>
  );
}
