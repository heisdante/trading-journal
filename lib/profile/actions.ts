"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Market, TradingSession } from "@/types/trade";

const markets = ["Forex", "Stocks", "Futures", "Crypto", "Indices", "Options", "Bonds", "Funds", "Economy"] as const;
const sessions = ["London", "New York", "Asian", "Frankfurt"] as const;

function optionalOption<const T extends readonly string[]>(value: FormDataEntryValue | null, options: T) {
  const parsed = String(value ?? "").trim();
  if (!parsed) return null;
  if (!options.includes(parsed)) throw new Error("Invalid profile preference");
  return parsed as T[number];
}

export async function saveProfileAction(formData: FormData) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");
  const risk = String(formData.get("default_risk_percent") ?? "").trim();
  const defaultRisk = risk ? Number(risk) : null;
  if (defaultRisk !== null && (!Number.isFinite(defaultRisk) || defaultRisk <= 0 || defaultRisk > 100)) throw new Error("Default risk must be between 0 and 100");
  const payload = {
    id: userData.user.id,
    full_name: String(formData.get("full_name") ?? "").trim() || null,
    timezone: String(formData.get("timezone") ?? "UTC").trim() || "UTC",
    currency: String(formData.get("currency") ?? "USD").trim().toUpperCase(),
    default_market: optionalOption(formData.get("default_market"), markets) as Market | null,
    default_session: optionalOption(formData.get("default_session"), sessions) as TradingSession | null,
    default_risk_percent: defaultRisk,
    ai_coach_enabled: formData.get("ai_coach_enabled") === "on",
  };
  if (!/^[A-Z]{3}$/.test(payload.currency)) throw new Error("Currency must use a three-letter code");
  const { error } = await supabase.from("user_profiles").upsert(payload);
  if (error) throw new Error(error.message);
  revalidatePath("/profile");
  revalidatePath("/log");
  redirect("/profile?message=Profile%20saved");
}

export async function saveTimezoneAction(formData: FormData) {
  const timezone = String(formData.get("timezone") ?? "").trim();
  if (!timezone || timezone.length > 100) throw new Error("Choose a valid timezone.");
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone });
  } catch {
    throw new Error("Choose a valid timezone.");
  }
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { error } = await supabase.from("user_profiles").upsert({ id: user.id, timezone }, { onConflict: "id" });
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/profile");
  redirect("/dashboard");
}

export async function updateAccountAction(formData: FormData) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const updates: { email?: string; password?: string } = {};
  if (email && email !== userData.user.email) updates.email = email;
  if (password) {
    if (password.length < 8) throw new Error("Password must be at least 8 characters");
    updates.password = password;
  }
  if (!Object.keys(updates).length) redirect("/profile?message=No%20account%20changes%20to%20save");
  const { error } = await supabase.auth.updateUser(updates);
  if (error) throw new Error(error.message);
  redirect("/profile?message=Account%20updated.%20Email%20changes%20may%20need%20confirmation.");
}
