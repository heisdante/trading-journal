"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type DisciplineAnalysisProps = {
  criteriaMetR: number;
  brokenCriteriaR: number;
};

export function DisciplineAnalysis({ criteriaMetR, brokenCriteriaR }: DisciplineAnalysisProps) {
  const data = [
    { name: "Criteria met", value: Number(criteriaMetR.toFixed(2)), color: "#35f29a" },
    { name: "Broken criteria", value: Number(brokenCriteriaR.toFixed(2)), color: "#ff5b7c" },
  ];

  return (
    <div className="terminal-panel h-[360px] rounded-lg p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-terminal-text">Discipline Analysis</h2>
        <span className="font-mono text-xs text-terminal-muted">R by rule adherence</span>
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
            formatter={(value) => [`${Number(value).toFixed(2)}R`, "Total"]}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
