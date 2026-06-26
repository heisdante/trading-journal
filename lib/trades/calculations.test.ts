import { describe, expect, it } from "vitest";
import { buildTradeMetrics, calculateRValue, classifyResult, isValidRisk } from "@/lib/trades/calculations";
import type { Trade } from "@/types/trade";

function trade(overrides: Partial<Trade>): Trade {
  return {
    id: "trade-id",
    user_id: "user-id",
    date: "2026-01-01",
    setup_name: "Breakout",
    direction: "Long",
    entry_price: 100,
    stop_price: 90,
    target_price: null,
    exit_price: 110,
    criteria_met: true,
    notes: null,
    r_value: 1,
    result: "Win",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
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
    expect(metrics.criteriaMetR).toBe(2);
    expect(metrics.brokenCriteriaR).toBe(-1);
    expect(metrics.equityCurve.map((point) => point.equity)).toEqual([2, 1, 1]);
  });
});
