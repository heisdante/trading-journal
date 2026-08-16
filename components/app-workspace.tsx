"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";

export function AppWorkspace({ children, email }: { children: React.ReactNode; email: string }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem("trading-journal-sidebar-collapsed") === "true");
  }, []);

  function setSidebarCollapsed(next: boolean) {
    setCollapsed(next);
    window.localStorage.setItem("trading-journal-sidebar-collapsed", String(next));
  }

  return <main className={`min-h-dvh lg:grid ${collapsed ? "lg:grid-cols-[4.75rem_minmax(0,1fr)]" : "lg:grid-cols-[16rem_minmax(0,1fr)]"}`}><AppSidebar email={email} collapsed={collapsed} onCollapsedChange={setSidebarCollapsed} /><div className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"><div className="mx-auto max-w-7xl space-y-6">{children}</div></div></main>;
}
