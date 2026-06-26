import type { Direction, Trade, TradeInsert, TradeMetrics, TradeResult } from "@/types/trade";

export function calculateRValue(trade: Pick<TradeInsert, "direction" | "entry_price" | "stop_price" | "exit_price">) {
  if (trade.direction === "Long") {
    return (trade.exit_price - trade.entry_price) / (trade.entry_price - trade.stop_price);
  }

  return (trade.entry_price - trade.exit_price) / (trade.stop_price - trade.entry_price);
}

export function classifyResult(rValue: number): TradeResult {
  if (rValue > 0) {
    return "Win";
  }

  if (rValue < 0) {
    return "Loss";
  }

  return "BE";
}

export function formatR(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}R`;
}

export function isValidRisk(direction: Direction, entry: number, stop: number) {
  if (direction === "Long") {
    return entry > stop;
  }

  return stop > entry;
}

export function buildTradeMetrics(trades: Trade[]): TradeMetrics {
  const sorted = [...trades].sort((a, b) => {
    const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateDiff !== 0) {
      return dateDiff;
    }

    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const wins = sorted.filter((trade) => trade.r_value > 0);
  const losses = sorted.filter((trade) => trade.r_value < 0);
  const totalR = sorted.reduce((sum, trade) => sum + trade.r_value, 0);
  const criteriaMetR = sorted
    .filter((trade) => trade.criteria_met)
    .reduce((sum, trade) => sum + trade.r_value, 0);
  const brokenCriteriaR = sorted
    .filter((trade) => !trade.criteria_met)
    .reduce((sum, trade) => sum + trade.r_value, 0);

  let equity = 0;
  let peak = 0;
  let maxDrawdown = 0;
  const equityCurve = sorted.map((trade) => {
    equity += trade.r_value;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, peak - equity);

    return {
      label: new Date(trade.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      r: Number(trade.r_value.toFixed(2)),
      equity: Number(equity.toFixed(2)),
    };
  });

  return {
    totalTrades: sorted.length,
    winRate: sorted.length ? (wins.length / sorted.length) * 100 : 0,
    expectancy: sorted.length ? totalR / sorted.length : 0,
    totalR,
    avgWin: wins.length ? wins.reduce((sum, trade) => sum + trade.r_value, 0) / wins.length : 0,
    avgLoss: losses.length ? losses.reduce((sum, trade) => sum + trade.r_value, 0) / losses.length : 0,
    maxDrawdown,
    criteriaMetR,
    brokenCriteriaR,
    equityCurve,
  };
}
