"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight, ArrowUpRight, BookOpenCheck, CalendarClock, CheckCircle2, ChevronDown, CircleDot, ClipboardList, Plus, Target, TrendingUp } from "lucide-react";
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

function SectionHeading({ eyebrow, title, detail, href, action }: { eyebrow: string; title: string; detail?: string; href?: string; action?: string }) {
  return <div className="workspace-section-heading"><div><p className="page-eyebrow">{eyebrow}</p><h2>{title}</h2>{detail && <p>{detail}</p>}</div>{href && action && <Link href={href} className="section-heading-link">{action}<ArrowUpRight className="h-4 w-4" /></Link>}</div>;
}

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
  const visibleLabel = rangeOptions.find((item) => item.key === range)?.label ?? "All time";
  const primaryMetrics = [
    { label: "Win rate", value: `${metrics.winRate.toFixed(1)}%`, tone: metrics.winRate >= 50 ? "good" as const : "warn" as const, note: `${Math.round(metrics.totalTrades * metrics.winRate / 100)} winning trades` },
    { label: "Net result", value: formatR(metrics.totalR), tone: metrics.totalR > 0 ? "good" as const : metrics.totalR < 0 ? "bad" as const : "default" as const, note: "Risk-adjusted R" },
    { label: "Expectancy", value: formatR(metrics.expectancy), tone: metrics.expectancy > 0 ? "good" as const : metrics.expectancy < 0 ? "bad" as const : "default" as const, note: "Average result / trade" },
    { label: "Max drawdown", value: formatR(-metrics.maxDrawdown), tone: metrics.maxDrawdown > 0 ? "bad" as const : "default" as const, note: "Peak to trough" },
  ];
  const secondaryMetrics = [
    { label: "Average win", value: formatR(metrics.avgWin), tone: "good" as const },
    { label: "Average loss", value: formatR(metrics.avgLoss), tone: "bad" as const },
    { label: "Criteria met", value: `${metrics.criteriaMetRate.toFixed(1)}%`, tone: metrics.criteriaMetRate >= 50 ? "good" as const : "warn" as const },
    { label: "Broken criteria", value: `${metrics.brokenCriteriaRate.toFixed(1)}%`, tone: metrics.brokenCriteriaRate >= 50 ? "warn" as const : "bad" as const },
    { label: "Average R:R", value: `${metrics.averageRiskReward.toFixed(2)}:1`, tone: metrics.averageRiskReward >= 2 ? "good" as const : "warn" as const },
    { label: "Discipline", value: `${metrics.disciplineScore.toFixed(0)}/100`, tone: metrics.disciplineScore >= 75 ? "good" as const : metrics.disciplineScore >= 50 ? "warn" as const : "bad" as const },
    { label: "Rule warnings", value: `${metrics.ruleWarningRate.toFixed(1)}%`, tone: metrics.ruleWarningRate === 0 ? "good" as const : "warn" as const },
  ];

  return (
    <div className="dashboard-page dashboard-nerve space-y-5 lg:space-y-6">
      <header className="dashboard-heading">
        <div>
          <p className="page-eyebrow"><Activity className="h-3.5 w-3.5" /> Trading intelligence / workspace</p>
          <h1>Overview</h1>
          <p>Your trading activity, execution quality, and next review in one place.</p>
        </div>
        <div className="dashboard-heading-actions">
          <Link href="/review" className="button-secondary"><BookOpenCheck className="h-4 w-4" />Daily review</Link>
          <Link href="/log" className="button-primary"><Plus className="h-4 w-4" />Log a trade</Link>
        </div>
      </header>

      <div className="dashboard-commandbar"><div className="dashboard-command-label"><span className="dashboard-status-dot" /><span>PERSONAL TRADING DESK</span><span className="dashboard-command-divider">/</span><span>PERFORMANCE MONITOR</span></div><div className="dashboard-command-stats"><span><CircleDot className="h-3 w-3" />{openIdeas.length} active setup{openIdeas.length === 1 ? "" : "s"}</span><span className="dashboard-command-divider">·</span><span>{metrics.totalTrades} completed</span></div></div>

      {trades.length > 0 && <div className="dashboard-filterbar"><div><span className="dashboard-filter-label">Performance period</span><span className="dashboard-filter-caption">{metrics.totalTrades} completed trade{metrics.totalTrades === 1 ? "" : "s"}</span></div><div className="dashboard-range-group" role="group" aria-label="Filter dashboard by time period">{rangeOptions.map((option) => <button key={option.key} type="button" aria-pressed={range === option.key} onClick={() => setRange(option.key)} className={range === option.key ? "is-active" : ""}>{option.label}</button>)}</div></div>}

      <section aria-label={`${visibleLabel} performance metrics`} className="dashboard-metric-grid">
        {primaryMetrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </section>
      {trades.length > 0 && <div className="dashboard-more-metrics"><button type="button" aria-expanded={showMoreMetrics} onClick={() => setShowMoreMetrics((open) => !open)}>{showMoreMetrics ? "Hide detailed metrics" : "View detailed metrics"}<ChevronDown className={`h-4 w-4 transition-transform ${showMoreMetrics ? "rotate-180" : ""}`} /></button></div>}
      {trades.length > 0 && showMoreMetrics && <section className="dashboard-secondary-metrics">{secondaryMetrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}</section>}

      {trades.length === 0 ? (
        <>
          <section className="dashboard-empty-state">
            <div className="dashboard-empty-copy"><span className="dashboard-kicker"><ClipboardList className="h-4 w-4" /> Your journal begins here</span><h2>Make your first trade more useful.</h2><p>Save the idea before price arrives. Add execution when you enter, then turn the outcome into a lesson you can use again.</p><Link href="/log" className="button-primary mt-5"><Plus className="h-4 w-4" />Create your first setup</Link></div>
            <div className="dashboard-empty-steps">{[["01", "Prepare", "Record the setup, rules, and state of mind."], ["02", "Execute", "Add prices and risk when the entry is reached."], ["03", "Reflect", "Review the decision after the trade closes."]].map(([step, title, copy]) => <div key={step} className="dashboard-empty-step"><span>{step}</span><div><h3>{title}</h3><p>{copy}</p></div><ArrowRight className="h-4 w-4" /></div>)}</div>
          </section>
          <DashboardRoadmap plan={growthPlan} />
          <MarketSessionStatus />
        </>
      ) : (
        <>
          <DailyReviewReminder complete={reviewComplete} />

          {needsReview.length > 0 && <section className="dashboard-review-queue"><div className="dashboard-review-icon"><BookOpenCheck className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="page-eyebrow">Close the learning loop</p><h2>{needsReview.length} trade{needsReview.length === 1 ? "" : "s"} ready for reflection</h2><p>Review the setup and your mindset while the decision is still fresh.</p></div><Link href={`/trades/${needsReview[0].id}`} className="button-secondary">Review next<ArrowRight className="h-4 w-4" /></Link></section>}

          <section className="dashboard-main-grid">
            <EquityCurve trades={visibleTrades} />
            <div className="dashboard-workflow-column">
              <section className="dashboard-workflow-card">
                <div className="dashboard-card-heading"><div><p className="page-eyebrow">Your workflow</p><h2>Next actions</h2></div><CalendarClock className="h-5 w-5" /></div>
                <Link href={openIdeas.length ? "/trades" : "/log"} className="dashboard-action-row"><span className="dashboard-action-icon is-blue"><ClipboardList className="h-4 w-4" /></span><span><strong>{openIdeas.length} setup{openIdeas.length === 1 ? "" : "s"} in progress</strong><small>Open your active trade board</small></span><ArrowUpRight className="ml-auto h-4 w-4" /></Link>
                <Link href="/review" className="dashboard-action-row"><span className={`dashboard-action-icon ${reviewComplete ? "is-green" : "is-amber"}`}>{reviewComplete ? <CheckCircle2 className="h-4 w-4" /> : <BookOpenCheck className="h-4 w-4" />}</span><span><strong>{reviewComplete ? "Daily review complete" : "Daily review is open"}</strong><small>{reviewComplete ? "Your process is recorded for today" : "Take two minutes to check in"}</small></span><ArrowUpRight className="ml-auto h-4 w-4" /></Link>
                <Link href="/growth" className="dashboard-action-row"><span className="dashboard-action-icon is-blue"><Target className="h-4 w-4" /></span><span><strong>{growthPlan?.title ?? "Set a growth target"}</strong><small>{growthPlan ? "Continue your account roadmap" : "Build a plan around your process"}</small></span><ArrowUpRight className="ml-auto h-4 w-4" /></Link>
              </section>
              <MarketSessionStatus compact />
            </div>
          </section>

          {metrics.totalTrades === 0 && <p className="dashboard-hint">No completed trades in this period yet. Your planned setups are still available in trade history.</p>}

          <section className="dashboard-analysis-grid">
            <DisciplineAnalysis criteriaMetR={metrics.criteriaMetR} brokenCriteriaR={metrics.brokenCriteriaR} />
            <StreakInsight trades={visibleTrades} />
          </section>

          <DashboardPsychology trades={visibleTrades} />
          <DashboardRoadmap plan={growthPlan} />
          <SeriesAnalytics trades={visibleTrades} />
          <section className="dashboard-lower-grid">
            <TradeCalendar trades={trades.filter((trade) => trade.status === "Completed")} compact />
            <TradeTable trades={visibleTrades.slice(0, 8)} compact />
          </section>
        </>
      )}
    </div>
  );
}
