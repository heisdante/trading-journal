export type Direction = "Long" | "Short";
export type TradeResult = "Win" | "Loss" | "BE";
export type CriteriaStatus = "Good" | "Fail";
export type Market = "Forex" | "Stocks" | "Futures" | "Crypto" | "Indices" | "Options" | "Bonds" | "Funds" | "Economy";
export type TradeOutcome = "Win" | "Loss" | "Breakeven";
export type FollowedTradingPlan = "Yes" | "No";
export type TradingSession = "London" | "New York" | "Asian" | "Frankfurt";
export type TradeType = "Day Trade" | "Swing Trade";
export type Emotion = "Calm" | "Confident" | "Focused" | "Anxious" | "Fearful" | "Frustrated" | "Excited" | "Tired" | "Angry";
export type RuleReviewStatus = "Pass" | "Warning" | "Unavailable";

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
  volume: number | null;
  commission: number | null;
  swap: number | null;
  profit: number | null;
  source_platform: string | null;
  source_trade_id: string | null;
  opened_at: string | null;
  closed_at: string | null;
  emotion: Emotion | null;
  emotion_notes: string | null;
  fomo: boolean;
  cut_winner_early: boolean;
  revenge_trade: boolean;
  discipline_score: number | null;
  ai_rule_status: RuleReviewStatus;
  ai_rule_feedback: string | null;
  entry_reason: string;
  exit_reason: string;
  criteria_met: boolean;
  criteria_status: CriteriaStatus;
  outcome: TradeOutcome;
  trade_idea_link: string | null;
  screenshots: TradeScreenshot[];
  followed_trading_plan: FollowedTradingPlan;
  session: TradingSession | null;
  trade_type: TradeType | null;
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
  volume?: number | null;
  commission?: number | null;
  swap?: number | null;
  profit?: number | null;
  source_platform?: string | null;
  source_trade_id?: string | null;
  opened_at?: string | null;
  closed_at?: string | null;
  emotion?: Emotion | null;
  emotion_notes?: string | null;
  fomo?: boolean;
  cut_winner_early?: boolean;
  revenge_trade?: boolean;
  discipline_score?: number | null;
  ai_rule_status?: RuleReviewStatus;
  ai_rule_feedback?: string | null;
  entry_reason: string;
  exit_reason: string;
  criteria_met: boolean;
  criteria_status: CriteriaStatus;
  outcome: TradeOutcome;
  trade_idea_link?: string | null;
  screenshots?: TradeScreenshot[];
  followed_trading_plan: FollowedTradingPlan;
  session?: TradingSession | null;
  trade_type?: TradeType | null;
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
  averageRiskReward: number;
  disciplineScore: number;
  ruleWarningRate: number;
};

export type TradingRule = {
  id: string;
  user_id: string;
  title: string;
  rule_text: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DailyReview = {
  id: string;
  user_id: string;
  review_date: string;
  day_rating: number;
  discipline_score: number;
  emotion: Emotion | null;
  summary: string | null;
  lesson: string | null;
  created_at: string;
  updated_at: string;
};

export type UserProfile = {
  id: string;
  full_name: string | null;
  timezone: string;
  currency: string;
  default_market: Market | null;
  default_session: TradingSession | null;
  default_trade_type: TradeType | null;
  default_risk_percent: number | null;
  ai_coach_enabled: boolean;
  created_at: string;
  updated_at: string;
};
