import type { Direction, Market } from "@/types/trade";

export type ImportedTradeDraft = {
  trade_date: string;
  pair: string;
  market: Market;
  direction: Direction;
  entry_price: number;
  stop_price: number;
  target_price: number | null;
  exit_price: number;
  volume: number | null;
  commission: number | null;
  swap: number | null;
  profit: number | null;
  source_platform: string;
  source_trade_id: string | null;
  opened_at: string | null;
  closed_at: string | null;
  setup_name: string;
  entry_reason: string;
  exit_reason: string;
  notes: string | null;
};

type CsvRow = Record<string, string>;

function clean(value: string | undefined) {
  return (value ?? "").trim().replace(/^"|"$/g, "");
}

function key(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function get(row: CsvRow, names: string[]) {
  const entries = Object.entries(row);
  const match = entries.find(([name]) => names.includes(key(name)));
  return match ? clean(match[1]) : "";
}

function numberValue(value: string) {
  const parsed = Number(value.replace(/[^0-9.+-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function dateValue(value: string) {
  if (!value) return new Date().toISOString().slice(0, 10);
  const parsed = new Date(value.replace(/\./g, "/"));
  return Number.isNaN(parsed.getTime()) ? value.slice(0, 10) : parsed.toISOString().slice(0, 10);
}

function inferMarket(pair: string): Market {
  if (/btc|eth|sol|crypto|usdt/i.test(pair)) return "Crypto";
  if (/^([a-z]{3}[/:_-]?[a-z]{3})$/i.test(pair.replace(/\s/g, ""))) return "Forex";
  return "Stocks";
}

function inferDirection(value: string): Direction {
  return /sell|short/i.test(value) ? "Short" : "Long";
}

function splitCsvLine(line: string, delimiter: string) {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"' && line[index + 1] === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  cells.push(current);
  return cells.map(clean);
}

export function parseTradeCsv(text: string, sourcePlatform = "CSV import") {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) throw new Error("The file needs a header row and at least one trade row");
  const header = lines[0];
  const delimiter = ["\t", ";", ","].sort((a, b) => (header.split(b).length - 1) - (header.split(a).length - 1))[0];
  const headers = splitCsvLine(header, delimiter);

  return lines.slice(1).map((line, index) => {
    const cells = splitCsvLine(line, delimiter);
    const row = Object.fromEntries(headers.map((name, cellIndex) => [name, cells[cellIndex] ?? ""]));
    const pair = get(row, ["symbol", "pair", "instrument", "asset"]);
    const entry = numberValue(get(row, ["entryprice", "openprice", "priceopen", "price"]));
    const exit = numberValue(get(row, ["exitprice", "closeprice", "priceclose"]));
    const stop = numberValue(get(row, ["stoploss", "sl"]));
    const target = numberValue(get(row, ["takeprofit", "tp"]));
    const direction = inferDirection(get(row, ["direction", "type", "side"]));
    const safeEntry = entry ?? 0;
    const safeStop = stop ?? (direction === "Long" ? safeEntry * 0.99 : safeEntry * 1.01);
    const safeExit = exit ?? safeEntry;
    if (!pair || safeEntry <= 0 || safeExit <= 0 || safeStop <= 0 || (direction === "Long" ? safeEntry <= safeStop : safeStop <= safeEntry)) {
      throw new Error(`Could not understand trade row ${index + 2}. Required columns: symbol, entry price, stop loss, and exit price.`);
    }
    return {
      trade_date: dateValue(get(row, ["tradedate", "date", "time", "opentime", "entrytime"])),
      pair,
      market: inferMarket(pair),
      direction,
      entry_price: safeEntry,
      stop_price: safeStop,
      target_price: target,
      exit_price: safeExit,
      volume: numberValue(get(row, ["volume", "lots", "quantity"])),
      commission: numberValue(get(row, ["commission", "fees", "fee"])),
      swap: numberValue(get(row, ["swap", "financing"])),
      profit: numberValue(get(row, ["profit", "netprofit", "netpnl", "pnl"])),
      source_platform: sourcePlatform,
      source_trade_id: get(row, ["ticket", "order", "deal", "position", "id"]) || null,
      opened_at: get(row, ["opentime", "entrytime"]) || null,
      closed_at: get(row, ["closetime", "exittime"]) || null,
      setup_name: "Imported trade",
      entry_reason: "Imported from trading platform",
      exit_reason: "Imported from trading platform",
      notes: null,
    } satisfies ImportedTradeDraft;
  });
}
