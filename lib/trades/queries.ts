import { createClient } from "@/lib/supabase/server";
import { calculateRValue, classifyResult } from "@/lib/trades/calculations";
import type { CriteriaStatus, Emotion, FollowedTradingPlan, Market, RuleReviewStatus, Trade, TradeOutcome, TradeScreenshot, TradeType, TradingSession, TradeStatus } from "@/types/trade";

function normalizeScreenshots(value: unknown): TradeScreenshot[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
    .map((item) => ({
      path: String(item.path ?? ""),
      name: String(item.name ?? "Screenshot"),
      type: String(item.type ?? "image/*"),
      size: Number(item.size ?? 0),
    }))
    .filter((item) => item.path);
}

export function normalizeTrade(row: Record<string, unknown>): Trade {
  const date = String(row.date ?? row.trade_date);
  const direction = row.direction === "Short" ? "Short" : "Long";
  const status = (row.status === "Planned" || row.status === "Active" ? row.status : "Completed") as TradeStatus;
  const rValue =
    row.r_value === undefined || row.r_value === null
      ? calculateRValue({
          direction,
          entry_price: Number(row.entry_price ?? 0),
          stop_price: Number(row.stop_price ?? 0),
          exit_price: Number(row.exit_price ?? 0),
        })
      : Number(row.r_value);

  return {
    id: String(row.id),
    user_id: String(row.user_id),
    date,
    pair: String(row.pair ?? ""),
    market: (
      row.market === "Stocks" ||
      row.market === "Futures" ||
      row.market === "Crypto" ||
      row.market === "Indices" ||
      row.market === "Options" ||
      row.market === "Bonds" ||
      row.market === "Funds" ||
      row.market === "Economy"
        ? row.market
        : "Forex"
    ) as Market,
    setup_name: String(row.setup_name),
    direction,
    status,
    entry_price: row.entry_price == null ? null : Number(row.entry_price),
    stop_price: row.stop_price == null ? null : Number(row.stop_price),
    target_price: row.target_price === null || row.target_price === undefined ? null : Number(row.target_price),
    exit_price: row.exit_price == null ? null : Number(row.exit_price),
    volume: row.volume === null || row.volume === undefined ? null : Number(row.volume),
    commission: row.commission === null || row.commission === undefined ? null : Number(row.commission),
    swap: row.swap === null || row.swap === undefined ? null : Number(row.swap),
    profit: row.profit === null || row.profit === undefined ? null : Number(row.profit),
    risk_percent: row.risk_percent == null ? null : Number(row.risk_percent),
    source_platform: row.source_platform === null || row.source_platform === undefined ? null : String(row.source_platform),
    source_trade_id: row.source_trade_id === null || row.source_trade_id === undefined ? null : String(row.source_trade_id),
    opened_at: row.opened_at === null || row.opened_at === undefined ? null : String(row.opened_at),
    closed_at: row.closed_at === null || row.closed_at === undefined ? null : String(row.closed_at),
    emotion: (row.emotion ?? null) as Emotion | null,
    emotion_notes: row.emotion_notes === null || row.emotion_notes === undefined ? null : String(row.emotion_notes),
    review_comment: row.review_comment == null ? null : String(row.review_comment),
    lesson_learned: row.lesson_learned == null ? null : String(row.lesson_learned),
    next_trade_action: row.next_trade_action == null ? null : String(row.next_trade_action),
    reviewed_at: row.reviewed_at == null ? null : String(row.reviewed_at),
    review_required: Boolean(row.review_required),
    fomo: Boolean(row.fomo),
    cut_winner_early: Boolean(row.cut_winner_early),
    revenge_trade: Boolean(row.revenge_trade),
    discipline_score: row.discipline_score === null || row.discipline_score === undefined ? null : Number(row.discipline_score),
    ai_rule_status: (row.ai_rule_status === "Warning" || row.ai_rule_status === "Unavailable" ? row.ai_rule_status : "Pass") as RuleReviewStatus,
    ai_rule_feedback: row.ai_rule_feedback === null || row.ai_rule_feedback === undefined ? null : String(row.ai_rule_feedback),
    entry_reason: String(row.entry_reason ?? ""),
    exit_reason: String(row.exit_reason ?? ""),
    criteria_met: Boolean(row.criteria_met),
    criteria_status: (row.criteria_status === "Fail" ? "Fail" : "Good") as CriteriaStatus,
    outcome: (row.outcome === "Win" || row.outcome === "Loss" || row.outcome === "Breakeven" ? row.outcome : null) as TradeOutcome | null,
    trade_idea_link: row.trade_idea_link === null || row.trade_idea_link === undefined ? null : String(row.trade_idea_link),
    screenshots: normalizeScreenshots(row.screenshots),
    followed_trading_plan: (row.followed_trading_plan === "No" || row.followed_trading_plan === "Yes" ? row.followed_trading_plan : null) as FollowedTradingPlan | null,
    session: (
      row.session === "London" || row.session === "New York" || row.session === "Asian" || row.session === "Frankfurt" ? row.session : null
    ) as TradingSession | null,
    trade_type: (row.trade_type === "Day Trade" || row.trade_type === "Swing Trade" ? row.trade_type : null) as TradeType | null,
    notes: row.notes === null ? null : String(row.notes),
    r_value: rValue,
    result: status === "Planned" ? "Planned" : status === "Active" ? "Open" : (row.result === "Loss" ? "Loss" : row.result === "BE" ? "BE" : classifyResult(rValue)),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at ?? row.created_at),
  };
}

export async function getTrades() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .order("trade_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => normalizeTrade(row));
}

export async function getTradeById(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from("trades").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? normalizeTrade(data) : null;
}
