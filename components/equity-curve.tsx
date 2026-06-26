"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { EquityPoint } from "@/types/trade";

export function EquityCurve({ data }: { data: EquityPoint[] }) {
  return (
    <div className="terminal-panel h-[360px] rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-terminal-text">Equity Curve</h2>
        <span className="font-mono text-xs text-terminal-muted">cumulative R</span>
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
            <Line type="monotone" dataKey="equity" stroke="#19d3ff" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[280px] items-center justify-center rounded border border-dashed border-terminal-line text-sm text-terminal-muted">
          No trades logged yet
        </div>
      )}
    </div>
  );
}
