"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { reviewTradeAgainstRules } from "@/lib/ai/trade-review";
import { calculateDisciplineScore } from "@/lib/trades/calculations";
import type { CriteriaStatus, Direction, Emotion, FollowedTradingPlan, Market, TradeOutcome, TradeScreenshot, TradingSession } from "@/types/trade";

const markets = ["Forex", "Stocks", "Futures", "Crypto", "Indices", "Options", "Bonds", "Funds", "Economy"] as const;
const followedTradingPlanOptions = ["Yes", "No"] as const;
const sessions = ["London", "New York", "Asian", "Frankfurt"] as const;
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
  if (!value) return null;
  if (!options.includes(value)) throw new Error(`${name} must be one of: ${options.join(", ")}`);
  return value;
}

function tradeDirection(formData: FormData): Direction {
  const value = String(formData.get("direction") ?? "").trim().toLowerCase();
  if (value === "long") return "Long";
  if (value === "short") return "Short";
  throw new Error("Choose Long or Short for trade direction.");
}

function criteriaSelection(formData: FormData): boolean {
  const value = String(formData.get("criteria_met") ?? "").trim().toLowerCase();
  if (value === "yes") return true;
  if (value === "no") return false;
  throw new Error("Choose Yes or No for whether this idea meets your criteria.");
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

export async function addTradeAction(_state: { error: string | null }, formData: FormData): Promise<{ error: string | null }> {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const tradeId = crypto.randomUUID();
  try {
  const direction = tradeDirection(formData);

  const pair = requiredString(formData, "pair");
  const recordState = optionValue(formData, "record_state", ["Planned", "Active"] as const);
  const entry = recordState === "Active" ? optionalPositiveNumber(formData, "entry_price") : null;
  const stop = recordState === "Active" ? optionalPositiveNumber(formData, "stop_price") : null;
  if (recordState === "Active") {
    if (entry === null || stop === null) throw new Error("Add the actual entry and protective stop for an active trade.");
    validateExecutionPrices(direction, entry, stop, null);
  }
  const emotion = (String(formData.get("emotion") ?? "").trim() || null) as Emotion | null;
  const fomo = formData.get("fomo") === "on";
  const cutWinnerEarly = formData.get("cut_winner_early") === "on";
  const revengeTrade = formData.get("revenge_trade") === "on";
  const criteriaMet = criteriaSelection(formData);
  const basePayload = {
    id: tradeId,
    user_id: user.id,
    trade_date: requiredString(formData, "date"),
    pair,
    market: optionValue(formData, "market", markets) as Market,
    setup_name: `${pair} trade`,
    direction: direction.toLowerCase() as "long" | "short",
    status: recordState,
    entry_price: entry,
    stop_price: stop,
    opened_at: recordState === "Active" ? new Date().toISOString() : null,
    target_price: null,
    exit_price: null,
    entry_reason: requiredString(formData, "entry_reason"),
    exit_reason: "",
    criteria_met: criteriaMet,
    criteria_status: (criteriaMet ? "Good" : "Fail") as CriteriaStatus,
    outcome: null as TradeOutcome | null,
    trade_idea_link: optionalUrl(formData, "trade_idea_link"),
    followed_trading_plan: null,
    review_required: false,
    session: optionalOptionValue(formData, "session", sessions) as TradingSession | null,
    trade_type: null,
    notes: String(formData.get("notes") ?? "").trim() || null,
    emotion,
    emotion_notes: String(formData.get("emotion_notes") ?? "").trim() || null,
    fomo,
    cut_winner_early: cutWinnerEarly,
    revenge_trade: revengeTrade,
  };
  const screenshots = await uploadScreenshots(supabase, user.id, tradeId, formData);
  const payload = { ...basePayload, screenshots, discipline_score: null, ai_rule_status: "Unavailable" as const, ai_rule_feedback: null, risk_percent: null };

  const { error } = await supabase.from("trades").insert(payload);

  if (error) {
    if (screenshots.length) {
      await supabase.storage.from(screenshotBucket).remove(screenshots.map((screenshot) => screenshot.path));
    }

    throw new Error(error.message);
  }
  } catch (error) {
    return { error: error instanceof Error ? error.message.replaceAll("_", " ") : "Could not save this trade. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/trades");
  redirect(`/trades/${tradeId}`);
}

function optionalPositiveNumber(formData: FormData, name: string) {
  const raw = String(formData.get(name) ?? "").trim();
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) throw new Error(`${name.replaceAll("_", " ")} must be a positive number`);
  return value;
}

function validateExecutionPrices(direction: Direction, entry: number, stop: number, target: number | null) {
  if ((direction === "Long" && entry <= stop) || (direction === "Short" && stop <= entry)) throw new Error("Stop must be beyond entry in the opposite direction.");
  if (target !== null && ((direction === "Long" && target <= entry) || (direction === "Short" && target >= entry))) throw new Error("Target must be beyond entry in your trade direction.");
}

async function getOwnedTrade(supabase: ReturnType<typeof createClient>, userId: string, tradeId: string) {
  const { data, error } = await supabase.from("trades").select("*").eq("id", tradeId).eq("user_id", userId).maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Trade setup not found.");
  return data;
}

export async function updatePlannedSetupAction(formData: FormData) {
  const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/login");
  const id = requiredString(formData, "trade_id"); const trade = await getOwnedTrade(supabase, user.id, id);
  if (trade.status !== "Planned") throw new Error("Only planned setups can be edited here.");
  const criteriaValue = String(formData.get("criteria_met") ?? "");
  const criteriaMet = criteriaValue === "on" || criteriaValue === "yes";
  const direction = optionValue(formData, "direction", ["Long", "Short"] as const) as Direction;
  const pair = requiredString(formData, "pair");
  const payload = {
    pair, setup_name: `${pair} trade`, direction: direction.toLowerCase() as "long" | "short",
    trade_date: requiredString(formData, "date"), criteria_met: criteriaMet, criteria_status: criteriaMet ? "Good" as const : "Fail" as const,
    entry_reason: requiredString(formData, "entry_reason"), trade_idea_link: optionalUrl(formData, "trade_idea_link"),
    notes: String(formData.get("notes") ?? "").trim() || null,
    emotion: (String(formData.get("emotion") ?? "").trim() || null) as Emotion | null,
    emotion_notes: String(formData.get("emotion_notes") ?? "").trim() || null,
    fomo: formData.get("fomo") === "on", cut_winner_early: formData.get("cut_winner_early") === "on", revenge_trade: formData.get("revenge_trade") === "on",
    session: optionalOptionValue(formData, "session", sessions) as TradingSession | null,
  };
  const { error } = await supabase.from("trades").update(payload).eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trades/${id}`); revalidatePath("/trades"); redirect(`/trades/${id}?step=entry&updated=setup`);
}

export async function activateTradeAction(formData: FormData) {
  const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/login");
  const id = requiredString(formData, "trade_id"); const trade = await getOwnedTrade(supabase, user.id, id);
  if (trade.status !== "Planned") throw new Error("Only a planned setup can be activated.");
  const entry = optionalPositiveNumber(formData, "entry_price"); const stop = optionalPositiveNumber(formData, "stop_price"); const target = optionalPositiveNumber(formData, "target_price");
  if (entry === null || stop === null) throw new Error("Add your actual entry and protective stop to activate the trade.");
  validateExecutionPrices(trade.direction.toLowerCase() === "short" ? "Short" : "Long", entry, stop, target);
  const riskRaw = String(formData.get("risk_percent") ?? "").trim(); const riskPercent = riskRaw ? Number(riskRaw) : null;
  if (riskPercent !== null && (!Number.isFinite(riskPercent) || riskPercent <= 0 || riskPercent > 100)) throw new Error("Risk per trade must be between 0 and 100 percent.");
  const { error } = await supabase.from("trades").update({ status: "Active", entry_price: entry, stop_price: stop, target_price: target, risk_percent: riskPercent, opened_at: new Date().toISOString() }).eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trades/${id}`); revalidatePath("/trades"); redirect(`/trades/${id}?step=close&updated=active`);
}

