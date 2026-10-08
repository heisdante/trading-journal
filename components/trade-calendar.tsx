"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatR } from "@/lib/trades/calculations";
import type { Trade } from "@/types/trade";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function TradeCalendar({ trades, compact = false }: { trades: Trade[]; compact?: boolean }) {
  const latestTrade = trades[0]?.date;
  const [cursor, setCursor] = useState(() => (latestTrade ? new Date(`${latestTrade}T12:00:00`) : new Date()));

  const calendar = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const start = new Date(first);
    start.setDate(first.getDate() - first.getDay());
    const days = Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });

    const byDay = new Map<string, Trade[]>();
    trades.forEach((trade) => {
      const items = byDay.get(trade.date) ?? [];
      items.push(trade);
      byDay.set(trade.date, items);
    });

    return days.map((date) => {
      const key = toDateKey(date);
      const dayTrades = byDay.get(key) ?? [];
      const totalR = dayTrades.reduce((sum, trade) => sum + trade.r_value, 0);
      return { date, key, isCurrentMonth: monthKey(date) === monthKey(cursor), trades: dayTrades, totalR };
    });
  }, [cursor, trades]);

  function moveMonth(offset: number) {
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  const monthLabel = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(cursor);

  return (
    <section className={`terminal-panel app-chart-panel trade-calendar overflow-hidden rounded-lg ${compact ? "is-compact" : ""}`}>
      <div className="app-page-heading flex flex-col gap-3 border-b border-terminal-line p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-terminal-cyan">calendar / trade record</p>
          <h1 className="mt-1 text-xl font-semibold text-terminal-text">{monthLabel}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month" className="flex h-10 w-10 items-center justify-center border border-terminal-line text-terminal-muted transition hover:border-terminal-cyan hover:text-terminal-cyan"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" onClick={() => setCursor(new Date())} className="h-10 border border-terminal-line px-3 text-sm font-semibold text-terminal-muted transition hover:border-terminal-cyan hover:text-terminal-cyan">Today</button>
          <button type="button" onClick={() => moveMonth(1)} aria-label="Next month" className="flex h-10 w-10 items-center justify-center border border-terminal-line text-terminal-muted transition hover:border-terminal-cyan hover:text-terminal-cyan"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="calendar-scroll">
      <div className="calendar-grid grid grid-cols-7 border-b border-terminal-line bg-terminal-panel2 text-center font-mono text-[11px] uppercase text-terminal-muted">
        {Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(new Date(2024, 0, index + 7))).map((day, index) => <div key={`${day}-${index}`} className="px-2 py-2">{day}</div>)}
      </div>
      <div className="calendar-grid grid grid-cols-7">
        {calendar.map((day) => (
          <div key={day.key} className={`calendar-day min-h-28 border-b border-terminal-line p-3 md:border-r ${day.isCurrentMonth ? "bg-terminal-bg/35" : "bg-terminal-panel/40 text-terminal-muted"}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="number text-sm text-terminal-muted">{day.date.getDate()}</span>
              {day.trades.length ? <span className={`number rounded-sm border px-2 py-0.5 text-[11px] ${day.totalR > 0 ? "border-terminal-green/30 bg-terminal-green/10 text-terminal-green" : day.totalR < 0 ? "border-terminal-red/30 bg-terminal-red/10 text-terminal-red" : "border-terminal-amber/30 bg-terminal-amber/10 text-terminal-amber"}`}>{formatR(day.totalR)}</span> : null}
            </div>
            <div className="mt-3 space-y-2">
              {day.trades.slice(0, 3).map((trade) => (
                <Link key={trade.id} href={`/trades/${trade.id}`} className="block truncate border-l-2 border-terminal-cyan/50 pl-2 text-xs text-terminal-text transition hover:text-terminal-cyan">
                  {trade.pair} · {formatR(trade.r_value)}
                </Link>
              ))}
              {day.trades.length > 3 ? <p className="text-xs text-terminal-muted">+{day.trades.length - 3} more</p> : null}
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
