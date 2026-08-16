"use client";

import { useMemo, useState } from "react";
import { buildSeriesStats, formatR } from "@/lib/trades/calculations";
import type { Trade } from "@/types/trade";

const ranges: Array<number | "all"> = [5, 10, 20, 50, 100, "all"];

export function SeriesAnalytics({ trades }: { trades: Trade[] }) {
  const [range, setRange] = useState<number | "all">(20);
  const stats = useMemo(() => buildSeriesStats(trades, range), [range, trades]);
  return <section className="terminal-panel app-series-panel rounded-lg p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono text-xs uppercase text-terminal-cyan">series / process</p><h2 className="mt-1 text-xl font-semibold text-terminal-text">Performance by trade series</h2></div><div className="flex flex-wrap gap-2" role="group" aria-label="Trade series length">{ranges.map((value) => <button key={value} type="button" onClick={() => setRange(value)} className={`min-h-10 rounded border px-3 text-xs transition ${range === value ? "border-terminal-cyan bg-terminal-cyan/10 text-terminal-cyan shadow-glow" : "border-terminal-line text-terminal-muted hover:border-terminal-cyan hover:text-terminal-cyan"}`}>{value === "all" ? "All" : `${value}`}</button>)}</div></div><div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">{[["Trades", stats.size], ["Win rate", `${stats.winRate.toFixed(1)}%`], ["Total R", formatR(stats.totalR)], ["Avg R:R", `${stats.averageRiskReward.toFixed(2)}:1`], ["Discipline", `${stats.disciplineScore.toFixed(0)}/100`]].map(([label, value]) => <div key={label} className="series-stat rounded border border-terminal-line bg-terminal-bg/45 p-3"><p className="text-xs text-terminal-muted">{label}</p><p className="number mt-1 text-xl text-terminal-text">{value}</p></div>)}</div><p className="mt-4 text-xs text-terminal-muted">{stats.warnings} rule warning{stats.warnings === 1 ? "" : "s"} in this series - Expectancy {formatR(stats.expectancy)}</p></section>;
}
