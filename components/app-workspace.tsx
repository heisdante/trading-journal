"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, CircleDot } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { WorkspaceTour } from "@/components/workspace-tour";

export function AppWorkspace({ children, email, userId, tourPending }: { children: React.ReactNode; email: string; userId: string; tourPending: boolean }) {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter(Boolean);
  const activeLabel = pathSegments[0] === "trades" && pathSegments.length > 1
    ? "Trade review"
    : ({
      dashboard: "Overview", log: "Log a trade", trades: "Trade history", calculator: "Lot calculator",
      growth: "Growth roadmap", calendar: "Trading calendar", import: "Import trades", rules: "Trading rules",
      playbooks: "Playbooks", review: "Daily review", weekly: "Weekly debrief", coach: "Journal coach",
      report: "Reports", profile: "Settings", billing: "Billing",
    } as Record<string, string>)[pathSegments[0]] ?? "Workspace";
  const actionHref = pathname === "/log" ? "/dashboard" : "/log";

  return (
    <main className="app-shell min-h-dvh lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)]">
      <AppSidebar email={email} />
      <div className="workspace-main min-w-0 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
        <div className="workspace-inner mx-auto max-w-[1480px] space-y-6 lg:space-y-7">
          <div className="app-topbar flex min-h-[68px] items-center justify-between gap-4 rounded-[18px] px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-terminal-muted"><CircleDot className="h-3 w-3 text-terminal-green" />Workspace <span className="text-terminal-line">/</span> <span className="truncate text-terminal-cyan">{activeLabel}</span></p>
              <p className="mt-1 truncate text-xs text-terminal-muted">Your trading process, in one place</p>
            </div>
            <Link href={actionHref} className="app-topbar-action inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-semibold"><span className="hidden sm:inline">{pathname === "/log" ? "Back to overview" : "New trade"}</span><span className="sm:hidden">{pathname === "/log" ? "Overview" : "New"}</span><ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="space-y-6">{children}</div>
        </div>
      </div>
      <WorkspaceTour userId={userId} autoStart={tourPending} />
    </main>
  );
}
