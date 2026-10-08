"use client";

import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Trade } from "@/types/trade";

type DisplayMode = "r" | "percent";

export function EquityCurve({ trades }: { trades: Trade[] }) {
  const [mode, setMode] = useState<DisplayMode>("r");
  const chartData = useMemo(() => {
    const completed = trades
      .filter((trade) => trade.status === "Completed")
      .sort((a, b) => new Date(`${a.date}T00:00:00`).getTime() - new Date(`${b.date}T00:00:00`).getTime() || new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    let cumulativeR = 0;
    let cumulativeRiskPercent = 0;
    return completed.map((trade) => {
      cumulativeR += trade.r_value;
      if (trade.risk_percent !== null) cumulativeRiskPercent += trade.r_value * trade.risk_percent;
      return {
        label: new Date(`${trade.date}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        r: Number(cumulativeR.toFixed(2)),
        percent: Number(cumulativeRiskPercent.toFixed(2)),
      };
    });
  }, [trades]);

  const valueKey = mode === "r" ? "r" : "percent";
  const lastPoint = chartData.at(-1);
  const missingRiskCount = trades.filter((trade) => trade.status === "Completed" && trade.risk_percent === null).length;

  return (
    <section className="terminal-panel app-chart-panel flex min-h-[360px] flex-col rounded-2xl p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-terminal-cyan">Performance / over time</p>
          <h2 className="mt-1 text-base font-semibold text-terminal-text">Cumulative return</h2>
        </div>
        <div className="flex items-center gap-3">
          {lastPoint && <span className="number text-sm font-semibold text-terminal-text">{mode === "r" ? `${lastPoint.r >= 0 ? "+" : ""}${lastPoint.r.toFixed(2)}R` : `${lastPoint.percent >= 0 ? "+" : ""}${lastPoint.percent.toFixed(2)}%`}</span>}
          <div className="dashboard-range-group flex rounded-xl p-1" role="group" aria-label="Equity chart unit">
            <button type="button" aria-pressed={mode === "r"} onClick={() => setMode("r")} className={`min-h-8 rounded-lg px-3 text-xs font-semibold ${mode === "r" ? "dashboard-range-active" : "text-terminal-muted hover:text-terminal-text"}`}>R</button>
            <button type="button" aria-pressed={mode === "percent"} onClick={() => setMode("percent")} className={`min-h-8 rounded-lg px-3 text-xs font-semibold ${mode === "percent" ? "dashboard-range-active" : "text-terminal-muted hover:text-terminal-text"}`}>Risk %</button>
          </div>
        </div>
      </div>
      {chartData.length ? (
        <>
          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={chartData} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
              <CartesianGrid stroke="var(--terminal-line)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" stroke="var(--terminal-muted)" fontSize={11} tickLine={false} axisLine={false} minTickGap={28} />
              <YAxis stroke="var(--terminal-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => mode === "r" ? `${value}R` : `${value}%`} />
              <Tooltip
                contentStyle={{ background: "var(--terminal-panel)", border: "1px solid var(--terminal-line)", borderRadius: 12, color: "var(--terminal-text)" }}
                formatter={(value) => [mode === "r" ? `${Number(value).toFixed(2)}R` : `${Number(value).toFixed(2)}%`, mode === "r" ? "Cumulative R" : "Risk-weighted return"]}
              />
              <Line key={mode} type="monotone" dataKey={valueKey} stroke="var(--terminal-green)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "var(--terminal-green)", stroke: "var(--terminal-panel)", strokeWidth: 2 }} isAnimationActive animationDuration={650} />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-auto pt-2 text-xs text-terminal-muted">{mode === "r" ? "Each completed trade adds its R multiple to the curve." : `R × planned risk percent, summed across trades.${missingRiskCount ? ` ${missingRiskCount} trade${missingRiskCount === 1 ? "" : "s"} without recorded risk excluded.` : ""}`}</p>
        </>
      ) : (
        <div className="flex min-h-[270px] flex-1 flex-col items-center justify-center rounded-2xl bg-terminal-bg/45 text-center">
          <span className="text-sm font-semibold text-terminal-text">No completed trades in this window</span>
          <span className="mt-1 text-xs text-terminal-muted">Your curve will update as you close and review trades.</span>
        </div>
      )}
    </section>
  );
}
