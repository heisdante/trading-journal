"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpenCheck, CheckCircle2, ChevronDown, CircleDot, PlusCircle, RotateCcw, Target } from "lucide-react";
import { DisciplineAnalysis } from "@/components/discipline-analysis";
import { EquityCurve } from "@/components/equity-curve";
import { MetricCard } from "@/components/metric-card";
import { TradeTable } from "@/components/trade-table";
import { DashboardPsychology } from "@/components/dashboard-psychology";
import { SeriesAnalytics } from "@/components/series-analytics";
import { DailyReviewReminder } from "@/components/daily-review-reminder";
import { MarketSessionStatus } from "@/components/market-session-status";
import { TradeCalendar } from "@/components/trade-calendar";
import { StreakInsight } from "@/components/streak-insight";
import { DashboardRoadmap } from "@/components/dashboard-roadmap";
import { buildTradeMetrics, formatR } from "@/lib/trades/calculations";
import type { GrowthPlan, Trade } from "@/types/trade";

type Range = "30d" | "90d" | "year" | "all";
const rangeOptions: Array<{ key: Range; label: string; days?: number }> = [
  { key: "30d", label: "30 days", days: 30 },
  { key: "90d", label: "90 days", days: 90 },
  { key: "year", label: "12 months", days: 365 },
  { key: "all", label: "All time" },
];

type DashboardOverviewProps = {
  trades: Trade[];
  pendingReviews: Trade[];
  reviewComplete: boolean;
  growthPlan: Pick<GrowthPlan, "id" | "title" | "account_type" | "starting_balance" | "target_balance" | "currency" | "risk_percent" | "deadline" | "milestones"> | null;
};

