"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, CircleDot } from "lucide-react";
import { AppMotion } from "@/components/app-motion";
import { AppSidebar } from "@/components/app-sidebar";

export function AppWorkspace({ children, email }: { children: React.ReactNode; email: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setCollapsed(window.localStorage.getItem("trading-journal-sidebar-collapsed") === "true");
  }, []);

  function setSidebarCollapsed(next: boolean) {
    setCollapsed(next);
    window.localStorage.setItem("trading-journal-sidebar-collapsed", String(next));
  }

  const pathSegments = pathname.split("/").filter(Boolean);
  const activeLabel = pathSegments.length > 1 && pathSegments[0] === "trades"
    ? "trade detail"
    : pathSegments.at(-1)?.replaceAll("-", " ") ?? "workspace";

  return (
    <main className={`app-shell min-h-dvh lg:grid ${collapsed ? "lg:grid-cols-[4.75rem_minmax(0,1fr)]" : "lg:grid-cols-[16rem_minmax(0,1fr)]"}`}>
      <AppMotion />
      <AppSidebar email={email} collapsed={collapsed} onCollapsedChange={setSidebarCollapsed} />
      <div className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="app-topbar flex min-h-14 items-center justify-between gap-4 rounded-2xl px-4 py-2.5 sm:px-5">
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.17em] text-terminal-muted"><CircleDot className="h-3 w-3 text-terminal-green" />Private journal <span className="text-terminal-line">/</span> Workspace</p>
              <p className="mt-0.5 truncate text-sm font-semibold capitalize text-terminal-text">{activeLabel}</p>
            </div>
            <Link href="/log" className="app-topbar-action inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold"><span className="hidden sm:inline">Capture a trade</span><span className="sm:hidden">New trade</span><ArrowUpRight className="h-4 w-4" /></Link>
          </div>
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
