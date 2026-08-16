import type { RuleReviewStatus, TradingRule } from "@/types/trade";

export type TradeReviewInput = {
  pair: string;
  direction: string;
  setup_name: string;
  entry_reason: string;
  exit_reason: string;
  criteria_met: boolean;
  followed_trading_plan: string;
  emotion: string | null;
  fomo: boolean;
  cut_winner_early: boolean;
  revenge_trade: boolean;
  notes: string | null;
};

export type TradeReview = { status: RuleReviewStatus; feedback: string | null; disciplineScore: number };

const schema = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["Pass", "Warning"] },
    feedback: { type: "string" },
    discipline_score: { type: "integer", minimum: 0, maximum: 100 },
  },
  required: ["status", "feedback", "discipline_score"],
  additionalProperties: false,
};

function fallbackReview(trade: TradeReviewInput, hasRules: boolean): TradeReview {
  let score = 100;
  const warnings: string[] = [];
  if (!trade.criteria_met) { score -= 25; warnings.push("criteria marked as failed"); }
  if (trade.followed_trading_plan === "No") { score -= 25; warnings.push("trading plan was not followed"); }
  if (trade.fomo) { score -= 20; warnings.push("FOMO was recorded"); }
  if (trade.cut_winner_early) { score -= 15; warnings.push("winner was cut early"); }
  if (trade.revenge_trade) { score -= 15; warnings.push("revenge trade was recorded"); }
  return { status: hasRules && warnings.length ? "Warning" : "Unavailable", feedback: hasRules ? (warnings.length ? `Possible rule breach: ${warnings.join(", ")}.` : "No obvious breach found from the recorded fields.") : null, disciplineScore: Math.max(0, score) };
}

export async function reviewTradeAgainstRules(rules: TradingRule[], trade: TradeReviewInput): Promise<TradeReview> {
  const activeRules = rules.filter((rule) => rule.is_active);
  const fallback = fallbackReview(trade, activeRules.length > 0);
  if (!activeRules.length || !process.env.OPENAI_API_KEY) return fallback;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_TRADE_REVIEW_MODEL || process.env.OPENAI_TRADE_INTAKE_MODEL || "gpt-5-mini",
        store: false,
        instructions: "Review a completed trade against the trader's explicit rules. Only flag a breach when the trade record supports it. Do not give financial advice. Return a short, neutral explanation and a discipline score from 0 to 100.",
        input: JSON.stringify({ rules: activeRules.map((rule) => ({ title: rule.title, rule: rule.rule_text })), trade }),
        text: { format: { type: "json_schema", name: "trade_rule_review", strict: true, schema } },
      }),
    });
    if (!response.ok) return fallback;
    const body = await response.json() as { output_text?: string };
    const result = JSON.parse(body.output_text ?? "{}");
    return { status: result.status === "Warning" ? "Warning" : "Pass", feedback: String(result.feedback ?? ""), disciplineScore: Math.max(0, Math.min(100, Number(result.discipline_score) || 0)) };
  } catch {
    return fallback;
  }
}
