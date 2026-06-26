export type Direction = "Long" | "Short";
export type TradeResult = "Win" | "Loss" | "BE";

export type Trade = {
  id: string;
  user_id: string;
  date: string;
  setup_name: string;
  direction: Direction;
  entry_price: number;
  stop_price: number;
  target_price: number | null;
  exit_price: number;
  criteria_met: boolean;
  notes: string | null;
  r_value: number;
  result: TradeResult;
  created_at: string;
  updated_at: string;
};

export type TradeInsert = {
  date: string;
  setup_name: string;
  direction: Direction;
  entry_price: number;
  stop_price: number;
  target_price?: number | null;
  exit_price: number;
  criteria_met: boolean;
  notes?: string | null;
};

export type EquityPoint = {
  label: string;
  r: number;
  equity: number;
};

export type TradeMetrics = {
  totalTrades: number;
  winRate: number;
  expectancy: number;
  totalR: number;
  avgWin: number;
  avgLoss: number;
  maxDrawdown: number;
  criteriaMetR: number;
  brokenCriteriaR: number;
  equityCurve: EquityPoint[];
};
