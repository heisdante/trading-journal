"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowRight, ArrowUpRight, BookOpenCheck, CalendarDays, CheckCircle2, CircleDot, ClipboardList, Plus, Target, TrendingDown, TrendingUp } from "lucide-react";
import { DisciplineAnalysis } from "@/components/discipline-analysis";
import { EquityCurve } from "@/components/equity-curve";
import { MetricCard } from "@/components/metric-card";
import { DashboardPsychology } from "@/components/dashboard-psychology";
import { SeriesAnalytics } from "@/components/series-analytics";
import { MarketSessionStatus } from "@/components/market-session-status";
import { TradeCalendar } from "@/components/trade-calendar";
import { StreakInsight } from "@/components/streak-insight";
import { DashboardRoadmap } from "@/components/dashboard-roadmap";
import { buildTradeMetrics, formatR } from "@/lib/trades/calculations";
import type { GrowthPlan, Trade } from "@/types/trade";

type Range = "30d" | "90d" | "year" | "all";
const ranges: Array<{ key: Range; label: string; days?: number }> = [
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

function PerformanceLine({ trades }: { trades: Trade[] }) {
  const completed = [...trades].filter((trade) => trade.status === "Completed").sort((a, b) => a.date.localeCompare(b.date) || a.created_at.localeCompare(b.created_at));
  let balance = 0;
  const values = [0, ...completed.map((trade) => (balance += trade.r_value))];
  const min = Math.min(...values, 0) - 0.35;
  const max = Math.max(...values, 0) + 0.35;
  const points = values.map((value, index) => `${(index / Math.max(values.length - 1, 1)) * 600},${140 - ((value - min) / (max - min)) * 116}`).join(" ");
  return <div className="desk-sparkline" role="img" aria-label={completed.length ? `Cumulative performance across ${completed.length} completed trades` : "Performance line will appear after your first completed trade"}>
    <svg viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true"><line x1="0" x2="600" y1="34" y2="34" /><line x1="0" x2="600" y1="83" y2="83" /><line x1="0" x2="600" y1="132" y2="132" />{completed.length ? <polyline points={points} /> : <path className="is-empty" d="M0 91 H600" />}</svg>
  </div>;
}

function SectionTitle({ eyebrow, title, href, action }: { eyebrow: string; title: string; href?: string; action?: string }) {
  return <div className="desk-section-title"><div><p className="page-eyebrow">{eyebrow}</p><h2>{title}</h2></div>{href && action && <Link href={href}>{action}<ArrowUpRight className="h-4 w-4" /></Link>}</div>;
}

export function DashboardOverview({ trades, pendingReviews, reviewComplete, growthPlan }: DashboardOverviewProps) {
  const [range, setRange] = useState<Range>("all");
  const visibleTrades = useMemo(() => {
    const selection = ranges.find((item) => item.key === range);
    if (!selection?.days) return trades;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - selection.days + 1);
    const key = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, "0")}-${String(cutoff.getDate()).padStart(2, "0")}`;
    return trades.filter((trade) => trade.date >= key);
  }, [range, trades]);
  const metrics = useMemo(() => buildTradeMetrics(visibleTrades), [visibleTrades]);
  const openIdeas = trades.filter((trade) => trade.status !== "Completed");
  const recent = visibleTrades.slice(0, 5);
  const periodLabel = ranges.find((item) => item.key === range)?.label ?? "All time";
  const hasTrades = trades.length > 0;
  const nextActions = [
    { href: pendingReviews.length ? `/trades/${pendingReviews[0].id}` : "/trades", icon: BookOpenCheck, title: pendingReviews.length ? `${pendingReviews.length} trade${pendingReviews.length === 1 ? "" : "s"} to reflect on` : "Trade reflections are clear", detail: pendingReviews.length ? "Capture the lesson while it is fresh" : "Review each outcome as trades close", emphasis: pendingReviews.length > 0 },
    { href: openIdeas.length ? "/trades" : "/log", icon: ClipboardList, title: openIdeas.length ? `${openIdeas.length} setup${openIdeas.length === 1 ? "" : "s"} in progress` : "No open setups", detail: openIdeas.length ? "Track entries and update active trades" : "Record an idea before price arrives", emphasis: false },
    { href: "/review", icon: reviewComplete ? CheckCircle2 : CalendarDays, title: reviewComplete ? "Daily review complete" : "Complete today's review", detail: reviewComplete ? "Your process is recorded today" : "A short check-in keeps the process visible", emphasis: !reviewComplete },
  ];

  return <div className="dashboard-page dashboard-studio">
    <header className="desk-header"><div><p className="page-eyebrow"><Activity className="h-3.5 w-3.5" /> Your trading desk</p><h1>Trade with a clearer view.</h1><p>Performance, process, and the next decision in one place.</p></div><div className="desk-header-actions"><Link href="/trades" className="desk-quiet-button">Trade history <ArrowUpRight className="h-4 w-4" /></Link><Link href="/log" className="desk-primary-button"><Plus className="h-4 w-4" /> Log a trade</Link></div></header>

    <div className="desk-toolbar"><div className="desk-toolbar-label"><span className="dashboard-status-dot" /><span>JOURNAL OVERVIEW</span><span className="desk-toolbar-divider">/</span><span>{metrics.totalTrades} CLOSED · {openIdeas.length} IN PROGRESS</span></div><div className="desk-range" role="group" aria-label="Dashboard time period">{ranges.map((option) => <button key={option.key} type="button" aria-pressed={range === option.key} className={range === option.key ? "is-active" : ""} onClick={() => setRange(option.key)}>{option.label}</button>)}</div></div>

    <div className="desk-top-grid"><section className="desk-performance" aria-label={`${periodLabel} performance summary`}><div className="desk-performance-head"><span><CircleDot className="h-3.5 w-3.5" /> PERFORMANCE PULSE</span><span>{periodLabel.toUpperCase()}</span></div><div className="desk-performance-main"><div><p>Net result</p><strong className={metrics.totalR < 0 ? "is-negative" : ""}>{formatR(metrics.totalR)}</strong><span>{metrics.totalTrades ? "Across completed trades" : "Your first result starts here"}</span></div><PerformanceLine trades={visibleTrades} /></div><div className="desk-performance-foot"><div><span>COMPLETED</span><strong>{metrics.totalTrades.toString().padStart(2, "0")}</strong></div><div><span>WIN RATE</span><strong>{metrics.winRate.toFixed(1)}%</strong></div><div><span>PROCESS SCORE</span><strong>{metrics.disciplineScore.toFixed(0)}<small> / 100</small></strong></div></div></section>
      <section className="desk-next" aria-label="Next actions"><div className="desk-next-heading"><div><p className="page-eyebrow">Stay in motion</p><h2>Next on your desk</h2></div><span>{pendingReviews.length ? `${pendingReviews.length} TO REVIEW` : "UP TO DATE"}</span></div><div className="desk-next-list">{nextActions.map(({ href, icon: Icon, title, detail, emphasis }) => <Link key={title} href={href} className="desk-next-item"><span className={emphasis ? "desk-next-icon is-accent" : "desk-next-icon"}><Icon className="h-[18px] w-[18px]" /></span><span><strong>{title}</strong><small>{detail}</small></span><ArrowRight className="desk-next-arrow h-4 w-4" /></Link>)}</div><Link href="/growth" className="desk-next-plan"><Target className="h-4 w-4" /><span>{growthPlan ? `Roadmap: ${growthPlan.title}` : "Build your growth roadmap"}</span><ArrowUpRight className="ml-auto h-4 w-4" /></Link></section></div>

    {!hasTrades && <section className="desk-start"><div><p className="page-eyebrow">Start with a decision</p><h2>Build a journal you can learn from.</h2><p>Capture a setup, update it when price reaches your entry, then review what the outcome taught you.</p><Link href="/log" className="desk-primary-button">Record your first setup <ArrowRight className="h-4 w-4" /></Link></div><div className="desk-start-steps">{[["01", "Plan", "Write the idea and why it qualifies."], ["02", "Execute", "Add your entry, stop, and risk."], ["03", "Reflect", "Keep the lesson after the result."]].map(([number, title, detail]) => <div key={number}><span>{number}</span><strong>{title}</strong><small>{detail}</small></div>)}</div></section>}

    <section className="desk-metric-grid" aria-label="Detailed performance metrics"><MetricCard label="Expectancy" value={formatR(metrics.expectancy)} tone={metrics.expectancy > 0 ? "good" : metrics.expectancy < 0 ? "bad" : "default"} note="Average result per closed trade" /><MetricCard label="Average risk : reward" value={`${metrics.averageRiskReward.toFixed(2)} : 1`} tone="default" note="Planned payoff on executed trades" /><MetricCard label="Max drawdown" value={formatR(-metrics.maxDrawdown)} tone={metrics.maxDrawdown ? "bad" : "default"} note="Largest peak-to-trough decline" /><MetricCard label="Criteria met" value={`${metrics.criteriaMetRate.toFixed(0)}%`} tone={metrics.criteriaMetRate >= 70 ? "good" : "warn"} note="Setups that met your rules" /></section>

    <div className="desk-chart-grid"><EquityCurve trades={visibleTrades} /><div className="desk-process-column"><DisciplineAnalysis criteriaMetR={metrics.criteriaMetR} brokenCriteriaR={metrics.brokenCriteriaR} /><StreakInsight trades={visibleTrades} /></div></div>

    {hasTrades && <><SectionTitle eyebrow="The trading record" title="Activity and recent decisions" href="/trades" action="View all trades" /><div className="desk-activity-grid"><TradeCalendar trades={trades.filter((trade) => trade.status === "Completed")} compact /><section className="desk-recent" aria-label="Recent trades"><div className="desk-recent-head"><div><p className="page-eyebrow">Journal / latest</p><h2>Recent activity</h2></div><span>{recent.length} SHOWN</span></div><div className="desk-recent-list">{recent.length ? recent.map((trade) => <Link href={`/trades/${trade.id}`} key={trade.id} className="desk-trade-row"><span className={`desk-trade-mark ${trade.status === "Completed" ? trade.r_value > 0 ? "is-win" : trade.r_value < 0 ? "is-loss" : "is-flat" : "is-open"}`}>{trade.status === "Completed" ? trade.r_value > 0 ? <TrendingUp className="h-4 w-4" /> : trade.r_value < 0 ? <TrendingDown className="h-4 w-4" /> : <CircleDot className="h-4 w-4" /> : <Activity className="h-4 w-4" />}</span><span className="desk-trade-name"><strong>{trade.pair}</strong><small>{trade.direction} · {trade.date}</small></span><span className={`desk-trade-value ${trade.r_value < 0 ? "is-loss" : ""}`}><strong>{trade.status === "Completed" ? formatR(trade.r_value) : trade.status}</strong><small>{trade.status === "Completed" ? trade.result : "In progress"}</small></span><ArrowUpRight className="h-4 w-4" /></Link>) : <p className="desk-recent-empty">No trades in this period. Change the time filter to see more.</p>}</div><Link href="/trades" className="desk-recent-footer">Open trade history <ArrowRight className="h-4 w-4" /></Link></section></div></>}

    <SectionTitle eyebrow="Beyond the numbers" title="Build the trader behind the trade" /><div className="desk-growth-grid"><DashboardPsychology trades={visibleTrades} /><DashboardRoadmap plan={growthPlan} /></div>{hasTrades && <SeriesAnalytics trades={visibleTrades} />}<MarketSessionStatus compact />
  </div>;
}
