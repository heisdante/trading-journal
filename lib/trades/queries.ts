import { createClient } from "@/lib/supabase/server";
import type { Trade } from "@/types/trade";

function normalizeTrade(row: Record<string, unknown>): Trade {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    date: String(row.date),
    setup_name: String(row.setup_name),
    direction: row.direction === "Short" ? "Short" : "Long",
    entry_price: Number(row.entry_price),
    stop_price: Number(row.stop_price),
    target_price: row.target_price === null ? null : Number(row.target_price),
    exit_price: Number(row.exit_price),
    criteria_met: Boolean(row.criteria_met),
    notes: row.notes === null ? null : String(row.notes),
    r_value: Number(row.r_value),
    result: row.result === "Loss" ? "Loss" : row.result === "BE" ? "BE" : "Win",
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function getTrades() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("trades")
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => normalizeTrade(row));
}
