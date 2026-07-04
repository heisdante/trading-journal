"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidRisk } from "@/lib/trades/calculations";
import type { CriteriaStatus, Direction, FollowedTradingPlan, TradeOutcome, TradeScreenshot, TradeType, TradingSession } from "@/types/trade";

const pairs = ["Forex", "Stocks", "Futures", "Crypto", "Indices", "Options", "Bonds", "Funds", "Economy"] as const;
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

function requiredNumber(formData: FormData, name: string) {
  const value = Number(formData.get(name));
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive number`);
  }

  return value;
}

function optionalNumber(formData: FormData, name: string) {
  const raw = String(formData.get(name) ?? "").trim();
  if (!raw) {
    return null;
  }

  const value = Number(raw);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be a positive number`);
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

  const entryPrice = requiredNumber(formData, "entry_price");
  const stopPrice = requiredNumber(formData, "stop_price");
  const tradeId = crypto.randomUUID();

  if (!isValidRisk(direction, entryPrice, stopPrice)) {
    throw new Error(direction === "Long" ? "Long trades require entry above stop" : "Short trades require stop above entry");
  }

  const criteriaStatus = optionValue(formData, "criteria_status", criteriaStatuses) as CriteriaStatus;
  const screenshots = await uploadScreenshots(supabase, user.id, tradeId, formData);

  const payload = {
    id: tradeId,
    user_id: user.id,
    trade_date: requiredString(formData, "date"),
    pair: optionValue(formData, "pair", pairs),
    setup_name: requiredString(formData, "setup_name"),
    direction,
    entry_price: entryPrice,
    stop_price: stopPrice,
    target_price: optionalNumber(formData, "target_price"),
    exit_price: requiredNumber(formData, "exit_price"),
    criteria_met: criteriaStatus === "Good",
    criteria_status: criteriaStatus,
    outcome: optionValue(formData, "outcome", outcomes) as TradeOutcome,
    trade_idea_link: optionalUrl(formData, "trade_idea_link"),
    screenshots,
    followed_trading_plan: optionValue(formData, "followed_trading_plan", followedTradingPlanOptions) as FollowedTradingPlan,
    session: optionValue(formData, "session", sessions) as TradingSession,
    trade_type: optionValue(formData, "trade_type", tradeTypes) as TradeType,
    notes: String(formData.get("notes") ?? "").trim() || null,
  };

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
