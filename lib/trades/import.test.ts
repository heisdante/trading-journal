import { describe, expect, it } from "vitest";
import { parseTradeCsv } from "@/lib/trades/import";

describe("parseTradeCsv", () => {
  it("maps MT-style execution columns", () => {
    const [trade] = parseTradeCsv([
      "Ticket,Time,Symbol,Type,Volume,Price,S/L,T/P,Close Time,Close Price,Commission,Swap,Profit",
      "123,2026.08.16 10:00,EURUSD,buy,0.10,1.0850,1.0800,1.0950,2026.08.16 12:00,1.0920,-1.2,0,70",
    ].join("\n"), "MT5 CSV");

    expect(trade).toMatchObject({
      pair: "EURUSD",
      direction: "Long",
      entry_price: 1.085,
      stop_price: 1.08,
      exit_price: 1.092,
      volume: 0.1,
      source_trade_id: "123",
      source_platform: "MT5 CSV",
    });
  });

  it("supports semicolon-delimited cTrader exports", () => {
    const [trade] = parseTradeCsv([
      "Id;Entry time;Symbol;Direction;Volume;Entry price;Stop loss;Exit time;Exit price;Net profit",
      "abc;2026-08-16T10:00:00Z;GBPUSD;Sell;10000;1.2700;1.2750;2026-08-16T12:00:00Z;1.2650;50",
    ].join("\n"), "cTrader CSV");

    expect(trade.direction).toBe("Short");
    expect(trade.exit_price).toBe(1.265);
    expect(trade.profit).toBe(50);
  });
});
