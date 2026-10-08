"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight, CircleDot, Minus } from "lucide-react";
import { formatR } from "@/lib/trades/calculations";
import type { Trade } from "@/types/trade";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

const weekdayLabels = Array.from({ length: 7 }, (_, index) =>
  new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(new Date(2024, 0, index + 1)),
);

export function TradeCalendar({ trades, compact = false }: { trades: Trade[]; compact?: boolean }) {
  const latestTrade = trades[0]?.date;
  const [cursor, setCursor] = useState(() => (latestTrade ? new Date(`${latestTrade}T12:00:00`) : new Date()));
  const todayKey = toDateKey(new Date());

  const calendar = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const start = new Date(first);
    const mondayOffset = (first.getDay() + 6) % 7;
    start.setDate(first.getDate() - mondayOffset);
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
      const totalR = dayTrades.filter((trade) => trade.status === "Completed").reduce((sum, trade) => sum + trade.r_value, 0);
      return { date, key, isCurrentMonth: monthKey(date) === monthKey(cursor), isToday: key === todayKey, trades: dayTrades, totalR };
    });
  }, [cursor, todayKey, trades]);

  const monthTrades = calendar.filter((day) => day.isCurrentMonth).flatMap((day) => day.trades).filter((trade) => trade.status === "Completed");
  const monthR = monthTrades.reduce((sum, trade) => sum + trade.r_value, 0);
  const wins = monthTrades.filter((trade) => trade.r_value > 0).length;
  const winRate = monthTrades.length ? wins / monthTrades.length * 100 : 0;
  const tradingDays = calendar.filter((day) => day.isCurrentMonth && day.trades.length > 0).length;
  const monthLabel = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(cursor);

  function moveMonth(offset: number) {
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  return (
    <section className={`terminal-panel app-chart-panel trade-calendar ${compact ? "is-compact" : ""}`}>
      <header className="calendar-header">
        <div>
          <p className="calendar-eyebrow">Trade activity / calendar</p>
          {compact ? <h2>{monthLabel}</h2> : <h1>{monthLabel}</h1>}
          {!compact && <p className="calendar-subtitle">A month at a glance. Open a day’s record to revisit the decision.</p>}
        </div>
        <div className="calendar-controls" aria-label="Calendar navigation">
          <button type="button" onClick={() => moveMonth(-1)} aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" onClick={() => setCursor(new Date())} className="calendar-today-button">Today</button>
          <button type="button" onClick={() => moveMonth(1)} aria-label="Next month"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </header>

      {!compact && <div className="calendar-summary" aria-label="Monthly trade summary">
        <article><span>NET PERFORMANCE</span><strong className={`number ${monthR > 0 ? "is-positive" : monthR < 0 ? "is-negative" : ""}`}>{formatR(monthR)}</strong><small>{monthTrades.length} trade{monthTrades.length === 1 ? "" : "s"} this month</small></article>
        <article><span>WIN RATE</span><strong className="number">{winRate.toFixed(0)}%</strong><small>{wins} winning trade{wins === 1 ? "" : "s"}</small></article>
        <article><span>ACTIVE DAYS</span><strong className="number">{tradingDays.toString().padStart(2, "0")}</strong><small>days with a journal entry</small></article>
      </div>}

      <div className="calendar-legend"><span><i className="is-win" />Win</span><span><i className="is-loss" />Loss</span><span><i className="is-be" />Breakeven</span></div>
      <div className="calendar-scroll">
        <div className="calendar-grid calendar-weekdays" role="row">
          {weekdayLabels.map((day, index) => <div role="columnheader" key={`${day}-${index}`}>{day}</div>)}
        </div>
        <div className="calendar-grid calendar-days" role="grid" aria-label={`${monthLabel} trade calendar`}>
          {calendar.map((day) => (
            <div key={day.key} role="gridcell" aria-label={`${day.key}, ${day.trades.length} trades`} className={`calendar-day ${day.isCurrentMonth ? "is-current-month" : "is-outside-month"} ${day.isToday ? "is-today" : ""} ${day.trades.length ? "has-trades" : ""}`}>
              <div className="calendar-day-heading">
                <span className="calendar-date-number">{day.date.getDate()}</span>
                {day.trades.length > 0 && <span className={`calendar-day-result number ${day.totalR > 0 ? "is-positive" : day.totalR < 0 ? "is-negative" : "is-neutral"}`}>{formatR(day.totalR)}</span>}
              </div>
              <div className="calendar-trade-list">
                {day.trades.slice(0, compact ? 2 : 3).map((trade) => {
                  const resultTone = trade.status !== "Completed" ? "is-planned" : trade.result === "Win" ? "is-win" : trade.result === "Loss" ? "is-loss" : "is-be";
                  const ResultIcon = trade.status !== "Completed" ? CircleDot : trade.result === "Win" ? ArrowUpRight : trade.result === "Loss" ? ArrowDownRight : Minus;
                  return <Link key={trade.id} href={`/trades/${trade.id}`} title={`${trade.pair} · ${trade.status === "Completed" ? formatR(trade.r_value) : trade.status}`} className={`calendar-trade ${resultTone}`}><ResultIcon aria-hidden="true" /><span>{trade.pair}</span><strong className="number">{trade.status === "Completed" ? formatR(trade.r_value) : trade.status}</strong></Link>;
                })}
                {day.trades.length > (compact ? 2 : 3) && <span className="calendar-more">+{day.trades.length - (compact ? 2 : 3)} more</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