export async function updateActiveTradeAction(formData: FormData) {
  const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/login");
  const id = requiredString(formData, "trade_id"); const trade = await getOwnedTrade(supabase, user.id, id);
  if (trade.status !== "Active") throw new Error("Only active trades can be updated here.");
  const entry = optionalPositiveNumber(formData, "entry_price"); const stop = optionalPositiveNumber(formData, "stop_price"); const target = optionalPositiveNumber(formData, "target_price");
  if (entry === null || stop === null) throw new Error("Entry and protective stop are required.");
  validateExecutionPrices(trade.direction.toLowerCase() === "short" ? "Short" : "Long", entry, stop, target);
  const riskRaw = String(formData.get("risk_percent") ?? "").trim(); const riskPercent = riskRaw ? Number(riskRaw) : null;
  if (riskPercent !== null && (!Number.isFinite(riskPercent) || riskPercent <= 0 || riskPercent > 100)) throw new Error("Risk per trade must be between 0 and 100 percent.");
  const { error } = await supabase.from("trades").update({ entry_price: entry, stop_price: stop, target_price: target, risk_percent: riskPercent }).eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trades/${id}`); revalidatePath("/trades"); redirect(`/trades/${id}?step=close&updated=active`);
}

export async function completeTradeAction(formData: FormData) {
  const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/login");
  const id = requiredString(formData, "trade_id"); const trade = await getOwnedTrade(supabase, user.id, id);
  if (trade.status !== "Active" || trade.entry_price == null || trade.stop_price == null) throw new Error("Activate this setup and save its entry and stop before closing it.");
  const exit = optionalPositiveNumber(formData, "exit_price"); if (exit === null) throw new Error("Add the closing price before completing the trade.");
  const followedPlan = optionValue(formData, "followed_trading_plan", followedTradingPlanOptions) as FollowedTradingPlan;
  const exitReason = requiredString(formData, "exit_reason");
  const reward = trade.direction.toLowerCase() === "long" ? exit - Number(trade.entry_price) : Number(trade.entry_price) - exit;
  const outcome: TradeOutcome = reward > 0 ? "Win" : reward < 0 ? "Loss" : "Breakeven";
  const reviewInput = { pair: trade.pair, direction: trade.direction, setup_name: trade.setup_name, entry_reason: trade.entry_reason, exit_reason: exitReason, criteria_met: trade.criteria_met, followed_trading_plan: followedPlan, emotion: trade.emotion, fomo: trade.fomo, cut_winner_early: trade.cut_winner_early, revenge_trade: trade.revenge_trade, notes: trade.notes };
  const [{ data: rules }, { data: profile }] = await Promise.all([
    supabase.from("trading_rules").select("id,user_id,title,rule_text,is_active,created_at,updated_at").eq("is_active", true),
    supabase.from("user_profiles").select("ai_coach_enabled").maybeSingle(),
  ]);
  const review = profile?.ai_coach_enabled === false ? { status: "Unavailable" as const, feedback: null, disciplineScore: calculateDisciplineScore(reviewInput) } : await reviewTradeAgainstRules(rules ?? [], reviewInput);
  const { error } = await supabase.from("trades").update({ status: "Completed", exit_price: exit, outcome, exit_reason: exitReason, followed_trading_plan: followedPlan, closed_at: new Date().toISOString(), review_required: true, reviewed_at: null, review_comment: null, lesson_learned: null, next_trade_action: null, ai_rule_status: review.status, ai_rule_feedback: review.feedback, discipline_score: review.disciplineScore }).eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trades/${id}`); revalidatePath("/dashboard"); revalidatePath("/trades"); redirect(`/trades/${id}?updated=completed`);
}

export async function saveTradeReviewAction(formData: FormData) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const id = String(formData.get("trade_id") ?? "");
  const trade = await getOwnedTrade(supabase, user.id, id);
  if (trade.status !== "Completed") throw new Error("Close the trade before writing its post-trade reflection.");
  const comment = String(formData.get("review_comment") ?? "").trim();
  const lesson = String(formData.get("lesson_learned") ?? "").trim();
  const nextAction = String(formData.get("next_trade_action") ?? "").trim();
  if (!comment || !lesson || !nextAction) throw new Error("Complete all three reflection prompts before saving.");
  const { error } = await supabase.from("trades").update({ review_comment: comment, lesson_learned: lesson, next_trade_action: nextAction, reviewed_at: new Date().toISOString(), review_required: false }).eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/trades/${id}`); revalidatePath("/dashboard"); revalidatePath("/trades");
  redirect(`/trades/${id}?review=saved`);
}
