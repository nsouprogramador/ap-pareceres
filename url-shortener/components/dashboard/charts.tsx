"use client";

/**
 * components/dashboard/charts.tsx
 * Gráficos do dashboard com Recharts (client components): série de cliques por
 * dia, barras horizontais para breakdowns e ranking de top links.
 */
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, prettyUrl } from "@/utils/format";
import type { BreakdownPoint, TimeSeriesPoint, TopLink } from "@/types";

const PALETTE = ["#5b5bf0", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#ef4444", "#64748b"];

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  );
}

export function ClicksAreaChart({ data }: { data: TimeSeriesPoint[] }) {
  const hasData = data.some((d) => d.clicks > 0);
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Cliques por dia (últimos 30 dias)</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <EmptyState label="Sem cliques registrados ainda." />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="clicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b5bf0" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#5b5bf0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(v: string) => v.slice(5)}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }}
                labelFormatter={(v) => `Data: ${v}`}
                formatter={(v: number) => [formatNumber(v), "Cliques"]}
              />
              <Area type="monotone" dataKey="clicks" stroke="#5b5bf0" strokeWidth={2} fill="url(#clicks)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function BreakdownChart({
  title,
  data,
}: {
  title: string;
  data: BreakdownPoint[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState label="Sem dados." />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
              <XAxis type="number" hide allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="label"
                width={90}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                contentStyle={{ borderRadius: 8, border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }}
                formatter={(v: number) => [formatNumber(v), "Cliques"]}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function TopLinksCard({ links }: { links: TopLink[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top links</CardTitle>
      </CardHeader>
      <CardContent>
        {links.length === 0 ? (
          <EmptyState label="Nenhum link ainda." />
        ) : (
          <ul className="space-y-3">
            {links.map((link, i) => (
              <li key={link.id} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">/{link.slug}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {prettyUrl(link.originalUrl, 40)}
                  </p>
                </div>
                <span className="text-sm font-semibold tabular-nums">
                  {formatNumber(link.clicks)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
