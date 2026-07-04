import { describe, expect, it } from "vitest";
import { normalizeTrade } from "@/lib/trades/queries";

describe("normalizeTrade", () => {
  it("maps live Supabase trade_date rows and calculates missing R values", () => {
    const trade = normalizeTrade({
      id: "trade-1",
      user_id: "user-1",
      trade_date: "2026-07-02",
      pair: "Forex",
      setup_name: "Breakout",
      direction: "Long",
      entry_price: 100,
      stop_price: 90,
      target_price: null,
      exit_price: 120,
      criteria_met: true,
      criteria_status: "Good",
      outcome: "Win",
      trade_idea_link: "https://example.com/idea",
      screenshots: [{ path: "user-1/trade-1/chart.png", name: "chart.png", type: "image/png", size: 100 }],
      followed_trading_plan: "Yes",
      session: "London",
      trade_type: "Day Trade",
      notes: null,
      result: "Win",
      created_at: "2026-07-02T10:00:00.000Z",
    });

    expect(trade.date).toBe("2026-07-02");
    expect(trade.r_value).toBe(2);
    expect(trade.screenshots).toHaveLength(1);
    expect(trade.updated_at).toBe("2026-07-02T10:00:00.000Z");
  });
});
