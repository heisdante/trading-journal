import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DisciplineAnalysis } from "@/components/discipline-analysis";
import { EquityCurve } from "@/components/equity-curve";
import { MetricCard } from "@/components/metric-card";
import { TradeTable } from "@/components/trade-table";
import { buildTradeMetrics, formatR } from "@/lib/trades/calculations";
import { getTrades } from "@/lib/trades/queries";
import { hasValidSupabaseEnv, supabaseEnvMessage } from "@/lib/supabase/env";

export default async function DashboardPage() {
  if (!hasValidSupabaseEnv()) {
    return (
      <AppShell>
        <div className="terminal-panel rounded-lg p-6 text-terminal-text">
          <p className="font-mono text-xs uppercase text-terminal-cyan">setup required</p>
          <h1 className="mt-2 text-2xl font-semibold">Connect Supabase to view the dashboard</h1>
          <p className="mt-3 text-sm text-terminal-muted">{supabaseEnvMessage()}</p>
        </div>
      </AppShell>
    );
  }

  const trades = await getTrades();
  const metrics = buildTradeMetrics(trades);

  return (
    <AppShell>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-terminal-cyan">dashboard / live stats</p>
          <h1 className="mt-2 text-3xl font-semibold text-terminal-text">Performance Command Center</h1>
        </div>
        <Link
          href="/log"
          className="inline-flex h-11 items-center justify-center gap-2 rounded bg-terminal-cyan px-4 font-semibold text-terminal-bg transition hover:bg-cyan-300"
        >
          <PlusCircle className="h-4 w-4" />
          Log trade
        </Link>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Win rate" value={`${metrics.winRate.toFixed(1)}%`} tone={metrics.winRate >= 50 ? "good" : "warn"} />
        <MetricCard label="Expectancy" value={formatR(metrics.expectancy)} tone={metrics.expectancy > 0 ? "good" : metrics.expectancy < 0 ? "bad" : "warn"} />
        <MetricCard label="Total R" value={formatR(metrics.totalR)} tone={metrics.totalR > 0 ? "good" : metrics.totalR < 0 ? "bad" : "warn"} />
        <MetricCard label="Max drawdown" value={formatR(-metrics.maxDrawdown)} tone={metrics.maxDrawdown > 0 ? "bad" : "default"} />
        <MetricCard label="Avg win" value={formatR(metrics.avgWin)} tone="good" />
        <MetricCard label="Avg loss" value={formatR(metrics.avgLoss)} tone="bad" />
        <MetricCard label="Criteria met" value={`${metrics.criteriaMetRate.toFixed(1)}%`} tone={metrics.criteriaMetRate >= 50 ? "good" : "warn"} />
        <MetricCard label="Broken criteria" value={`${metrics.brokenCriteriaRate.toFixed(1)}%`} tone={metrics.brokenCriteriaRate >= 50 ? "warn" : "bad"} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <EquityCurve data={metrics.equityCurve} />
        <DisciplineAnalysis criteriaMetRate={metrics.criteriaMetRate} brokenCriteriaRate={metrics.brokenCriteriaRate} />
      </section>

      <TradeTable trades={trades.slice(0, 8)} />
    </AppShell>
  );
}
