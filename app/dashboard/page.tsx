import Link from "next/link";
import { ArrowUpRight, PlusCircle } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DisciplineAnalysis } from "@/components/discipline-analysis";
import { EquityCurve } from "@/components/equity-curve";
import { MetricCard } from "@/components/metric-card";
import { TradeTable } from "@/components/trade-table";
import { SeriesAnalytics } from "@/components/series-analytics";
import { DailyReviewReminder } from "@/components/daily-review-reminder";
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
  const supabase = (await import("@/lib/supabase/server")).createClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data: todayReview } = await supabase.from("daily_reviews").select("id").eq("review_date", today).maybeSingle();

  return (
    <AppShell>
      <section className="terminal-panel app-page-heading flex flex-col gap-5 rounded-lg p-5 sm:p-6 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="font-mono text-xs uppercase text-terminal-cyan">dashboard / live statistics</p><h1 className="mt-2 text-3xl font-semibold text-terminal-text sm:text-4xl">Performance command center</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-terminal-muted">Your current decision record, discipline signals, and trade outcomes in one place.</p></div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center"><div className="border-l-2 border-terminal-green pl-3 text-sm"><p className="font-mono text-xs text-terminal-muted">TRADE RECORD</p><p className="mt-1 font-semibold text-terminal-text">{metrics.totalTrades} logged trade{metrics.totalTrades === 1 ? "" : "s"}</p></div><Link href="/log" className="inline-flex h-11 items-center justify-center gap-2 bg-terminal-cyan px-4 font-semibold text-terminal-bg transition hover:bg-cyan-300"><PlusCircle className="h-4 w-4" />Log trade</Link></div>
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
        <MetricCard label="Avg R:R" value={`${metrics.averageRiskReward.toFixed(2)}:1`} tone={metrics.averageRiskReward >= 2 ? "good" : "warn"} />
        <MetricCard label="Discipline score" value={`${metrics.disciplineScore.toFixed(0)}/100`} tone={metrics.disciplineScore >= 75 ? "good" : metrics.disciplineScore >= 50 ? "warn" : "bad"} />
        <MetricCard label="Rule warnings" value={`${metrics.ruleWarningRate.toFixed(1)}%`} tone={metrics.ruleWarningRate === 0 ? "good" : "warn"} />
      </section>

      <DailyReviewReminder complete={Boolean(todayReview)} />

      <section className="app-surface flex items-center justify-between border-y border-terminal-line/70 py-4"><div><p className="font-mono text-xs uppercase text-terminal-cyan">outcomes / process</p><h2 className="mt-1 text-xl font-semibold text-terminal-text">Performance signals</h2></div><Link href="/trades" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-terminal-cyan transition hover:text-cyan-300">All trades<ArrowUpRight className="h-4 w-4" /></Link></section>

      <section className="grid gap-4 xl:grid-cols-2">
        <EquityCurve data={metrics.equityCurve} />
        <DisciplineAnalysis criteriaMetRate={metrics.criteriaMetRate} brokenCriteriaRate={metrics.brokenCriteriaRate} />
      </section>

      <SeriesAnalytics trades={trades} />

      <TradeTable trades={trades.slice(0, 8)} />
    </AppShell>
  );
}
