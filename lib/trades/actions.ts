"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isValidRisk } from "@/lib/trades/calculations";
import type { Direction } from "@/types/trade";

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

  if (!isValidRisk(direction, entryPrice, stopPrice)) {
    throw new Error(direction === "Long" ? "Long trades require entry above stop" : "Short trades require stop above entry");
  }

  const payload = {
    user_id: user.id,
    date: requiredString(formData, "date"),
    setup_name: requiredString(formData, "setup_name"),
    direction,
    entry_price: entryPrice,
    stop_price: stopPrice,
    target_price: optionalNumber(formData, "target_price"),
    exit_price: requiredNumber(formData, "exit_price"),
    criteria_met: formData.get("criteria_met") === "on",
    notes: String(formData.get("notes") ?? "").trim() || null,
  };

  const { error } = await supabase.from("trades").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard");
  revalidatePath("/trades");
  redirect("/trades");
}
