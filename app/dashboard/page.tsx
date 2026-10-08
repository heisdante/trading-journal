import { AppShell } from "@/components/app-shell";
import { DashboardOverview } from "@/components/dashboard-overview";
import { getTrades } from "@/lib/trades/queries";
import { hasValidSupabaseEnv, supabaseEnvMessage } from "@/lib/supabase/env";
import "./dashboard.css";

export default async function DashboardPage() {
  if (!hasValidSupabaseEnv()) {
    return (
      <AppShell>
        <div className="terminal-panel rounded-2xl p-6 text-terminal-text">
          <p className="font-mono text-xs uppercase text-terminal-cyan">setup required</p>
          <h1 className="mt-2 text-2xl font-semibold">Connect Supabase to view the dashboard</h1>
          <p className="mt-3 text-sm text-terminal-muted">{supabaseEnvMessage()}</p>
        </div>
      </AppShell>
    );
  }

  const supabase = (await import("@/lib/supabase/server")).createClient();
  const today = new Date().toISOString().slice(0, 10);
  const [trades, { data: todayReview }, { data: growthPlan }] = await Promise.all([
    getTrades(),
    supabase.from("daily_reviews").select("id").eq("review_date", today).maybeSingle(),
    supabase.from("growth_plans").select("id,title,account_type,starting_balance,target_balance,currency,risk_percent,deadline,milestones").eq("is_active", true).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  const pendingReviews = trades.filter((trade) => trade.review_required && trade.reviewed_at === null);

  return (
    <AppShell>
      <DashboardOverview
        trades={trades}
        pendingReviews={pendingReviews}
        reviewComplete={Boolean(todayReview)}
        growthPlan={growthPlan}
      />
    </AppShell>
  );
}
