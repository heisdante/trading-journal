import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildTradeMetrics } from "@/lib/trades/calculations";
import { normalizeTrade } from "@/lib/trades/queries";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "You must be signed in" }, { status: 401 });
  if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "AI coach is not configured. Add OPENAI_API_KEY to enable it." }, { status: 503 });
  const { message } = await request.json() as { message?: string };
  const question = String(message ?? "").trim();
  if (!question) return NextResponse.json({ error: "Ask the coach a question" }, { status: 400 });
  const [{ data: tradeRows }, { data: rules }, { data: profile }] = await Promise.all([
    supabase.from("trades").select("*").order("trade_date", { ascending: false }).limit(100),
    supabase.from("trading_rules").select("title,rule_text,is_active").eq("is_active", true),
    supabase.from("user_profiles").select("ai_coach_enabled").maybeSingle(),
  ]);
  if (profile?.ai_coach_enabled === false) return NextResponse.json({ error: "Enable the AI coach in Profile to use this feature." }, { status: 403 });
  const trades = (tradeRows ?? []).map((row) => normalizeTrade(row));
  const metrics = buildTradeMetrics(trades);
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_TRADE_REVIEW_MODEL || "gpt-5-mini",
        store: false,
        instructions: "You are a precise trading-journal coach. Use only the provided journal summary and active rules. You do not give financial advice, predictions, or trade signals. Help the trader identify process patterns, questions to investigate, and next-review actions. Be direct, compassionate, and concise.",
        input: JSON.stringify({ question, active_rules: rules ?? [], journal_summary: { total_trades: metrics.totalTrades, win_rate: metrics.winRate, expectancy_r: metrics.expectancy, total_r: metrics.totalR, average_risk_reward: metrics.averageRiskReward, discipline_score: metrics.disciplineScore, rule_warning_rate: metrics.ruleWarningRate } }),
      }),
    });
    if (!response.ok) return NextResponse.json({ error: "The AI coach could not respond right now" }, { status: 502 });
    const body = await response.json() as { output_text?: string };
    return NextResponse.json({ reply: body.output_text ?? "No response returned." });
  } catch {
    return NextResponse.json({ error: "The AI coach could not respond right now" }, { status: 502 });
  }
}
