"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, ArrowRight, ArrowUpRight, BookOpenCheck, CalendarDays, Check, CircleDot, ClipboardList, Plus, Target, TrendingDown, TrendingUp } from "lucide-react";
import { DashboardPsychology } from "@/components/dashboard-psychology";
import { DashboardGreeting } from "@/components/dashboard-greeting";
import { DashboardRoadmap } from "@/components/dashboard-roadmap";
import { DisciplineAnalysis } from "@/components/discipline-analysis";
import { StreakInsight } from "@/components/streak-insight";
import { MarketSessionStatus } from "@/components/market-session-status";
import { SeriesAnalytics } from "@/components/series-analytics";
import { buildTradeMetrics, calculateDisciplineScore, formatR } from "@/lib/trades/calculations";
import type { GrowthPlan, Trade } from "@/types/trade";

type Range = "30d" | "90d" | "year" | "all";
type ChartMode = "r" | "percent";
const ranges: Array<{ key: Range; label: string; days?: number }> = [
  { key: "30d", label: "30D", days: 30 },
  { key: "90d", label: "90D", days: 90 },
  { key: "year", label: "1Y", days: 365 },
  { key: "all", label: "ALL" },
];

type Props = {
  trades: Trade[];
  pendingReviews: Trade[];
  reviewComplete: boolean;
  growthPlan: Pick<GrowthPlan, "id" | "title" | "account_type" | "starting_balance" | "target_balance" | "currency" | "risk_percent" | "deadline" | "milestones"> | null;
  fullName: string | null;
  timezone: string | null;
};

function SectionHeading({ index, title, action, href }: { index: string; title: string; action?: string; href?: string }) {
  return <div className="pulse-section-heading"><div><span>{index}</span><h2>{title}</h2></div>{href && <Link href={href}>{action}<ArrowUpRight size={15} /></Link>}</div>;
}

function HeroLine({ trades }: { trades: Trade[] }) {
  const completed = [...trades].filter((trade) => trade.status === "Completed").sort((a, b) => a.date.localeCompare(b.date) || a.created_at.localeCompare(b.created_at));
  let sum = 0;
  const values = [0, ...completed.map((trade) => (sum += trade.r_value))];
  const low = Math.min(...values) - 0.5;
  const high = Math.max(...values) + 0.5;
  const points = values.map((value, index) => `${(index / Math.max(1, values.length - 1)) * 520},${122 - ((value - low) / (high - low)) * 106}`).join(" ");
  return <svg className="pulse-hero-line" viewBox="0 0 520 145" preserveAspectRatio="none" role="img" aria-label={completed.length ? `Performance across ${completed.length} closed trades` : "Performance chart awaiting your first closed trade"}>
    <path d="M0 28H520M0 75H520M0 122H520" className="pulse-hero-grid" />
    {completed.length ? <polyline points={points} /> : <path d="M0 91H520" className="pulse-hero-empty" />}
  </svg>;
}

function OutcomeRing({ trades }: { trades: Trade[] }) {
  const completed = trades.filter((trade) => trade.status === "Completed");
  const win = completed.filter((trade) => trade.r_value > 0).length;
  const loss = completed.filter((trade) => trade.r_value < 0).length;
  const flat = completed.length - win - loss;
  const circumference = 2 * Math.PI * 58;
  const segments = [
    { name: "Wins", count: win, color: "var(--terminal-green)" },
    { name: "Losses", count: loss, color: "var(--terminal-red)" },
    { name: "Breakeven", count: flat, color: "var(--terminal-amber)" },
  ];
  let offset = 0;
  return <section className="pulse-outcomes" aria-label="Trade outcome breakdown">
    <div className="pulse-card-heading"><div><p>RESULT DISTRIBUTION</p><h3>Outcome mix</h3></div><Link href="/trades" aria-label="View trade history"><ArrowUpRight size={17} /></Link></div>
    <div className="pulse-ring-wrap"><svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="58" className="pulse-ring-track" />{completed.length > 0 && segments.map((segment) => { const length = circumference * segment.count / completed.length; const circle = <circle key={segment.name} cx="80" cy="80" r="58" fill="none" stroke={segment.color} strokeWidth="14" strokeDasharray={`${length} ${circumference - length}`} strokeDashoffset={-offset} transform="rotate(-90 80 80)" />; offset += length; return circle; })}</svg><div><strong>{completed.length}</strong><span>CLOSED<br />TRADES</span></div></div>
    <div className="pulse-outcome-legend">{segments.map((item) => <div key={item.name}><i style={{ background: item.color }} /><span>{item.name}</span><strong>{item.count}</strong></div>)}</div>
  </section>;
}

