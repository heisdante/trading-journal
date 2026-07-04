import { clsx } from "clsx";
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
  return (
    <div className="terminal-panel overflow-hidden rounded-lg">
      <div className="flex items-center justify-between border-b border-terminal-line p-4">
        <div>
          <p className="font-mono text-xs uppercase text-terminal-cyan">history / all</p>
          <h1 className="mt-1 text-xl font-semibold text-terminal-text">Trade Log</h1>
        </div>
        <span className="number text-sm text-terminal-muted">{trades.length} trades</span>
      </div>

      {trades.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1500px] border-collapse text-left text-sm">
            <thead className="bg-terminal-panel2 text-xs uppercase tracking-wider text-terminal-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Pair</th>
                <th className="px-4 py-3 font-medium">Setup</th>
                <th className="px-4 py-3 font-medium">Dir</th>
                <th className="px-4 py-3 font-medium">Session</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Entry</th>
                <th className="px-4 py-3 font-medium">Stop</th>
                <th className="px-4 py-3 font-medium">Target</th>
                <th className="px-4 py-3 font-medium">Exit</th>
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
              {trades.map((trade) => (
                <tr key={trade.id} className="border-t border-terminal-line/70 transition hover:bg-terminal-panel2/60">
                  <td className="number whitespace-nowrap px-4 py-3 text-terminal-text">{trade.date}</td>
                  <td className="px-4 py-3 text-terminal-muted">{trade.pair}</td>
                  <td className="px-4 py-3 font-medium text-terminal-text">{trade.setup_name}</td>
                  <td className="px-4 py-3 text-terminal-muted">{trade.direction}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-terminal-muted">{trade.session}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-terminal-muted">{trade.trade_type}</td>
                  <td className="number px-4 py-3 text-terminal-muted">{trade.entry_price.toFixed(2)}</td>
                  <td className="number px-4 py-3 text-terminal-muted">{trade.stop_price.toFixed(2)}</td>
                  <td className="number px-4 py-3 text-terminal-muted">{trade.target_price?.toFixed(2) ?? "-"}</td>
                  <td className="number px-4 py-3 text-terminal-muted">{trade.exit_price.toFixed(2)}</td>
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
        <div className="p-10 text-center text-sm text-terminal-muted">No trades logged yet.</div>
      )}
    </div>
  );
}
