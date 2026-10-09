"use client";

import { useState } from "react";
import { QuickTradeCapture } from "@/components/quick-trade-capture";
import { TradeForm } from "@/components/trade-form";

export function TradeEntry({ defaults }: { defaults?: { market?: string | null; session?: string | null } }) {
  const [mode, setMode] = useState<"quick" | "guided">("quick");
  return mode === "quick"
    ? <QuickTradeCapture defaults={defaults} onGuided={() => setMode("guided")} />
    : <div className="mx-auto w-full max-w-5xl"><div className="mb-4 flex justify-end"><button type="button" onClick={() => setMode("quick")} className="rounded-xl bg-terminal-panel2 px-4 py-2 text-sm font-semibold text-terminal-cyan transition hover:bg-terminal-cyan/10">← Switch to quick capture</button></div><TradeForm defaults={defaults} /></div>;
}
