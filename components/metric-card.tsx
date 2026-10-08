import { clsx } from "clsx";
import { Activity, CircleAlert, TrendingDown, TrendingUp } from "lucide-react";

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
  const ToneIcon = tone === "good" ? TrendingUp : tone === "bad" ? TrendingDown : tone === "warn" ? CircleAlert : Activity;

  return (
    <div className={clsx("terminal-panel app-metric-card relative overflow-hidden rounded-lg p-4 sm:p-5", `metric-tone-${tone}`)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-terminal-muted">{label}</p>
        <span className={clsx("flex h-8 w-8 items-center justify-center rounded-full border border-terminal-line bg-terminal-panel2", toneClass)}><ToneIcon aria-hidden="true" className="h-4 w-4" /></span>
      </div>
      <p className={clsx("number mt-5 text-2xl font-semibold tracking-tight sm:text-[1.8rem]", toneClass)}>
        {value}
      </p>
    </div>
  );
}
