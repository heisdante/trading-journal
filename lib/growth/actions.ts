"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createGrowthPlanAction(formData: FormData) {
  const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/login");
  const title = String(formData.get("title") ?? "").trim(); const accountType = String(formData.get("account_type") ?? "");
  const startingBalance = Number(formData.get("starting_balance")); const targetBalance = Number(formData.get("target_balance")); const riskPercent = Number(formData.get("risk_percent")); const currency = String(formData.get("currency") ?? "USD").trim().toUpperCase(); const deadline = String(formData.get("deadline") ?? "").trim() || null; const milestones = String(formData.get("milestones") ?? "").trim();
  if (!title || !["Prop firm", "Personal account"].includes(accountType)) throw new Error("Add a title and choose a valid account type.");
  if (!(startingBalance > 0) || !(targetBalance > startingBalance)) throw new Error("Target balance must be higher than a positive starting balance.");
  if (!(riskPercent > 0 && riskPercent <= 100) || !/^[A-Z]{3}$/.test(currency)) throw new Error("Enter a valid risk percentage and three-letter currency code.");
  const { error } = await supabase.from("growth_plans").insert({ user_id: user.id, title, account_type: accountType as "Prop firm" | "Personal account", starting_balance: startingBalance, target_balance: targetBalance, risk_percent: riskPercent, currency, deadline, milestones });
  if (error) throw new Error(error.message);
  revalidatePath("/growth"); revalidatePath("/dashboard"); redirect("/growth?created=1");
}

export async function archiveGrowthPlanAction(formData: FormData) {
  const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/login");
  const id = String(formData.get("plan_id") ?? "");
  const { error } = await supabase.from("growth_plans").update({ is_active: false }).eq("id", id).eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/growth"); redirect("/growth");
}
