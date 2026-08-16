"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function addRuleAction(formData: FormData) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");
  const title = String(formData.get("title") ?? "").trim();
  const ruleText = String(formData.get("rule_text") ?? "").trim();
  if (!title || !ruleText) throw new Error("Rule title and rule text are required");
  const { error } = await supabase.from("trading_rules").insert({ user_id: userData.user.id, title, rule_text: ruleText, is_active: true });
  if (error) throw new Error(error.message);
  revalidatePath("/rules");
  redirect("/rules");
}

export async function toggleRuleAction(formData: FormData) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");
  const id = String(formData.get("id") ?? "");
  const isActive = String(formData.get("is_active") ?? "false") === "true";
  const { error } = await supabase.from("trading_rules").update({ is_active: !isActive }).eq("id", id).eq("user_id", userData.user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/rules");
}
