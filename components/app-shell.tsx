import Link from "next/link";
import { Activity, ClipboardList, LayoutDashboard, PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/log", label: "Log Trade", icon: PlusCircle },
  { href: "/trades", label: "Trades", icon: ClipboardList },
];

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="terminal-panel flex flex-col gap-4 rounded-lg p-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded border border-terminal-cyan/40 bg-terminal-cyan/10 text-terminal-cyan shadow-glow">
              <Activity className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-lg font-semibold tracking-wide text-terminal-text">Trading Journal</span>
              <span className="block text-xs text-terminal-muted">{user?.email ?? "terminal session"}</span>
            </span>
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex h-10 items-center gap-2 rounded border border-terminal-line px-3 text-sm text-terminal-muted transition hover:border-terminal-cyan hover:text-terminal-cyan"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
            <LogoutButton />
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
