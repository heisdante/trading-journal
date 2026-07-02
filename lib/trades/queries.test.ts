import { describe, expect, it } from "vitest";
import { normalizeTrade } from "@/lib/trades/queries";

describe("normalizeTrade", () => {
  it("maps live Supabase trade_date rows and calculates missing R values", () => {
    const trade = normalizeTrade({
      id: "trade-1",
      user_id: "user-1",
      trade_date: "2026-07-02",
      setup_name: "Breakout",
      direction: "Long",
      entry_price: 100,
      stop_price: 90,
      target_price: null,
      exit_price: 120,
      criteria_met: true,
      notes: null,
      result: "Win",
      created_at: "2026-07-02T10:00:00.000Z",
    });

    expect(trade.date).toBe("2026-07-02");
    expect(trade.r_value).toBe(2);
    expect(trade.updated_at).toBe("2026-07-02T10:00:00.000Z");
  });
});
