import { AppShell } from "@/components/app-shell";
import { MarketSessionStatus } from "@/components/market-session-status";
import { TradeCalendar } from "@/components/trade-calendar";
import { hasValidSupabaseEnv, supabaseEnvMessage } from "@/lib/supabase/env";
import { getTrades } from "@/lib/trades/queries";

export default async function CalendarPage() {
  if (!hasValidSupabaseEnv()) {
    return (
      <AppShell>
        <div className="terminal-panel rounded-lg p-6 text-terminal-text">
          <p className="font-mono text-xs uppercase text-terminal-cyan">setup required</p>
          <h1 className="mt-2 text-2xl font-semibold">Connect Supabase to view the trade calendar</h1>
          <p className="mt-3 text-sm text-terminal-muted">{supabaseEnvMessage()}</p>
        </div>
      </AppShell>
    );
  }

  const trades = await getTrades();

  return (
    <AppShell>
      <MarketSessionStatus />
      <TradeCalendar trades={trades} />
    </AppShell>
  );
}
