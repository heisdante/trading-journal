import Link from "next/link";
import { ArrowUpRight, LineChart } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return <main className="public-shell min-h-dvh text-terminal-text">
    <header className="border-b border-terminal-line">
      <div className="mx-auto flex min-h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex min-h-11 items-center gap-2.5 font-semibold tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl border border-terminal-line bg-terminal-panel2 text-terminal-cyan"><LineChart className="h-4 w-4" /></span>Trading Journal</Link>
        <nav aria-label="Main navigation" className="flex items-center gap-3 sm:gap-5"><ThemeToggle /><Link href="/help" className="hidden text-sm text-terminal-muted transition hover:text-terminal-text sm:inline">Help</Link><Link href="/login" className="min-h-10 inline-flex items-center px-2 text-sm text-terminal-muted transition hover:text-terminal-text">Sign in</Link><Link href="/signup" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-terminal-cyan px-4 text-sm font-semibold text-terminal-bg transition hover:-translate-y-0.5">Create account <ArrowUpRight className="h-4 w-4" /></Link></nav>
      </div>
    </header>
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">{children}</div>
    <footer className="border-t border-terminal-line bg-terminal-panel">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-7 text-sm text-terminal-muted sm:flex-row sm:items-center sm:justify-between sm:px-6"><span>Trading Journal · Grow as you execute and journal.</span><nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2"><Link href="/help" className="transition hover:text-terminal-text">Help center</Link><Link href="/contact" className="transition hover:text-terminal-text">Contact</Link><Link href="/legal/terms" className="transition hover:text-terminal-text">Terms</Link><Link href="/legal/privacy" className="transition hover:text-terminal-text">Privacy</Link><Link href="/legal/risk-disclosure" className="transition hover:text-terminal-text">Risk disclosure</Link></nav></div>
    </footer>
  </main>;
}
