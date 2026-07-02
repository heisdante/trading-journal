import { AppShell } from "@/components/app-shell";
import { TradeForm } from "@/components/trade-form";
import { hasValidSupabaseEnv, supabaseEnvMessage } from "@/lib/supabase/env";

export default function LogPage() {
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

  return (
    <AppShell>
      <TradeForm />
    </AppShell>
  );
}
