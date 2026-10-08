import { createClient } from "@/lib/supabase/server";
import { AppWorkspace } from "@/components/app-workspace";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data } = await supabase.auth.getClaims();

  const claims = data?.claims as ({ sub?: string; email?: string; user_metadata?: { trading_journal_tour?: string } }) | undefined;

  return <AppWorkspace email={claims?.email ?? "terminal session"} userId={claims?.sub ?? ""} tourPending={claims?.user_metadata?.trading_journal_tour === "pending"}>{children}</AppWorkspace>;
}
