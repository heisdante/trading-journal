import { buildSeriesStats, calculateRiskReward, formatR } from "@/lib/trades/calculations";
import type { Trade } from "@/types/trade";

export function buildPlaybooks(trades: Trade[]) {
  return Object.entries(trades.reduce<Record<string, Trade[]>>((groups, trade) => { (groups[trade.setup_name] ??= []).push(trade); return groups; }, {})).map(([name, setupTrades]) => {
    const stats = buildSeriesStats(setupTrades, "all");
    return { name, ...stats, warningRate: setupTrades.length ? (setupTrades.filter((trade) => trade.ai_rule_status === "Warning").length / setupTrades.length) * 100 : 0 };
  }).sort((a, b) => b.totalR - a.totalR);
}

export function buildWeeklyDebrief(trades: Trade[]) {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const recent = trades.filter((trade) => new Date(`${trade.date}T00:00:00`) >= weekAgo);
  const stats = buildSeriesStats(recent, "all");
  const fomo = recent.filter((trade) => trade.fomo).length;
  const early = recent.filter((trade) => trade.cut_winner_early).length;
  const revenge = recent.filter((trade) => trade.revenge_trade).length;
  const focus = fomo ? "FOMO" : early ? "early exits" : revenge ? "revenge trades" : stats.warnings ? "rule warnings" : "your current process";
  return { recent, stats, focus, behaviorCount: fomo + early + revenge, summary: recent.length ? `${recent.length} trades produced ${formatR(stats.totalR)} with ${stats.disciplineScore.toFixed(0)}/100 average discipline.` : "No trades were logged in the last seven days." };
}

export function tradeRiskReward(trade: Trade) {
  const value = calculateRiskReward(trade);
  return value === null ? "No target recorded" : `${value.toFixed(2)}:1 planned R:R`;
}
