import { createClient } from "@/lib/supabase/server";
import { calculateRValue, classifyResult } from "@/lib/trades/calculations";
import type { Trade } from "@/types/trade";

export function normalizeTrade(row: Record<string, unknown>): Trade {
  const date = String(row.date ?? row.trade_date);
  const entryPrice = Number(row.entry_price);
  const stopPrice = Number(row.stop_price);
  const exitPrice = Number(row.exit_price);
  const direction = row.direction === "Short" ? "Short" : "Long";
  const rValue =
    row.r_value === undefined || row.r_value === null
      ? calculateRValue({
          direction,
          entry_price: entryPrice,
          stop_price: stopPrice,
          exit_price: exitPrice,
        })
      : Number(row.r_value);

  return {
    id: String(row.id),
    user_id: String(row.user_id),
    date,
    setup_name: String(row.setup_name),
    direction,
    entry_price: entryPrice,
    stop_price: stopPrice,
    target_price: row.target_price === null ? null : Number(row.target_price),
    exit_price: exitPrice,
    criteria_met: Boolean(row.criteria_met),
    notes: row.notes === null ? null : String(row.notes),
    r_value: rValue,
    result: row.result === "Loss" ? "Loss" : row.result === "BE" ? "BE" : classifyResult(rValue),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at ?? row.created_at),
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
    .order("trade_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => normalizeTrade(row));
}
