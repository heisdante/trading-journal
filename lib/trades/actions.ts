"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { reviewTradeAgainstRules } from "@/lib/ai/trade-review";
import { calculateDisciplineScore } from "@/lib/trades/calculations";
import type { CriteriaStatus, Direction, Emotion, FollowedTradingPlan, Market, TradeOutcome, TradeScreenshot, TradeType, TradingSession } from "@/types/trade";

const markets = ["Forex", "Stocks", "Futures", "Crypto", "Indices", "Options", "Bonds", "Funds", "Economy"] as const;
const criteriaStatuses = ["Good", "Fail"] as const;
const outcomes = ["Win", "Loss", "Breakeven"] as const;
const followedTradingPlanOptions = ["Yes", "No"] as const;
const sessions = ["London", "New York", "Asian", "Frankfurt"] as const;
const tradeTypes = ["Day Trade", "Swing Trade"] as const;
const screenshotBucket = "trade-screenshots";

function requiredString(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function optionValue<const T extends readonly string[]>(formData: FormData, name: string, options: T): T[number] {
  const value = requiredString(formData, name);
  if (!options.includes(value)) {
    throw new Error(`${name} must be one of: ${options.join(", ")}`);
  }

  return value;
}

function optionalOptionValue<const T extends readonly string[]>(formData: FormData, name: string, options: T): T[number] | null {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) {
    return null;
  }

  if (!options.includes(value)) {
    throw new Error(`${name} must be one of: ${options.join(", ")}`);
  }

  return value;
}

function optionalUrl(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) {
    return null;
  }

  try {
    return new URL(value).toString();
  } catch {
    throw new Error(`${name} must be a valid URL`);
  }
}

function safeFilename(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

async function uploadScreenshots(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  tradeId: string,
  formData: FormData,
): Promise<TradeScreenshot[]> {
  const files = formData
    .getAll("screenshots")
    .filter((value): value is File => value instanceof File && value.size > 0);

  const screenshots: TradeScreenshot[] = [];

  for (const [index, file] of files.entries()) {
    if (!file.type.startsWith("image/")) {
      throw new Error("screenshots must be image files");
    }

    const filename = safeFilename(file.name) || `screenshot-${index + 1}`;
    const path = `${userId}/${tradeId}/${Date.now()}-${index + 1}-${filename}`;
    const { error } = await supabase.storage.from(screenshotBucket).upload(path, file, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    screenshots.push({
      path,
      name: file.name,
      type: file.type,
      size: file.size,
    });
  }

  return screenshots;
}

export async function addTradeAction(formData: FormData) {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const direction = requiredString(formData, "direction") as Direction;
  if (direction !== "Long" && direction !== "Short") {
    throw new Error("direction must be Long or Short");
  }

  const tradeId = crypto.randomUUID();

  const criteriaStatus = optionValue(formData, "criteria_status", criteriaStatuses) as CriteriaStatus;
  const screenshots = await uploadScreenshots(supabase, user.id, tradeId, formData);
  const entryPrice = Number(requiredString(formData, "entry_price"));
  const stopPrice = Number(requiredString(formData, "stop_price"));
  const exitPrice = Number(requiredString(formData, "exit_price"));
  const targetPrice = Number(String(formData.get("target_price") ?? "").trim()) || null;
  const emotion = (String(formData.get("emotion") ?? "").trim() || null) as Emotion | null;
  const fomo = formData.get("fomo") === "on";
  const cutWinnerEarly = formData.get("cut_winner_early") === "on";
  const revengeTrade = formData.get("revenge_trade") === "on";
  const followedTradingPlan = optionValue(formData, "followed_trading_plan", followedTradingPlanOptions) as FollowedTradingPlan;
  if (![entryPrice, stopPrice, exitPrice].every((value) => Number.isFinite(value) && value > 0)) {
    throw new Error("Entry, stop, and exit prices must be positive numbers");
  }
  if ((direction === "Long" && entryPrice <= stopPrice) || (direction === "Short" && stopPrice <= entryPrice)) {
    throw new Error("Stop price must be below entry for Long trades and above entry for Short trades");
  }

  const basePayload = {
    id: tradeId,
    user_id: user.id,
    trade_date: requiredString(formData, "date"),
    pair: requiredString(formData, "pair"),
    market: optionValue(formData, "market", markets) as Market,
    setup_name: requiredString(formData, "setup_name"),
    direction,
    entry_price: entryPrice,
    stop_price: stopPrice,
    target_price: targetPrice,
    exit_price: exitPrice,
    entry_reason: requiredString(formData, "entry_reason"),
    exit_reason: requiredString(formData, "exit_reason"),
    criteria_met: criteriaStatus === "Good",
    criteria_status: criteriaStatus,
    outcome: optionValue(formData, "outcome", outcomes) as TradeOutcome,
    trade_idea_link: optionalUrl(formData, "trade_idea_link"),
    screenshots,
    followed_trading_plan: followedTradingPlan,
    session: optionalOptionValue(formData, "session", sessions) as TradingSession | null,
    trade_type: optionalOptionValue(formData, "trade_type", tradeTypes) as TradeType | null,
    notes: String(formData.get("notes") ?? "").trim() || null,
    emotion,
    emotion_notes: String(formData.get("emotion_notes") ?? "").trim() || null,
    fomo,
    cut_winner_early: cutWinnerEarly,
    revenge_trade: revengeTrade,
  };

  const [{ data: rules }, { data: profile }] = await Promise.all([
    supabase.from("trading_rules").select("id,user_id,title,rule_text,is_active,created_at,updated_at").eq("is_active", true),
    supabase.from("user_profiles").select("ai_coach_enabled").maybeSingle(),
  ]);
  const review = profile?.ai_coach_enabled === false
    ? { status: "Unavailable" as const, feedback: null, disciplineScore: calculateDisciplineScore(basePayload) }
    : await reviewTradeAgainstRules(rules ?? [], basePayload);
  const payload = { ...basePayload, discipline_score: review.disciplineScore || calculateDisciplineScore(basePayload), ai_rule_status: review.status, ai_rule_feedback: review.feedback };

  const { error } = await supabase.from("trades").insert(payload);

  if (error) {
    if (screenshots.length) {
      await supabase.storage.from(screenshotBucket).remove(screenshots.map((screenshot) => screenshot.path));
    }

    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/trades");
  redirect("/trades");
}
