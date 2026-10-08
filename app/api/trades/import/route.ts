import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseTradeCsv } from "@/lib/trades/import";
import type { TradeOutcome } from "@/types/trade";

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return NextResponse.json({ error: "You must be signed in" }, { status: 401 });

  try {
    const body = await request.json() as { csv?: string; source?: string };
    const drafts = parseTradeCsv(String(body.csv ?? ""), String(body.source ?? "CSV import"));
    const rows = drafts.map((draft) => ({
      user_id: userData.user.id,
      ...draft,
      direction: draft.direction.toLowerCase() as "long" | "short",
      criteria_met: false,
      criteria_status: "Fail" as const,
      outcome: (draft.profit === null ? "Breakeven" : draft.profit > 0 ? "Win" : draft.profit < 0 ? "Loss" : "Breakeven") as TradeOutcome,
      trade_idea_link: null,
      screenshots: [],
      followed_trading_plan: "No" as const,
      session: null,
      trade_type: "Day Trade" as const,
    }));
    const { error } = await supabase.from("trades").insert(rows);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ imported: rows.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Import failed" }, { status: 400 });
  }
}
