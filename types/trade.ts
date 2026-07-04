export type Direction = "Long" | "Short";
export type TradeResult = "Win" | "Loss" | "BE";
export type CriteriaStatus = "Good" | "Fail";
export type Market = "Forex" | "Stocks" | "Futures" | "Crypto" | "Indices" | "Options" | "Bonds" | "Funds" | "Economy";
export type TradeOutcome = "Win" | "Loss" | "Breakeven";
export type FollowedTradingPlan = "Yes" | "No";
export type TradingSession = "London" | "New York" | "Asian" | "Frankfurt";
export type TradeType = "Day Trade" | "Swing Trade";

export type TradeScreenshot = {
  path: string;
  name: string;
  type: string;
  size: number;
};

export type Trade = {
  id: string;
  user_id: string;
  date: string;
  pair: string;
  market: Market;
  setup_name: string;
  direction: Direction;
  entry_price: number;
  stop_price: number;
  target_price: number | null;
  exit_price: number;
  criteria_met: boolean;
  criteria_status: CriteriaStatus;
  outcome: TradeOutcome;
  trade_idea_link: string | null;
  screenshots: TradeScreenshot[];
  followed_trading_plan: FollowedTradingPlan;
  session: TradingSession;
  trade_type: TradeType;
  notes: string | null;
  r_value: number;
  result: TradeResult;
  created_at: string;
  updated_at: string;
};

export type TradeInsert = {
  date: string;
  pair: string;
  market: Market;
  setup_name: string;
  direction: Direction;
  entry_price: number;
  stop_price: number;
  target_price?: number | null;
  exit_price: number;
  criteria_met: boolean;
  criteria_status: CriteriaStatus;
  outcome: TradeOutcome;
  trade_idea_link?: string | null;
  screenshots?: TradeScreenshot[];
  followed_trading_plan: FollowedTradingPlan;
  session: TradingSession;
  trade_type: TradeType;
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
  criteriaMetRate: number;
  brokenCriteriaRate: number;
  equityCurve: EquityPoint[];
};
