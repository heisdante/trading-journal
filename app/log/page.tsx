import { AppShell } from "@/components/app-shell";
import { TradeEntry } from "@/components/trade-entry";
import { hasValidSupabaseEnv, supabaseEnvMessage } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import "@/components/quick-trade-capture.css";

export default async function LogPage() {
  if (!hasValidSupabaseEnv()) {
    return (
      <AppShell>
        <div className="terminal-panel rounded-lg p-6 text-terminal-text">
          <p className="font-mono text-xs uppercase text-terminal-cyan">setup required</p>
          <h1 className="mt-2 text-2xl font-semibold">Connect Supabase to log trades</h1>
          <p className="mt-3 text-sm text-terminal-muted">{supabaseEnvMessage()}</p>
        </div>
      </AppShell>
    );
  }

  const supabase = createClient();
  const { data: profile } = await supabase.from("user_profiles").select("default_market,default_session").maybeSingle();

  return (
    <AppShell>
      <TradeEntry defaults={{ market: profile?.default_market, session: profile?.default_session }} />
    </AppShell>
  );
}
