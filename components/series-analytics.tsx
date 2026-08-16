"use client";

import { useMemo, useState } from "react";
import { buildSeriesStats, formatR } from "@/lib/trades/calculations";
import type { Trade } from "@/types/trade";

const ranges: Array<number | "all"> = [5, 10, 20, 50, 100, "all"];

export function SeriesAnalytics({ trades }: { trades: Trade[] }) {
  const [range, setRange] = useState<number | "all">(20);
  const stats = useMemo(() => buildSeriesStats(trades, range), [range, trades]);
  return <section className="terminal-panel rounded-lg p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono text-xs uppercase text-terminal-cyan">series / process</p><h2 className="mt-1 text-xl font-semibold text-terminal-text">Performance by trade series</h2></div><div className="flex flex-wrap gap-2" role="group" aria-label="Trade series length">{ranges.map((value) => <button key={value} type="button" onClick={() => setRange(value)} className={`min-h-10 rounded border px-3 text-xs ${range === value ? "border-terminal-cyan bg-terminal-cyan/10 text-terminal-cyan" : "border-terminal-line text-terminal-muted hover:border-terminal-cyan"}`}>{value === "all" ? "All" : `${value}`}</button>)}</div></div><div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5"><div><p className="text-xs text-terminal-muted">Trades</p><p className="number mt-1 text-xl text-terminal-text">{stats.size}</p></div><div><p className="text-xs text-terminal-muted">Win rate</p><p className="number mt-1 text-xl text-terminal-text">{stats.winRate.toFixed(1)}%</p></div><div><p className="text-xs text-terminal-muted">Total R</p><p className="number mt-1 text-xl text-terminal-text">{formatR(stats.totalR)}</p></div><div><p className="text-xs text-terminal-muted">Avg R:R</p><p className="number mt-1 text-xl text-terminal-text">{stats.averageRiskReward.toFixed(2)}:1</p></div><div><p className="text-xs text-terminal-muted">Discipline</p><p className="number mt-1 text-xl text-terminal-text">{stats.disciplineScore.toFixed(0)}/100</p></div></div><p className="mt-4 text-xs text-terminal-muted">{stats.warnings} rule warning{stats.warnings === 1 ? "" : "s"} in this series · Expectancy {formatR(stats.expectancy)}</p></section>;
}
