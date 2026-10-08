import Link from "next/link";
import { Brain, ArrowRight } from "lucide-react";
import type { Trade } from "@/types/trade";

export function DashboardPsychology({ trades }: { trades: Trade[] }) {
  const journalPhoto = "https://images.unsplash.com/photo-1558478551-aca3709bb312?auto=format&fit=crop&w=1000&q=82";
  const recorded = trades.filter((trade) => trade.status === "Completed" && trade.emotion);
  const counts = new Map<string, number>();
  recorded.forEach((trade) => counts.set(trade.emotion!, (counts.get(trade.emotion!) ?? 0) + 1));
  const distribution = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const maxCount = distribution[0]?.[1] ?? 1;
  const mostRecorded = distribution[0];

  return (
    <section className="terminal-panel rounded-2xl p-5 sm:p-6">
      <div className="flex items-start gap-3"><span className="rounded-xl bg-terminal-cyan/10 p-2.5 text-terminal-cyan"><Brain className="h-5 w-5" /></span><div><p className="font-mono text-xs uppercase tracking-[0.14em] text-terminal-cyan">Psychology / awareness</p><h2 className="mt-1 text-lg font-semibold text-terminal-text">Your state of mind, in context</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-terminal-muted">Use these notes as prompts for reflection, not diagnosis. Review emotions alongside execution and setup quality.</p></div></div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_.85fr]">
        <div className="rounded-2xl bg-terminal-bg/55 p-4 sm:p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div className="flex items-start gap-3"><span className="rounded-xl bg-terminal-cyan/10 p-2 text-terminal-cyan"><Brain className="h-4 w-4" /></span><div><p className="font-mono text-[10px] uppercase tracking-[0.13em] text-terminal-cyan">Completed trades / emotional context</p><p className="mt-1 text-sm text-terminal-muted">{recorded.length} of {trades.filter((trade) => trade.status === "Completed").length} completed trades include a recorded emotion.</p></div></div>{mostRecorded && <span className="rounded-full bg-terminal-panel2 px-3 py-1.5 text-xs text-terminal-text">Most logged: <strong>{mostRecorded[0]}</strong></span>}</div>
          {distribution.length ? (
            <div className="grid gap-2 sm:grid-cols-2">{distribution.slice(0, 6).map(([emotion, count]) => <div key={emotion} className="rounded-xl bg-terminal-panel p-3"><div className="flex items-center justify-between gap-3 text-sm"><span className="font-medium text-terminal-text">{emotion}</span><span className="number text-xs text-terminal-muted">{count}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-terminal-panel2"><div className="h-full rounded-full bg-terminal-green transition-[width] duration-500" style={{ width: `${Math.max(8, (count / maxCount) * 100)}%` }} /></div></div>)}</div>
          ) : (
            <div className="flex min-h-28 flex-col items-start justify-center gap-3 rounded-xl bg-terminal-panel p-4"><p className="max-w-lg text-sm text-terminal-muted">No emotions recorded in this time window. A quick state check can help reveal patterns before they repeat.</p><Link href="/log" className="inline-flex min-h-9 items-center gap-2 text-sm font-semibold text-terminal-cyan hover:text-terminal-green">Add a reflection<ArrowRight className="h-4 w-4" /></Link></div>
          )}
        </div>
        <div className="dashboard-psychology-photo relative isolate flex min-h-64 flex-col justify-between overflow-hidden rounded-2xl p-5 text-white sm:p-6">
          <div className="absolute inset-0 -z-20 bg-cover bg-center transition-transform duration-700 hover:scale-[1.03]" style={{ backgroundImage: `url("${journalPhoto}")` }} role="img" aria-label="A trader taking a quiet moment to write in a journal" />
          <div className="absolute inset-0 -z-10 bg-black/55" />
          <span className="w-fit rounded-full bg-black/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/85">Before the next setup</span>
          <div><h3 className="max-w-sm text-xl font-semibold leading-tight">What are you bringing into this trade?</h3><p className="mt-2 max-w-sm text-sm leading-6 text-white/75">Pause. Name the feeling. Separate what you see from what you hope.</p><Link href="/log" className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-full bg-white/90 px-4 text-sm font-semibold text-[#181b18] transition hover:bg-white">Start a check-in<ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </div>
    </section>
  );
}
