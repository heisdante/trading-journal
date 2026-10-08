import { describe, expect, it } from "vitest";
import { buildSeriesStats, buildTradeMetrics, calculateDisciplineScore, calculateRValue, calculateRiskReward, classifyResult, isValidRisk } from "@/lib/trades/calculations";
import type { Trade } from "@/types/trade";

function trade(overrides: Partial<Trade>): Trade {
  const base: Trade = {
    id: "trade-id",
    user_id: "user-id",
    date: "2026-01-01",
    pair: "EUR/USD",
    market: "Forex",
    setup_name: "Breakout",
    direction: "Long",
    status: "Completed",
    entry_price: 100,
    stop_price: 90,
    target_price: null,
    exit_price: 110,
    volume: null,
    commission: null,
    swap: null,
    profit: null,
    risk_percent: null,
    source_platform: null,
    source_trade_id: null,
    opened_at: null,
    closed_at: null,
    emotion: null,
    emotion_notes: null,
    review_comment: null,
    lesson_learned: null,
    next_trade_action: null,
    reviewed_at: null,
    review_required: false,
    fomo: false,
    cut_winner_early: false,
    revenge_trade: false,
    discipline_score: null,
    ai_rule_status: "Pass",
    ai_rule_feedback: null,
    entry_reason: "Setup confirmed",
    exit_reason: "Target reached",
    criteria_met: true,
    criteria_status: "Good",
    outcome: "Win",
    trade_idea_link: null,
    screenshots: [],
    followed_trading_plan: "Yes",
    session: "London",
    trade_type: "Day Trade",
    notes: null,
    r_value: 1,
    result: "Win",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
  };
  return { ...base, ...overrides } as Trade;
}

describe("trade calculations", () => {
  it("calculates long R from entry, stop, and exit", () => {
    expect(calculateRValue({ direction: "Long", entry_price: 100, stop_price: 90, exit_price: 120 })).toBe(2);
    expect(calculateRValue({ direction: "Long", entry_price: 100, stop_price: 90, exit_price: 95 })).toBe(-0.5);
  });

  it("calculates short R from entry, stop, and exit", () => {
    expect(calculateRValue({ direction: "Short", entry_price: 100, stop_price: 110, exit_price: 80 })).toBe(2);
    expect(calculateRValue({ direction: "Short", entry_price: 100, stop_price: 110, exit_price: 105 })).toBe(-0.5);
  });

  it("classifies result from R value", () => {
    expect(classifyResult(1)).toBe("Win");
    expect(classifyResult(-0.25)).toBe("Loss");
    expect(classifyResult(0)).toBe("BE");
  });

  it("validates directional risk correctly", () => {
    expect(isValidRisk("Long", 100, 90)).toBe(true);
    expect(isValidRisk("Long", 100, 100)).toBe(false);
    expect(isValidRisk("Short", 100, 110)).toBe(true);
    expect(isValidRisk("Short", 100, 90)).toBe(false);
  });

  it("builds dashboard metrics from trades", () => {
    const metrics = buildTradeMetrics([
      trade({ id: "1", date: "2026-01-01", created_at: "2026-01-01T00:00:00.000Z", r_value: 2, criteria_met: true }),
      trade({ id: "2", date: "2026-01-02", created_at: "2026-01-02T00:00:00.000Z", r_value: -1, result: "Loss", criteria_met: false }),
      trade({ id: "3", date: "2026-01-03", created_at: "2026-01-03T00:00:00.000Z", r_value: 0, result: "BE", criteria_met: true }),
    ]);

    expect(metrics.totalTrades).toBe(3);
    expect(metrics.winRate).toBeCloseTo(33.3333);
    expect(metrics.expectancy).toBeCloseTo(0.3333);
    expect(metrics.totalR).toBe(1);
    expect(metrics.avgWin).toBe(2);
    expect(metrics.avgLoss).toBe(-1);
    expect(metrics.maxDrawdown).toBe(1);
    expect(metrics.criteriaMetRate).toBe(50);
    expect(metrics.brokenCriteriaRate).toBe(0);
    expect(metrics.criteriaMetR).toBe(2);
    expect(metrics.brokenCriteriaR).toBe(-1);
    expect(metrics.equityCurve.map((point) => point.equity)).toEqual([2, 1, 1]);
  });

  it("calculates planned risk-to-reward and transparent discipline score", () => {
    expect(calculateRiskReward(trade({ target_price: 120 }))).toBe(2);
    expect(calculateDisciplineScore({ criteria_met: true, followed_trading_plan: "Yes", fomo: false, cut_winner_early: false, revenge_trade: false })).toBe(100);
    expect(calculateDisciplineScore({ criteria_met: false, followed_trading_plan: "No", fomo: true, cut_winner_early: true, revenge_trade: true })).toBe(0);
  });

  it("calculates latest trade series instead of all history", () => {
    const trades = [
      trade({ id: "one", date: "2026-01-01", r_value: -1, ai_rule_status: "Pass" }),
      trade({ id: "two", date: "2026-01-02", r_value: 2, ai_rule_status: "Warning" }),
      trade({ id: "three", date: "2026-01-03", r_value: 1, ai_rule_status: "Pass" }),
    ];
    const stats = buildSeriesStats(trades, 2);
    expect(stats.size).toBe(2);
    expect(stats.totalR).toBe(3);
    expect(stats.warnings).toBe(1);
  });
});
