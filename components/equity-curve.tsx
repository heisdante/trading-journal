"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { EquityPoint } from "@/types/trade";

export function EquityCurve({ data }: { data: EquityPoint[] }) {
  const lastPoint = data.at(-1);

  return (
    <div className="terminal-panel app-chart-panel h-[360px] rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase text-terminal-cyan">equity / curve</p>
          <h2 className="mt-1 text-base font-semibold text-terminal-text">Cumulative R</h2>
        </div>
        <span className="number rounded-sm border border-terminal-line bg-terminal-bg/70 px-2 py-1 text-xs text-terminal-muted">
          {lastPoint ? `${lastPoint.equity.toFixed(2)}R` : "no data"}
        </span>
      </div>
      {data.length ? (
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#1b3552" strokeDasharray="3 3" />
            <XAxis dataKey="label" stroke="#7f9bb2" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#7f9bb2" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "#0b1728",
                border: "1px solid #1b3552",
                borderRadius: 6,
                color: "#d5f3ff",
              }}
              formatter={(value) => [`${Number(value).toFixed(2)}R`, "Equity"]}
            />
            <Line type="monotone" dataKey="equity" stroke="#19d3ff" strokeWidth={2.5} dot={{ r: 3, fill: "#07111f", strokeWidth: 2 }} activeDot={{ r: 5 }} isAnimationActive animationDuration={700} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[280px] flex-col items-center justify-center rounded border border-dashed border-terminal-line bg-terminal-bg/45 text-center text-sm text-terminal-muted">
          <span className="text-terminal-text">No trades logged yet</span>
          <span className="mt-1 text-xs">Your equity line appears after the first saved trade.</span>
        </div>
      )}
    </div>
  );
}
