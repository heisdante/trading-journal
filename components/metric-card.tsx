import { clsx } from "clsx";

type MetricCardProps = {
  label: string;
  value: string;
  tone?: "default" | "good" | "bad" | "warn";
};

export function MetricCard({ label, value, tone = "default" }: MetricCardProps) {
  const toneClass = {
    default: "text-terminal-text",
    good: "text-terminal-green",
    bad: "text-terminal-red",
    warn: "text-terminal-amber",
  }[tone];

  return (
    <div className="terminal-panel app-metric-card relative overflow-hidden rounded-lg p-4">
      <p className="text-xs uppercase tracking-wider text-terminal-muted">{label}</p>
      <p className={clsx("number mt-3 text-2xl font-semibold", toneClass)}>
        {value}
      </p>
      <div className="mt-4 flex h-7 items-end gap-1" aria-hidden="true">
        {[38, 54, 42, 68, 58, 84, 72].map((height, index) => (
          <span
            key={`${label}-${height}-${index}`}
            className={clsx("metric-spark flex-1 rounded-t-sm", {
              "bg-terminal-cyan/45": tone === "default",
              "bg-terminal-green/45": tone === "good",
              "bg-terminal-red/45": tone === "bad",
              "bg-terminal-amber/45": tone === "warn",
            })}
            style={{ height: `${height}%`, animationDelay: `${index * 45}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
