"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity, BookOpenCheck, BotMessageSquare, CalendarDays, Calculator, ChevronLeft,
  ChevronRight, ClipboardList, CreditCard, FileOutput, FileUp, LayoutDashboard,
  ListChecks, Menu, Plus, RotateCcw, Settings2, Target, X,
} from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";

type NavigationItem = { href: string; label: string; icon: LucideIcon };

const navigation: Array<{ label: string; items: NavigationItem[] }> = [
  { label: "Trading desk", items: [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/log", label: "Log a trade", icon: Plus },
    { href: "/trades", label: "Trade history", icon: ClipboardList },
    { href: "/calendar", label: "Calendar", icon: CalendarDays },
  ] },
  { label: "Plan & tools", items: [
    { href: "/calculator", label: "Lot calculator", icon: Calculator },
    { href: "/growth", label: "Growth roadmap", icon: Target },
    { href: "/import", label: "Import trades", icon: FileUp },
  ] },
  { label: "Review & learn", items: [
    { href: "/rules", label: "Trading rules", icon: ListChecks },
    { href: "/playbooks", label: "Playbooks", icon: BookOpenCheck },
    { href: "/review", label: "Daily review", icon: RotateCcw },
    { href: "/weekly", label: "Weekly debrief", icon: CalendarDays },
    { href: "/coach", label: "Journal coach", icon: BotMessageSquare },
    { href: "/report", label: "Reports", icon: FileOutput },
  ] },
];

type SidebarContentProps = {
  email: string;
  collapsed?: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
  onToggle?: () => void;
};

function SidebarContent({ email, collapsed = false, mobile = false, onNavigate, onToggle }: SidebarContentProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`));

  return (
    <div className="app-sidebar flex h-full min-h-0 flex-col">
      <div className={`sidebar-brand ${collapsed ? "is-collapsed" : ""}`}>
        <div className="flex items-center justify-between gap-2">
          <Link href="/dashboard" onClick={onNavigate} aria-label="Trading Journal overview" className="sidebar-brand-link">
            <span className="sidebar-brand-icon"><Activity className="h-5 w-5" /></span>
            <span className={collapsed ? "sr-only" : "sidebar-brand-name"}>Trading Journal</span>
          </Link>
          {!mobile && !collapsed && <button type="button" onClick={onToggle} className="sidebar-icon-button" aria-label="Collapse navigation" title="Collapse navigation"><ChevronLeft className="h-4 w-4" /></button>}
        </div>
        {!collapsed && <div className="sidebar-account-identity"><span className="sidebar-avatar">{email.slice(0, 1).toUpperCase()}</span><span className="min-w-0"><span className="block truncate text-xs font-semibold text-white">{email}</span><span className="mt-0.5 block text-[10px] text-white/50">PRIVATE WORKSPACE</span></span></div>}
        {collapsed && !mobile && <button type="button" onClick={onToggle} className="sidebar-icon-button mx-auto mt-4" aria-label="Expand navigation" title="Expand navigation"><ChevronRight className="h-4 w-4" /></button>}
      </div>

      <nav className="sidebar-nav flex-1 overflow-y-auto" aria-label="Workspace navigation">
        {navigation.map((group) => (
          <section key={group.label} className="sidebar-nav-group">
            <h2 className={collapsed ? "sr-only" : "sidebar-nav-heading"}>{group.label}</h2>
            <div className="space-y-1">
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onNavigate}
                    title={collapsed ? label : undefined}
                    aria-label={collapsed ? label : undefined}
                    aria-current={active ? "page" : undefined}
                    className={`app-nav-link ${active ? "is-active" : ""} ${collapsed ? "is-collapsed" : ""}`}
                  >
                    <span className="app-nav-icon"><Icon className="h-[17px] w-[17px]" strokeWidth={1.8} /></span>
                    <span className={collapsed ? "sr-only" : "truncate"}>{label}</span>
                    {active && !collapsed && <span aria-hidden="true" className="app-nav-indicator" />}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && <p className="sidebar-nav-heading">Account</p>}
        <Link href="/profile" onClick={onNavigate} title={collapsed ? "Settings" : undefined} aria-label={collapsed ? "Settings" : undefined} className={`app-nav-link ${isActive("/profile") ? "is-active" : ""} ${collapsed ? "is-collapsed" : ""}`}><span className="app-nav-icon"><Settings2 className="h-[17px] w-[17px]" strokeWidth={1.8} /></span><span className={collapsed ? "sr-only" : "truncate"}>Settings</span></Link>
        <Link href="/billing" onClick={onNavigate} title={collapsed ? "Billing" : undefined} aria-label={collapsed ? "Billing" : undefined} className={`app-nav-link ${isActive("/billing") ? "is-active" : ""} ${collapsed ? "is-collapsed" : ""}`}><span className="app-nav-icon"><CreditCard className="h-[17px] w-[17px]" strokeWidth={1.8} /></span><span className={collapsed ? "sr-only" : "truncate"}>Billing</span></Link>
        <div className={`sidebar-footer-actions ${collapsed ? "is-collapsed" : ""}`}><ThemeToggle compact={collapsed} /><LogoutButton compact={collapsed} /></div>
      </div>
    </div>
  );
}

export function AppSidebar({ email, collapsed, onCollapsedChange }: { email: string; collapsed: boolean; onCollapsedChange: (value: boolean) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <aside className="app-sidebar-rail sticky top-0 hidden h-dvh lg:block">
        <SidebarContent email={email} collapsed={collapsed} onToggle={() => onCollapsedChange(!collapsed)} />
      </aside>
      <header className="app-mobile-header sticky top-0 z-30 flex h-16 items-center justify-between px-4 lg:hidden">
        <Link href="/dashboard" className="sidebar-brand-link"><span className="sidebar-brand-icon"><Activity className="h-5 w-5" /></span><span className="font-semibold text-white">Trading Journal</span></Link>
        <div className="flex items-center gap-2"><ThemeToggle compact /><button type="button" onClick={() => setOpen(true)} aria-label="Open navigation" className="sidebar-icon-button"><Menu className="h-5 w-5" /></button></div>
      </header>
      {open && <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Workspace navigation"><button type="button" aria-label="Close navigation" onClick={() => setOpen(false)} className="app-drawer-scrim absolute inset-0" /><aside className="app-drawer relative h-dvh w-[min(20rem,88vw)]"><button type="button" aria-label="Close navigation" onClick={() => setOpen(false)} className="sidebar-icon-button absolute right-3 top-3 z-10"><X className="h-5 w-5" /></button><SidebarContent email={email} mobile onNavigate={() => setOpen(false)} /></aside></div>}
    </>
  );
}
