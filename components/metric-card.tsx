import { clsx } from "clsx";

type MetricCardProps = {
  label: string;
  value: string;
  tone?: "default" | "good" | "bad" | "warn";
};

export function MetricCard({ label, value, tone = "default" }: MetricCardProps) {
  return (
    <div className="terminal-panel rounded-lg p-4">
      <p className="text-xs uppercase tracking-wider text-terminal-muted">{label}</p>
      <p
        className={clsx("number mt-3 text-2xl font-semibold", {
          "text-terminal-text": tone === "default",
          "text-terminal-green": tone === "good",
          "text-terminal-red": tone === "bad",
          "text-terminal-amber": tone === "warn",
        })}
      >
        {value}
      </p>
    </div>
  );
}
