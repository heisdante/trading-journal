import Link from "next/link";
import { ArrowUpRight, CalendarDays, Target } from "lucide-react";
import type { GrowthPlan } from "@/types/trade";

type DashboardPlan = Pick<GrowthPlan, "id" | "title" | "account_type" | "starting_balance" | "target_balance" | "currency" | "risk_percent" | "deadline" | "milestones">;

const roadmapPhoto = "https://images.unsplash.com/photo-1770681381576-f1fdceb2ea01?auto=format&fit=crop&w=1200&q=80";

export function DashboardRoadmap({ plan }: { plan: DashboardPlan | null }) {
  const uplift = plan && Number(plan.starting_balance) > 0
    ? (Number(plan.target_balance) / Number(plan.starting_balance) - 1) * 100
    : null;
  const targetUplift = uplift === null ? null : `${uplift > 0 ? "+" : ""}${uplift.toFixed(1)}%`;
  const firstMilestone = plan?.milestones.split("\n").map((item) => item.trim()).find(Boolean);

  return (
    <section className="dashboard-roadmap terminal-panel overflow-hidden rounded-2xl">
      <div className="dashboard-roadmap-image relative flex min-h-48 flex-col justify-end overflow-hidden p-5 sm:min-h-56 sm:p-7">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-[1.03]" style={{ backgroundImage: `url("${roadmapPhoto}")` }} role="img" aria-label="A laptop, notebook, and coffee on a desk while planning a work goal" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 max-w-xl text-white"><span className="inline-flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/85"><Target className="h-3.5 w-3.5 text-[#a6d9ae]" />Growth / roadmap</span><h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">Build toward a goal you chose.</h2><p className="mt-2 max-w-md text-sm leading-6 text-white/75">Give your next account milestone a plan, a risk limit, and a process you can review.</p></div>
      </div>
      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        {plan ? (
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-terminal-cyan">Active / {plan.account_type}</p>
            <h3 className="mt-1 text-lg font-semibold text-terminal-text">{plan.title}</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:max-w-xl sm:grid-cols-3">
              <div className="rounded-xl bg-terminal-panel2 p-3"><p className="text-xs text-terminal-muted">Growth target</p><p className="number mt-1 text-lg font-semibold text-terminal-text">{targetUplift}</p></div>
              <div className="rounded-xl bg-terminal-panel2 p-3"><p className="text-xs text-terminal-muted">Risk per trade</p><p className="number mt-1 text-lg font-semibold text-terminal-text">{Number(plan.risk_percent)}%</p></div>
              <div className="col-span-2 rounded-xl bg-terminal-panel2 p-3 sm:col-span-1"><p className="text-xs text-terminal-muted">Next milestone</p><p className="mt-1 line-clamp-2 text-sm font-medium text-terminal-text">{firstMilestone ?? "Add your first milestone"}</p></div>
            </div>
            {plan.deadline && <p className="mt-3 flex items-center gap-2 text-xs text-terminal-muted"><CalendarDays className="h-3.5 w-3.5" />Target date {plan.deadline}</p>}
          </div>
        ) : (
          <div><p className="font-mono text-[10px] uppercase tracking-[0.13em] text-terminal-cyan">Start with intention</p><h3 className="mt-1 text-lg font-semibold text-terminal-text">No active roadmap yet</h3><p className="mt-2 max-w-xl text-sm leading-6 text-terminal-muted">Choose a prop evaluation or personal account target, then define risk and milestones that keep the plan grounded in your process.</p><div className="mt-4 flex flex-wrap gap-2 text-xs text-terminal-muted"><span className="rounded-full bg-terminal-panel2 px-3 py-1.5">01 · Account path</span><span className="rounded-full bg-terminal-panel2 px-3 py-1.5">02 · Risk boundary</span><span className="rounded-full bg-terminal-panel2 px-3 py-1.5">03 · Milestones</span></div></div>
        )}
        <Link href="/growth" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-terminal-cyan px-4 text-sm font-semibold text-terminal-bg transition hover:-translate-y-0.5 hover:bg-terminal-green">{plan ? "Open roadmap" : "Create roadmap"}<ArrowUpRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}
