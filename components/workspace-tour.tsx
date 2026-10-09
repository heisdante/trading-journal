"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const steps = [
  { group: "Welcome", title: "See how your journal works", detail: "A short guide to capturing an idea, saving a trade, and learning from the outcome.", how: "Watch the walkthrough, then move through the feature tour at your own pace.", cue: "Your trading second brain", video: true },
  { group: "Trading desk", title: "Overview", detail: "Your command center for trading activity, consistency, and the next action to take.", how: "Start here to see recent trades, performance, and your current growth plan.", cue: "See the whole picture" },
  { group: "Trading desk", title: "Log a trade", detail: "Capture an idea before entry, then update it as the setup becomes a live trade and closes.", how: "Use Quick capture to paste a link and refine an AI draft, or switch to the guided journal. Confirm the details before saving. Add the outcome and reflection later.", cue: "Plan → execute → reflect" },
  { group: "Trading desk", title: "Trade history", detail: "Every saved setup and finished trade lives here, ready for a closer look.", how: "Open a trade to review the decision, result, notes, and lessons you recorded.", cue: "Your evidence library" },
  { group: "Trading desk", title: "Calendar", detail: "See your trading days and results over time, not just as isolated wins and losses.", how: "Select a day to revisit its trades and spot patterns in your routine.", cue: "Find your rhythm" },
  { group: "Plan & tools", title: "Lot calculator", detail: "Size a position before committing capital.", how: "Enter the pair, entry, stop loss, and account risk to estimate an appropriate lot size.", cue: "Risk first" },
  { group: "Plan & tools", title: "Growth roadmap", detail: "Give your trading a destination and a practical path toward it.", how: "Set your account route, target, milestones, and the habits you will follow.", cue: "Build with intention" },
  { group: "Plan & tools", title: "Import trades", detail: "Bring existing trading records into your journal.", how: "Upload the supported trade file, check the preview, then import when the details look right.", cue: "Keep your history together" },
  { group: "Review & learn", title: "Trading rules", detail: "Write down the standards that define a trade worth taking.", how: "Use your rules before entries and revisit them when reviewing decisions.", cue: "Protect your process" },
  { group: "Review & learn", title: "Playbooks", detail: "Turn repeatable setups into clear plans you can recognize again.", how: "Document the context, entry conditions, and management approach for each setup.", cue: "Know your edge" },
  { group: "Review & learn", title: "Daily review", detail: "Close each session with a short, honest reflection.", how: "Record what went well, what needs attention, and how your mind affected execution.", cue: "Learn each day" },
  { group: "Review & learn", title: "Weekly debrief", detail: "Zoom out from individual trades to see broader behavior.", how: "Review the week’s results, recurring mistakes, and one adjustment for next week.", cue: "See the pattern" },
  { group: "Review & learn", title: "Journal coach", detail: "Use your journal to surface questions and blind spots in your process.", how: "Read its prompts alongside your own notes, then decide what to work on next.", cue: "Think more clearly" },
  { group: "Review & learn", title: "Reports", detail: "Measure the progress behind the outcome.", how: "Compare performance and process trends across your recorded trades.", cue: "Measure your growth" },
  { group: "Account", title: "Settings & billing", detail: "Keep your account details and subscription in one place.", how: "Use Settings for your profile and Billing for plan information.", cue: "Make it yours" },
];

