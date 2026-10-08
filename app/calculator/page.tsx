import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { LotSizeCalculator } from "@/components/lot-size-calculator";

export default function CalculatorPage() { return <AppShell><header className="app-surface border-b border-terminal-line/70 pb-5"><p className="font-mono text-xs uppercase text-terminal-cyan">tools / risk first</p><h1 className="mt-2 text-3xl font-semibold">Forex lot size calculator</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-terminal-muted">Size the position from your account risk and the distance between entry and stop. A planned risk amount is a ceiling, not a promise of the final loss.</p></header><LotSizeCalculator /><p className="text-sm text-terminal-muted">Ready to journal the setup? <Link className="text-terminal-cyan hover:text-cyan-300" href="/log">Log a trade →</Link></p></AppShell>; }
