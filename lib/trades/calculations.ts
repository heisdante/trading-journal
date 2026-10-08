import type { Direction, Trade, TradeMetrics, TradeResult } from "@/types/trade";

type RValueInput = {
  direction: Direction;
  entry_price: number;
  stop_price: number;
  exit_price: number;
};

export function isValidRisk(direction: Direction, entryPrice: number, stopPrice: number) {
  if (direction === "Long") {
    return stopPrice < entryPrice;
  }

  return stopPrice > entryPrice;
}

export function calculateRValue({ direction, entry_price, stop_price, exit_price }: RValueInput) {
  if (!isValidRisk(direction, entry_price, stop_price)) {
    return 0;
  }

  const risk = Math.abs(entry_price - stop_price);
  const reward = direction === "Long" ? exit_price - entry_price : entry_price - exit_price;

  return Number((reward / risk).toFixed(2));
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

export function calculateRiskReward(trade: Pick<Trade, "direction" | "entry_price" | "stop_price" | "target_price">) {
  if (!trade.target_price || trade.entry_price === null || trade.stop_price === null || !isValidRisk(trade.direction, trade.entry_price, trade.stop_price)) return null;
  const risk = Math.abs(trade.entry_price - trade.stop_price);
  const reward = trade.direction === "Long" ? trade.target_price - trade.entry_price : trade.entry_price - trade.target_price;
  return Number((reward / risk).toFixed(2));
}

export function calculateDisciplineScore(trade: Pick<Trade, "criteria_met" | "followed_trading_plan" | "fomo" | "cut_winner_early" | "revenge_trade">) {
  let score = 100;
  if (!trade.criteria_met) score -= 25;
  if (trade.followed_trading_plan === "No") score -= 25;
  if (trade.fomo) score -= 20;
  if (trade.cut_winner_early) score -= 15;
  if (trade.revenge_trade) score -= 15;
  return Math.max(0, Math.min(100, score));
}

export function buildSeriesStats(trades: Trade[], size: number | "all") {
  const ordered = trades.filter((trade) => trade.status === "Completed").sort((a, b) => new Date(`${a.date}T00:00:00`).getTime() - new Date(`${b.date}T00:00:00`).getTime());
  const series = size === "all" ? ordered : ordered.slice(-size);
  const wins = series.filter((trade) => trade.r_value > 0).length;
  const totalR = series.reduce((sum, trade) => sum + trade.r_value, 0);
  const rrValues = series.map(calculateRiskReward).filter((value): value is number => value !== null);
  return {
    size: series.length,
    winRate: series.length ? (wins / series.length) * 100 : 0,
    totalR,
    expectancy: series.length ? totalR / series.length : 0,
    averageRiskReward: rrValues.length ? rrValues.reduce((sum, value) => sum + value, 0) / rrValues.length : 0,
    disciplineScore: series.length ? series.reduce((sum, trade) => sum + (trade.discipline_score ?? calculateDisciplineScore(trade)), 0) / series.length : 0,
    warnings: series.filter((trade) => trade.ai_rule_status === "Warning").length,
  };
}

export function buildTradeMetrics(trades: Trade[]): TradeMetrics {
  const sorted = trades.filter((trade) => trade.status === "Completed").sort((a, b) => {
    const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateDiff !== 0) {
      return dateDiff;
    }

    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const wins = sorted.filter((trade) => trade.r_value > 0);
  const losses = sorted.filter((trade) => trade.r_value < 0);
  const totalR = sorted.reduce((sum, trade) => sum + trade.r_value, 0);
  const criteriaMetTrades = sorted.filter((trade) => trade.criteria_met);
  const brokenCriteriaTrades = sorted.filter((trade) => !trade.criteria_met);
  const criteriaMetWins = criteriaMetTrades.filter((trade) => trade.r_value > 0);
  const brokenCriteriaWins = brokenCriteriaTrades.filter((trade) => trade.r_value > 0);
  const criteriaMetRate = criteriaMetTrades.length ? (criteriaMetWins.length / criteriaMetTrades.length) * 100 : 0;
  const brokenCriteriaRate = brokenCriteriaTrades.length ? (brokenCriteriaWins.length / brokenCriteriaTrades.length) * 100 : 0;
  const criteriaMetR = criteriaMetTrades.reduce((sum, trade) => sum + trade.r_value, 0);
  const brokenCriteriaR = brokenCriteriaTrades.reduce((sum, trade) => sum + trade.r_value, 0);
  const rrValues = sorted.map(calculateRiskReward).filter((value): value is number => value !== null);
  const disciplineScores = sorted.map((trade) => trade.discipline_score ?? calculateDisciplineScore(trade));

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
    criteriaMetRate,
    brokenCriteriaRate,
    criteriaMetR,
    brokenCriteriaR,
    equityCurve,
    averageRiskReward: rrValues.length ? rrValues.reduce((sum, value) => sum + value, 0) / rrValues.length : 0,
    disciplineScore: disciplineScores.length ? disciplineScores.reduce((sum, value) => sum + value, 0) / disciplineScores.length : 0,
    ruleWarningRate: sorted.length ? (sorted.filter((trade) => trade.ai_rule_status === "Warning").length / sorted.length) * 100 : 0,
  };
}
