"use client";

import Link from "next/link";
import { CheckCircle2, ClipboardCheck } from "lucide-react";

export function DailyReviewReminder({ complete }: { complete: boolean }) {
  return <section className={`flex flex-col gap-3 border p-4 sm:flex-row sm:items-center sm:justify-between ${complete ? "border-terminal-green/30 bg-terminal-green/5" : "border-terminal-amber/40 bg-terminal-amber/5"}`}><div className="flex gap-3"><div className={complete ? "text-terminal-green" : "text-terminal-amber"}>{complete ? <CheckCircle2 className="h-5 w-5" /> : <ClipboardCheck className="h-5 w-5" />}</div><div><p className="text-sm font-semibold">{complete ? "Today’s review is recorded" : "Close the loop on today’s session"}</p><p className="mt-1 text-sm text-terminal-muted">{complete ? "Your trading day has a documented lesson." : "A two-minute review makes your next decision more intentional."}</p></div></div>{complete ? null : <Link href="/review" className="inline-flex h-10 items-center justify-center border border-terminal-amber/50 px-3 text-sm font-semibold text-terminal-amber hover:bg-terminal-amber/10">Review today</Link>}</section>;
}
