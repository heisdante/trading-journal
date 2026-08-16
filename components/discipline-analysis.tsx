"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type DisciplineAnalysisProps = {
  criteriaMetRate: number;
  brokenCriteriaRate: number;
};

export function DisciplineAnalysis({ criteriaMetRate, brokenCriteriaRate }: DisciplineAnalysisProps) {
  const data = [
    { name: "Criteria met", value: Number(criteriaMetRate.toFixed(1)), color: "#35f29a" },
    { name: "Broken criteria", value: Number(brokenCriteriaRate.toFixed(1)), color: "#ff5b7c" },
  ];

  return (
    <div className="terminal-panel app-chart-panel h-[360px] rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase text-terminal-cyan">discipline / adherence</p>
          <h2 className="mt-1 text-base font-semibold text-terminal-text">Rule impact</h2>
        </div>
        <span className="font-mono text-xs text-terminal-muted">win %</span>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#1b3552" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#7f9bb2" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#7f9bb2" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "#0b1728",
              border: "1px solid #1b3552",
              borderRadius: 6,
              color: "#d5f3ff",
            }}
            formatter={(value) => [`${Number(value).toFixed(1)}%`, "Win rate"]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={650}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
