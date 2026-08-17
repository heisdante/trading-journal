"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { formatR } from "@/lib/trades/calculations";
import type { Trade } from "@/types/trade";

function resultClass(rValue: number) {
  if (rValue > 0) {
    return "border-terminal-green/30 bg-terminal-green/10 text-terminal-green";
  }

  if (rValue < 0) {
    return "border-terminal-red/30 bg-terminal-red/10 text-terminal-red";
  }

  return "border-terminal-amber/30 bg-terminal-amber/10 text-terminal-amber";
}

export function TradeTable({ trades }: { trades: Trade[] }) {
  const [query, setQuery] = useState("");
  const [market, setMarket] = useState("all");
  const [session, setSession] = useState("all");
  const [result, setResult] = useState("all");
  const [direction, setDirection] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const markets = useMemo(() => Array.from(new Set(trades.map((trade) => trade.market))).sort(), [trades]);
  const sessions = useMemo(() => Array.from(new Set(trades.map((trade) => trade.session).filter(Boolean))).sort() as string[], [trades]);
  const filteredTrades = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return trades.filter((trade) => {
      const searchable = [trade.pair, trade.market, trade.setup_name, trade.direction, trade.session, trade.trade_type, trade.outcome, trade.entry_reason, trade.exit_reason, trade.notes].filter(Boolean).join(" ").toLowerCase();
      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (market === "all" || trade.market === market) &&
        (session === "all" || trade.session === session) &&
        (result === "all" || trade.result === result) &&
        (direction === "all" || trade.direction === direction) &&
        (!from || trade.date >= from) &&
        (!to || trade.date <= to)
      );
    });
  }, [direction, from, market, query, result, session, to, trades]);

  function resetFilters() {
    setQuery("");
    setMarket("all");
    setSession("all");
    setResult("all");
    setDirection("all");
    setFrom("");
    setTo("");
  }

  return (
    <div className="terminal-panel overflow-hidden rounded-lg">
      <div className="app-page-heading flex flex-col gap-4 border-b border-terminal-line p-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-terminal-cyan">history / all</p>
          <h1 className="mt-1 text-xl font-semibold text-terminal-text">Trade Log</h1>
          <p className="mt-2 text-sm text-terminal-muted">Filter by date, market, session, direction, result, setup, notes, and symbols.</p>
        </div>
        <span className="number rounded-sm border border-terminal-line bg-terminal-bg/70 px-2 py-1 text-sm text-terminal-muted">{filteredTrades.length} / {trades.length} trades</span>
      </div>

      <div className="grid gap-3 border-b border-terminal-line bg-terminal-panel/60 p-4 lg:grid-cols-[1.4fr_repeat(4,minmax(0,0.75fr))]">
        <label className="relative block">
          <span className="sr-only">Search trades</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-terminal-muted" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pair, setup, notes..." className="h-11 w-full rounded border border-terminal-line bg-terminal-bg pl-9 pr-3 text-sm text-terminal-text outline-none placeholder:text-terminal-muted/60 focus:border-terminal-cyan" />
        </label>
        <select aria-label="Filter by market" value={market} onChange={(event) => setMarket(event.target.value)} className="h-11 rounded border border-terminal-line bg-terminal-bg px-3 text-sm text-terminal-text outline-none focus:border-terminal-cyan"><option value="all">All markets</option>{markets.map((item) => <option key={item}>{item}</option>)}</select>
        <select aria-label="Filter by session" value={session} onChange={(event) => setSession(event.target.value)} className="h-11 rounded border border-terminal-line bg-terminal-bg px-3 text-sm text-terminal-text outline-none focus:border-terminal-cyan"><option value="all">All sessions</option>{sessions.map((item) => <option key={item}>{item}</option>)}</select>
        <select aria-label="Filter by result" value={result} onChange={(event) => setResult(event.target.value)} className="h-11 rounded border border-terminal-line bg-terminal-bg px-3 text-sm text-terminal-text outline-none focus:border-terminal-cyan"><option value="all">All results</option><option>Win</option><option>Loss</option><option>BE</option></select>
        <select aria-label="Filter by direction" value={direction} onChange={(event) => setDirection(event.target.value)} className="h-11 rounded border border-terminal-line bg-terminal-bg px-3 text-sm text-terminal-text outline-none focus:border-terminal-cyan"><option value="all">All directions</option><option>Long</option><option>Short</option></select>
        <div className="grid gap-3 lg:col-span-5 sm:grid-cols-[1fr_1fr_auto]">
          <input aria-label="From date" type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="h-11 rounded border border-terminal-line bg-terminal-bg px-3 text-sm text-terminal-text outline-none focus:border-terminal-cyan" />
          <input aria-label="To date" type="date" value={to} onChange={(event) => setTo(event.target.value)} className="h-11 rounded border border-terminal-line bg-terminal-bg px-3 text-sm text-terminal-text outline-none focus:border-terminal-cyan" />
          <button type="button" onClick={resetFilters} className="inline-flex h-11 items-center justify-center gap-2 border border-terminal-line px-3 text-sm font-semibold text-terminal-muted transition hover:border-terminal-cyan hover:text-terminal-cyan"><X className="h-4 w-4" />Reset</button>
        </div>
        <div className="hidden items-center gap-2 font-mono text-xs uppercase text-terminal-muted lg:col-span-5 lg:flex"><SlidersHorizontal className="h-4 w-4 text-terminal-cyan" /> filters update instantly on this loaded trade set</div>
      </div>

      {filteredTrades.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1500px] border-collapse text-left text-sm">
            <thead className="bg-terminal-panel2 text-xs uppercase tracking-wider text-terminal-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Pair</th>
                <th className="px-4 py-3 font-medium">Market</th>
                <th className="px-4 py-3 font-medium">Setup</th>
                <th className="px-4 py-3 font-medium">Dir</th>
                <th className="px-4 py-3 font-medium">Session</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Entry Reason</th>
                <th className="px-4 py-3 font-medium">Exit Reason</th>
                <th className="px-4 py-3 font-medium">Criteria</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Outcome</th>
                <th className="px-4 py-3 font-medium">R</th>
                <th className="px-4 py-3 font-medium">Result</th>
                <th className="px-4 py-3 font-medium">Idea</th>
                <th className="px-4 py-3 font-medium">Shots</th>
                <th className="px-4 py-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrades.map((trade) => (
                <tr key={trade.id} className="border-t border-terminal-line/70 transition hover:bg-terminal-panel2/60">
                  <td className="number whitespace-nowrap px-4 py-3 text-terminal-text">{trade.date}</td>
                  <td className="px-4 py-3 text-terminal-muted"><Link href={`/trades/${trade.id}`} className="font-semibold text-terminal-text hover:text-terminal-cyan">{trade.pair}</Link></td>
                  <td className="px-4 py-3 text-terminal-muted">{trade.market}</td>
                  <td className="px-4 py-3 font-medium text-terminal-text">{trade.setup_name}</td>
                  <td className="px-4 py-3 text-terminal-muted">{trade.direction}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-terminal-muted">{trade.session ?? "-"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-terminal-muted">{trade.trade_type ?? "-"}</td>
                  <td className="max-w-[240px] truncate px-4 py-3 text-terminal-muted">{trade.entry_reason}</td>
                  <td className="max-w-[240px] truncate px-4 py-3 text-terminal-muted">{trade.exit_reason}</td>
                  <td className="px-4 py-3">
                    <span
                      className={clsx(
                        "rounded border px-2 py-1 text-xs",
                        trade.criteria_met
                          ? "border-terminal-green/30 bg-terminal-green/10 text-terminal-green"
                          : "border-terminal-red/30 bg-terminal-red/10 text-terminal-red",
                      )}
                    >
                      {trade.criteria_status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-terminal-muted">{trade.followed_trading_plan}</td>
                  <td className="px-4 py-3 text-terminal-muted">{trade.outcome}</td>
                  <td className={clsx("number px-4 py-3 font-semibold", resultClass(trade.r_value).split(" ").at(-1))}>
                    {formatR(trade.r_value)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx("rounded border px-2 py-1 text-xs", resultClass(trade.r_value))}>{trade.result}</span>
                  </td>
                  <td className="max-w-[180px] truncate px-4 py-3 text-terminal-muted">
                    {trade.trade_idea_link ? (
                      <a className="text-terminal-cyan underline-offset-4 hover:underline" href={trade.trade_idea_link} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="number whitespace-nowrap px-4 py-3 text-terminal-muted">{trade.screenshots.length}</td>
                  <td className="max-w-[260px] truncate px-4 py-3 text-terminal-muted">{trade.notes ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-10 text-center text-sm text-terminal-muted"><span className="block text-terminal-text">{trades.length ? "No trades match those filters." : "No trades logged yet."}</span><span className="mt-1 block text-xs">{trades.length ? "Try widening the date range or clearing a filter." : "Your trade history will animate into this table once records exist."}</span></div>
      )}
    </div>
  );
}