function ActivityHeatmap({ trades }: { trades: Trade[] }) {
  const days = Array.from({ length: 28 }, (_, index) => { const date = new Date(); date.setHours(12, 0, 0, 0); date.setDate(date.getDate() - (27 - index)); return date; });
  const entries = new Map<string, Trade[]>();
  trades.forEach((trade) => entries.set(trade.date, [...(entries.get(trade.date) ?? []), trade]));
  const recordedDays = days.filter((date) => entries.has(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`)).length;
  return <section className="pulse-heatmap"><div className="pulse-card-heading"><div><p>LAST FOUR WEEKS</p><h3>Journal rhythm</h3></div><Link href="/calendar" aria-label="Open trading calendar"><ArrowUpRight size={17} /></Link></div><div className="pulse-heatmap-summary"><strong>{recordedDays}<small> / 28</small></strong><span>days with a journal entry</span></div><div className="pulse-heatmap-grid" aria-label="Last 28 days of trading activity">{days.map((date) => { const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; const dayTrades = entries.get(key) ?? []; const net = dayTrades.filter((trade) => trade.status === "Completed").reduce((total, trade) => total + trade.r_value, 0); return <span key={key} className={dayTrades.length ? net > 0 ? "is-win" : net < 0 ? "is-loss" : "is-logged" : ""} title={`${key}: ${dayTrades.length} journal ${dayTrades.length === 1 ? "entry" : "entries"}${dayTrades.length ? `, ${formatR(net)}` : ""}`} />; })}</div><div className="pulse-heatmap-foot"><span>28 DAYS AGO</span><span>TODAY</span></div></section>;
}

export function DashboardOverview({ trades, pendingReviews, reviewComplete, growthPlan, fullName, timezone }: Props) {
  const [range, setRange] = useState<Range>("all");
  const [mode, setMode] = useState<ChartMode>("r");
  const visible = useMemo(() => {
    const selected = ranges.find((item) => item.key === range);
    if (!selected?.days) return trades;
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - selected.days + 1);
    const key = `${cutoff.getFullYear()}-${String(cutoff.getMonth() + 1).padStart(2, "0")}-${String(cutoff.getDate()).padStart(2, "0")}`;
    return trades.filter((trade) => trade.date >= key);
  }, [range, trades]);
  const metrics = useMemo(() => buildTradeMetrics(visible), [visible]);
  const completed = useMemo(() => [...visible].filter((trade) => trade.status === "Completed").sort((a, b) => a.date.localeCompare(b.date) || a.created_at.localeCompare(b.created_at)), [visible]);
  const chart = useMemo(() => { let r = 0; let percent = 0; return [{ date: "Start", r: 0, percent: 0 }, ...completed.map((trade) => { r += trade.r_value; percent += trade.risk_percent === null ? 0 : trade.r_value * trade.risk_percent; return { date: new Date(`${trade.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }), r: Number(r.toFixed(2)), percent: Number(percent.toFixed(2)) }; })]; }, [completed]);
  const active = trades.filter((trade) => trade.status !== "Completed");
  const adherence = completed.length ? Math.round(completed.filter((trade) => trade.criteria_met).length / completed.length * 100) : 0;
  const discipline = completed.length ? Math.round(completed.reduce((sum, trade) => sum + (trade.discipline_score ?? calculateDisciplineScore(trade)), 0) / completed.length) : 0;
  const recent = visible.slice(0, 5);
  const next = pendingReviews.length ? { href: `/trades/${pendingReviews[0].id}`, label: "Review your last trade", detail: `${pendingReviews.length} reflection${pendingReviews.length === 1 ? "" : "s"} waiting`, icon: BookOpenCheck } : active.length ? { href: "/trades", label: "Update an open setup", detail: `${active.length} setup${active.length === 1 ? "" : "s"} in progress`, icon: ClipboardList } : { href: "/log", label: "Record your next idea", detail: "A setup can be saved before entry", icon: Plus };
  const NextIcon = next.icon;

  return <div className="dashboard-page pulse-dashboard">
    <header className="pulse-header"><div><p className="pulse-kicker"><span /> TRADING JOURNAL <b>/</b> YOUR TRADING DESK</p><DashboardGreeting fullName={fullName} savedTimezone={timezone} /></div><div className="pulse-header-actions"><Link href="/calendar" className="pulse-secondary-link"><CalendarDays size={16} /> Calendar</Link><Link href="/log" className="pulse-main-link"><Plus size={17} /> Log a trade <ArrowUpRight size={15} /></Link></div></header>

    <div className="pulse-lead-grid"><section className="pulse-hero" aria-label="Performance summary"><div className="pulse-hero-top"><span>01 / PERFORMANCE BRIEF</span><span>{range === "all" ? "ALL TIME" : ranges.find((item) => item.key === range)?.label}</span></div><div className="pulse-hero-body"><div><p>Net performance</p><strong>{formatR(metrics.totalR)}</strong><span>{metrics.totalTrades ? `From ${metrics.totalTrades} completed ${metrics.totalTrades === 1 ? "trade" : "trades"}` : "Your track record starts with a decision"}</span></div><HeroLine trades={visible} /></div><div className="pulse-hero-bottom"><div><span>WIN RATE</span><strong>{metrics.winRate.toFixed(0)}%</strong></div><div><span>AVERAGE TRADE</span><strong>{formatR(metrics.expectancy)}</strong></div><div><span>PROCESS SCORE</span><strong>{discipline}<small> / 100</small></strong></div></div></section>
      <section className="pulse-focus"><div className="pulse-focus-top"><span>02 / IN FOCUS</span><CircleDot size={17} /></div><h2>What needs your attention?</h2><p>Turn today&apos;s activity into a better next decision.</p><Link href={next.href} className="pulse-focus-primary"><span><NextIcon size={20} /></span><span><strong>{next.label}</strong><small>{next.detail}</small></span><ArrowUpRight size={17} /></Link><div className="pulse-focus-list"><Link href="/review"><span>{reviewComplete ? <Check size={17} /> : <CalendarDays size={17} />}</span><span>{reviewComplete ? "Daily review complete" : "Complete daily review"}</span><ArrowRight size={15} /></Link><Link href="/growth"><span><Target size={17} /></span><span>{growthPlan ? "View growth roadmap" : "Create a growth roadmap"}</span><ArrowRight size={15} /></Link></div></section></div>

    <section className="pulse-stat-row" aria-label="Performance indicators"><div><span>TRADES CLOSED</span><strong>{metrics.totalTrades.toString().padStart(2, "0")}</strong><small>{active.length} active or planned</small></div><div><span>MAX DRAWDOWN</span><strong className="is-negative">{formatR(-metrics.maxDrawdown)}</strong><small>Peak to trough</small></div><div><span>PLAN ADHERENCE</span><strong>{adherence}%</strong><small>Setups that met criteria</small></div><div><span>AVG RISK / REWARD</span><strong>{metrics.averageRiskReward.toFixed(2)}<em> : 1</em></strong><small>Recorded targets</small></div></section>

    <SectionHeading index="03 / PERFORMANCE" title="The curve behind the results" href="/report" action="Full report" />
    <div className="pulse-analytics-grid"><section className="pulse-equity"><div className="pulse-card-heading"><div><p>CUMULATIVE PERFORMANCE</p><h3>Equity curve</h3></div><div className="pulse-controls"><div className="pulse-segment" role="group" aria-label="Chart unit"><button type="button" aria-pressed={mode === "r"} onClick={() => setMode("r")} className={mode === "r" ? "is-selected" : ""}>R multiple</button><button type="button" aria-pressed={mode === "percent"} onClick={() => setMode("percent")} className={mode === "percent" ? "is-selected" : ""}>Risk %</button></div><div className="pulse-range" role="group" aria-label="Time period">{ranges.map((item) => <button key={item.key} type="button" aria-pressed={range === item.key} onClick={() => setRange(item.key)} className={range === item.key ? "is-selected" : ""}>{item.label}</button>)}</div></div></div><div className="pulse-chart-value"><strong>{mode === "r" ? formatR(metrics.totalR) : `${chart.at(-1)?.percent.toFixed(2) ?? "0.00"}%`}</strong><span>{mode === "r" ? "Cumulative R" : "Cumulative risk-weighted return"}</span></div><div className="pulse-chart-area">{completed.length ? <ResponsiveContainer width="100%" height="100%"><AreaChart data={chart} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}><CartesianGrid stroke="var(--terminal-line)" strokeDasharray="3 7" vertical={false} /><XAxis dataKey="date" stroke="var(--terminal-muted)" fontSize={10} tickLine={false} axisLine={false} minTickGap={25} /><YAxis stroke="var(--terminal-muted)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(value) => mode === "r" ? `${value}R` : `${value}%`} /><Tooltip contentStyle={{ background: "var(--terminal-panel)", border: "1px solid var(--terminal-line)", borderRadius: 12, color: "var(--terminal-text)" }} formatter={(value) => [`${Number(value).toFixed(2)}${mode === "r" ? "R" : "%"}`, "Cumulative"]} /><Area type="monotone" dataKey={mode} stroke="var(--terminal-green)" strokeWidth={3} fill="var(--chart-fill)" dot={false} activeDot={{ r: 5, fill: "var(--terminal-green)", stroke: "var(--terminal-panel)", strokeWidth: 2 }} isAnimationActive animationDuration={500} /></AreaChart></ResponsiveContainer> : <div className="pulse-chart-empty"><Activity size={24} /><strong>Your performance story starts here</strong><span>Complete a trade to see the curve take shape.</span><Link href="/log">Record a setup <ArrowRight size={14} /></Link></div>}</div><p className="pulse-chart-note">{mode === "percent" ? "Risk % includes only trades with recorded planned risk." : "Each closed trade adds its R multiple to this curve."}</p></section><OutcomeRing trades={visible} /></div>

    <SectionHeading index="04 / JOURNAL ACTIVITY" title="Patterns you can act on" href="/calendar" action="Open calendar" />
    <div className="pulse-activity-grid"><ActivityHeatmap trades={trades} /><section className="pulse-recent"><div className="pulse-card-heading"><div><p>LATEST RECORDS</p><h3>Recent trades</h3></div><Link href="/trades" aria-label="View all trades"><ArrowUpRight size={17} /></Link></div><div className="pulse-recent-list">{recent.length ? recent.map((trade) => <Link key={trade.id} href={`/trades/${trade.id}`} className="pulse-trade"><span className={trade.status === "Completed" ? trade.r_value > 0 ? "pulse-trade-icon is-win" : trade.r_value < 0 ? "pulse-trade-icon is-loss" : "pulse-trade-icon" : "pulse-trade-icon is-open"}>{trade.status === "Completed" ? trade.r_value < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} /> : <Activity size={16} />}</span><span><strong>{trade.pair}</strong><small>{trade.direction} · {trade.date}</small></span><span className="pulse-trade-result"><strong>{trade.status === "Completed" ? formatR(trade.r_value) : trade.status}</strong><small>{trade.status === "Completed" ? trade.result : "In progress"}</small></span></Link>) : <div className="pulse-recent-empty"><ClipboardList size={22} /><strong>No trades in this period</strong><span>Change the time range or record your first setup.</span></div>}</div></section></div>

    {trades.length > 0 && <><SectionHeading index="05 / PROCESS REVIEW" title="Find the lesson in the pattern" /><div className="pulse-process-grid"><DisciplineAnalysis criteriaMetR={metrics.criteriaMetR} brokenCriteriaR={metrics.brokenCriteriaR} /><StreakInsight trades={visible} /></div></>}
    <SectionHeading index="06 / GROWTH" title="Build beyond the numbers" /><div className="pulse-growth-grid"><DashboardPsychology trades={visible} /><DashboardRoadmap plan={growthPlan} /></div>
    {trades.length > 0 && <SeriesAnalytics trades={visible} />}
    <MarketSessionStatus compact />
  </div>;
}