export function DashboardOverview({ trades, pendingReviews, reviewComplete, growthPlan }: DashboardOverviewProps) {
  const [range, setRange] = useState<Range>("all");
  const [showMoreMetrics, setShowMoreMetrics] = useState(false);

  const visibleTrades = useMemo(() => {
    const option = rangeOptions.find((item) => item.key === range);
    if (!option?.days) return trades;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - option.days + 1);
    const cutoffKey = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, "0")}-${String(cutoff.getDate()).padStart(2, "0")}`;
    return trades.filter((trade) => trade.date >= cutoffKey);
  }, [range, trades]);

  const metrics = useMemo(() => buildTradeMetrics(visibleTrades), [visibleTrades]);
  const openIdeas = visibleTrades.filter((trade) => trade.status !== "Completed");
  const needsReview = pendingReviews.filter((trade) => range === "all" || visibleTrades.some((visible) => visible.id === trade.id));
  const visibleLabel = rangeOptions.find((item) => item.key === range)?.label ?? "30 days";

  const primaryMetrics = [
    { label: "Win rate", value: `${metrics.winRate.toFixed(1)}%`, tone: metrics.winRate >= 50 ? "good" as const : "warn" as const },
    { label: "Net performance", value: formatR(metrics.totalR), tone: metrics.totalR > 0 ? "good" as const : metrics.totalR < 0 ? "bad" as const : "default" as const },
    { label: "Expectancy / trade", value: formatR(metrics.expectancy), tone: metrics.expectancy > 0 ? "good" as const : metrics.expectancy < 0 ? "bad" as const : "default" as const },
    { label: "Max drawdown", value: formatR(-metrics.maxDrawdown), tone: metrics.maxDrawdown > 0 ? "bad" as const : "default" as const },
  ];

  const secondaryMetrics = [
    { label: "Average win", value: formatR(metrics.avgWin), tone: "good" as const },
    { label: "Average loss", value: formatR(metrics.avgLoss), tone: "bad" as const },
    { label: "Criteria met", value: `${metrics.criteriaMetRate.toFixed(1)}%`, tone: metrics.criteriaMetRate >= 50 ? "good" as const : "warn" as const },
    { label: "Broken criteria", value: `${metrics.brokenCriteriaRate.toFixed(1)}%`, tone: metrics.brokenCriteriaRate >= 50 ? "warn" as const : "bad" as const },
    { label: "Average R:R", value: `${metrics.averageRiskReward.toFixed(2)}:1`, tone: metrics.averageRiskReward >= 2 ? "good" as const : "warn" as const },
    { label: "Discipline score", value: `${metrics.disciplineScore.toFixed(0)}/100`, tone: metrics.disciplineScore >= 75 ? "good" as const : metrics.disciplineScore >= 50 ? "warn" as const : "bad" as const },
    { label: "Rule warnings", value: `${metrics.ruleWarningRate.toFixed(1)}%`, tone: metrics.ruleWarningRate === 0 ? "good" as const : "warn" as const },
  ];

  return (
    <>
      <section className="dashboard-hero relative isolate overflow-hidden rounded-[26px]">
        <div className="relative z-10 grid min-h-[290px] gap-8 p-5 sm:p-7 lg:grid-cols-[1.1fr_.9fr] lg:items-end lg:p-9">
          <div className="max-w-2xl text-terminal-text"><p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-terminal-cyan"><CircleDot className="h-3 w-3 text-terminal-green" />Your process, in focus</p><h1 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">Grow as you execute<br className="hidden sm:block" /> and journal.</h1><p className="mt-4 max-w-xl text-sm leading-6 text-terminal-muted">A clear view of your performance, mindset, and next step—built from the trades you actually record.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/log" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-terminal-cyan px-5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110"><PlusCircle className="h-4 w-4" />Capture a trade</Link><Link href="/review" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-terminal-line bg-terminal-panel px-5 text-sm font-semibold text-terminal-text transition hover:border-terminal-cyan">Open today&apos;s review<ArrowUpRight className="h-4 w-4" /></Link></div></div>
          <div className="dashboard-hero-summary rounded-2xl p-4 sm:p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">Journal at a glance</p><p className="mt-2 text-xl font-semibold text-white">{trades.length} <span className="text-sm font-normal text-white/60">recorded trades</span></p></div><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/80"><span className="h-1.5 w-1.5 rounded-full bg-[#a6d9ae]" />PRIVATE</span></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-black/20 p-3"><p className="text-xs text-white/55">Setups in progress</p><p className="number mt-1 text-lg font-semibold text-white">{trades.filter((trade) => trade.status !== "Completed").length}</p></div><div className="rounded-xl bg-black/20 p-3"><p className="text-xs text-white/55">Reviews to close</p><p className="number mt-1 text-lg font-semibold text-white">{pendingReviews.length}</p></div></div><div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3 text-xs text-white/65"><span>Prepare → Execute → Reflect</span><Link href="/growth" className="inline-flex items-center gap-1 font-medium text-white hover:text-[#b3e2bd]">Growth plan<ArrowUpRight className="h-3.5 w-3.5" /></Link></div></div>
        </div>
      </section>

      {trades.length > 0 && <section className="dashboard-rangebar flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"><div><p className="text-sm font-semibold text-terminal-text">Performance window</p><p className="mt-0.5 text-xs text-terminal-muted">Change the period to update your metrics, charts, and recent trades.</p></div><div className="dashboard-range-group flex w-full gap-1 overflow-x-auto rounded-xl p-1 sm:w-auto" role="group" aria-label="Filter dashboard by time period">{rangeOptions.map((option) => <button key={option.key} type="button" aria-pressed={range === option.key} onClick={() => setRange(option.key)} className={`min-h-10 flex-1 whitespace-nowrap rounded-lg px-3 text-xs font-semibold transition sm:flex-initial ${range === option.key ? "dashboard-range-active" : "text-terminal-muted hover:text-terminal-text"}`}>{option.label}</button>)}</div></section>}

      {trades.length === 0 ? (
        <section className="dashboard-empty terminal-panel overflow-hidden p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div><span className="inline-flex items-center gap-2 rounded-full bg-terminal-cyan/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-terminal-cyan"><CircleDot className="h-3 w-3" />Your process starts here</span><h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">A better trading record begins with one honest entry.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-terminal-muted">Save an idea before price arrives, track the execution, then keep the lesson. Your dashboard will grow with your journal.</p><Link href="/log" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-terminal-cyan px-5 text-sm font-semibold text-terminal-bg transition hover:-translate-y-0.5"><PlusCircle className="h-4 w-4" />Capture your first setup<ArrowRight className="h-4 w-4" /></Link></div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[["01", "Save the idea", "Write the setup and what needs to happen."], ["02", "Track the trade", "Update it when price reaches your entry."], ["03", "Keep the lesson", "Review your decision after it closes."]].map(([step, title, copy]) => <div key={step} className="flex gap-4 rounded-2xl bg-terminal-panel2 p-4"><span className="number text-sm text-terminal-cyan">{step}</span><div><h3 className="text-sm font-semibold text-terminal-text">{title}</h3><p className="mt-1 text-xs leading-5 text-terminal-muted">{copy}</p></div></div>)}
            </div>
          </div>
        </section>
      ) : (
        <>
          <DailyReviewReminder complete={reviewComplete} />

          {needsReview.length > 0 && <section className="dashboard-attention terminal-panel flex flex-col gap-4 rounded-lg p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><div className="rounded-xl bg-terminal-amber/10 p-2 text-terminal-amber"><BookOpenCheck className="h-5 w-5" /></div><div><p className="font-mono text-xs uppercase tracking-[0.12em] text-terminal-amber">Reflection / close the loop</p><h2 className="mt-1 font-semibold">{needsReview.length} trade{needsReview.length === 1 ? "" : "s"} waiting for a review</h2><p className="mt-1 text-sm text-terminal-muted">Give the process the same attention you gave the outcome.</p></div></div><Link href={`/trades/${needsReview[0].id}`} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-terminal-amber/30 bg-terminal-amber/10 px-4 text-sm font-semibold text-terminal-amber transition hover:bg-terminal-amber/15">Review next trade<ArrowRight className="h-4 w-4" /></Link></section>}

          <section className="dashboard-pulse grid gap-3 sm:grid-cols-3">
            <div className="terminal-panel flex items-center gap-3 p-4"><div className="rounded-xl bg-terminal-cyan/10 p-2.5 text-terminal-cyan"><Target className="h-4 w-4" /></div><div><p className="text-xs text-terminal-muted">Selected window</p><p className="mt-0.5 text-sm font-semibold text-terminal-text">{visibleLabel} <span className="font-normal text-terminal-muted">· {metrics.totalTrades} completed</span></p></div></div>
            <Link href="/trades" className="terminal-panel flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:border-terminal-cyan/40"><div className="rounded-xl bg-terminal-amber/10 p-2.5 text-terminal-amber"><RotateCcw className="h-4 w-4" /></div><div><p className="text-xs text-terminal-muted">Setups in progress</p><p className="mt-0.5 text-sm font-semibold text-terminal-text">{openIdeas.length} planned or active</p></div><ArrowUpRight className="ml-auto h-4 w-4 text-terminal-muted" /></Link>
            <div className="terminal-panel flex items-center gap-3 p-4"><div className={`rounded-xl p-2.5 ${reviewComplete ? "bg-terminal-green/10 text-terminal-green" : "bg-terminal-amber/10 text-terminal-amber"}`}>{reviewComplete ? <CheckCircle2 className="h-4 w-4" /> : <BookOpenCheck className="h-4 w-4" />}</div><div><p className="text-xs text-terminal-muted">Today&apos;s reflection</p><p className="mt-0.5 text-sm font-semibold text-terminal-text">{reviewComplete ? "Complete for today" : "Still open"}</p></div></div>
          </section>

          {metrics.totalTrades === 0 && <section className="flex flex-col gap-3 rounded-2xl border border-terminal-line bg-terminal-panel2/60 p-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-terminal-muted">No completed trades in this window yet. Your open ideas remain in the journal while you build a sample.</p><button type="button" onClick={() => setRange("all")} className="min-h-10 shrink-0 rounded-xl px-3 text-sm font-semibold text-terminal-cyan hover:bg-terminal-cyan/10">View all time</button></section>}

          <section aria-label={`${visibleLabel} performance metrics`} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {primaryMetrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
            {showMoreMetrics && secondaryMetrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
          </section>
          <div className="flex justify-center -mt-2"><button type="button" aria-expanded={showMoreMetrics} onClick={() => setShowMoreMetrics((open) => !open)} className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-terminal-muted transition hover:bg-terminal-panel2 hover:text-terminal-text">{showMoreMetrics ? "Show key metrics" : "Explore 7 more metrics"}<ChevronDown className={`h-4 w-4 transition-transform ${showMoreMetrics ? "rotate-180" : ""}`} /></button></div>

          <MarketSessionStatus />
          <StreakInsight trades={visibleTrades} />

          <section className="flex items-end justify-between gap-4 border-b border-terminal-line pb-3"><div><p className="font-mono text-xs uppercase tracking-[0.14em] text-terminal-cyan">Outcomes / process</p><h2 className="mt-1 text-xl font-semibold text-terminal-text">Performance signals</h2><p className="mt-1 text-sm text-terminal-muted">Explore the shape of your execution across {visibleLabel.toLowerCase()}.</p></div><Link href="/report" className="inline-flex min-h-10 shrink-0 items-center gap-1 text-sm font-semibold text-terminal-cyan transition hover:text-terminal-green">Full report<ArrowUpRight className="h-4 w-4" /></Link></section>

          <section className="grid gap-4 xl:grid-cols-2">
            <EquityCurve trades={visibleTrades} />
            <DisciplineAnalysis criteriaMetR={metrics.criteriaMetR} brokenCriteriaR={metrics.brokenCriteriaR} />
          </section>

          <DashboardPsychology trades={visibleTrades} />
          <DashboardRoadmap plan={growthPlan} />
          <SeriesAnalytics trades={visibleTrades} />
          <TradeCalendar trades={trades.filter((trade) => trade.status === "Completed")} />
          <TradeTable trades={visibleTrades.slice(0, 8)} />
        </>
      )}
      {trades.length === 0 && <DashboardRoadmap plan={growthPlan} />}
    </>
  );
}