export function WorkspaceTour({ userId, autoStart }: { userId: string; autoStart: boolean }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const storageKey = `trading-journal:tour-v1:${userId}`;

  useEffect(() => {
    if (autoStart && userId && window.localStorage.getItem(storageKey) !== "seen") {
      setIndex(0);
      setOpen(true);
    }
    const replay = () => { setIndex(0); setOpen(true); };
    window.addEventListener("trading-journal:open-tour", replay);
    return () => window.removeEventListener("trading-journal:open-tour", replay);
  }, [autoStart, storageKey, userId]);

  const closeTour = useCallback(async () => {
    setOpen(false);
    if (!userId || !autoStart || window.localStorage.getItem(storageKey) === "seen") return;
    window.localStorage.setItem(storageKey, "seen");
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase.auth.updateUser({ data: { trading_journal_tour: "seen" } });
    } catch {
      // The local preference still prevents the tour from interrupting this device.
    } finally {
      setSaving(false);
    }
  }, [autoStart, storageKey, userId]);

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector("button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); void closeTour(); }
      if (event.key === "Tab" && dialogRef.current) {
        const buttons = Array.from(dialogRef.current.querySelectorAll<HTMLButtonElement>("button:not([disabled])"));
        if (!buttons.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocus.current?.focus();
    };
  }, [open, closeTour]);

  if (!open) return null;
  const step = steps[index];
  const last = index === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020704]/85 p-3 backdrop-blur-md sm:p-6">
      <div ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-description" className="relative grid max-h-[calc(100dvh-24px)] w-full max-w-[800px] overflow-y-auto rounded-[24px] bg-terminal-panel text-terminal-text shadow-[0_30px_90px_rgba(0,0,0,.4)] outline-none sm:max-h-[calc(100dvh-48px)] sm:grid-cols-[210px_minmax(0,1fr)]">
        <div className="hidden bg-[#0c2114] p-7 sm:flex sm:flex-col">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#173e29] text-terminal-cyan"><Sparkles className="h-5 w-5" /></span>
          <p className="mt-7 font-mono text-[10px] uppercase tracking-[.18em] text-terminal-cyan">Trading Journal</p>
          <p className="mt-3 text-[23px] font-semibold leading-tight tracking-[-.04em] text-white">Make every trade a lesson.</p>
          <p className="mt-auto pt-10 text-xs leading-5 text-[#9bb5a1]">A quick tour of the tools that help you plan, execute, and reflect.</p>
        </div>
        <div className="flex min-h-[435px] flex-col p-5 sm:min-h-[470px] sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[.18em] text-terminal-cyan">{step.group} <span className="text-terminal-muted">/ {String(index + 1).padStart(2, "0")} of {steps.length}</span></span>
            <button type="button" onClick={() => void closeTour()} aria-label="Skip tour" className="inline-flex h-9 w-9 items-center justify-center rounded-full text-terminal-muted transition hover:bg-terminal-panel2 hover:text-terminal-text"><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-5 flex gap-1" role="progressbar" aria-label="Tour progress" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={steps.length}>
            {steps.map((item, itemIndex) => <span key={item.title} className={`h-1 flex-1 rounded-full ${itemIndex <= index ? "bg-terminal-cyan" : "bg-terminal-line"}`} />)}
          </div>
          <div aria-live="polite" className="flex flex-1 flex-col justify-center py-7">
            <p className="font-mono text-[10px] uppercase tracking-[.18em] text-terminal-muted">{step.cue}</p>
            <h2 id="tour-title" className="mt-3 text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.04] tracking-[-.055em]">{step.title}</h2>
            <p id="tour-description" className="mt-4 max-w-[480px] text-sm leading-6 text-terminal-muted">{step.detail}</p>
            {"video" in step && step.video && <video controls playsInline preload="metadata" poster="/videos/journal-guide-poster.png" aria-label="How the trading journal works" className="mt-5 aspect-video w-full rounded-xl bg-[#07130b]"><source src="/videos/trading-journal-guide.mp4" type="video/mp4" />Your browser does not support this video.</video>}
            <div className="mt-5 rounded-[16px] bg-terminal-panel2 px-4 py-4">
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-terminal-cyan">How to use it</p>
              <p className="mt-2 text-sm leading-6 text-terminal-text">{step.how}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={() => void closeTour()} className="min-h-10 px-1 text-xs font-medium text-terminal-muted transition hover:text-terminal-text">Skip tour</button>
            <div className="flex items-center gap-2">
              {index > 0 && <button type="button" onClick={() => setIndex(index - 1)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-terminal-panel2 px-4 text-sm font-medium transition hover:bg-terminal-line"><ArrowLeft className="h-4 w-4" /> Back</button>}
              <button type="button" onClick={() => last ? void closeTour() : setIndex(index + 1)} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-terminal-cyan px-5 text-sm font-semibold text-[#07110a] transition hover:brightness-110">{last ? "Start journaling" : "Next"}{last ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}</button>
            </div>
          </div>
        </div>
      </div>
      <span className="sr-only" aria-live="polite">{saving ? "Saving tour preference" : ""}</span>
    </div>
  );
}
