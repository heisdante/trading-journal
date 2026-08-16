import { createClient } from "@/lib/supabase/server";
import { AppWorkspace } from "@/components/app-workspace";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data } = await supabase.auth.getClaims();

  return <AppWorkspace email={data?.claims.email ?? "terminal session"}>{children}</AppWorkspace>;
}
