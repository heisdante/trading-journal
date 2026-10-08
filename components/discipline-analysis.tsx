"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type DisciplineAnalysisProps = {
  criteriaMetR: number;
  brokenCriteriaR: number;
};

export function DisciplineAnalysis({ criteriaMetR, brokenCriteriaR }: DisciplineAnalysisProps) {
  const data = [
    { name: "Criteria met", value: Number(criteriaMetR.toFixed(2)), color: "var(--terminal-green)" },
    { name: "Broken criteria", value: Number(brokenCriteriaR.toFixed(2)), color: "var(--terminal-red)" },
  ];

  return (
    <div className="terminal-panel app-chart-panel h-[360px] rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase text-terminal-cyan">discipline / adherence</p>
          <h2 className="mt-1 text-base font-semibold text-terminal-text">Rule impact</h2>
        </div>
        <span className="font-mono text-xs text-terminal-muted">total R</span>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="var(--terminal-line)" strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="var(--terminal-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--terminal-muted)" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: "var(--terminal-panel)",
              border: "1px solid var(--terminal-line)",
              borderRadius: 12,
              color: "var(--terminal-text)",
            }}
            formatter={(value) => [`${Number(value).toFixed(2)}R`, "Total R"]}
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
