import { AppShell } from "@/components/app-shell";
import { DashboardOverview } from "@/components/dashboard-overview";
import { getTrades } from "@/lib/trades/queries";
import { hasValidSupabaseEnv, supabaseEnvMessage } from "@/lib/supabase/env";
import { possibleRepeats, type PatternTrade } from "@/lib/analysis/patterns";
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
  const [trades, { data: todayReview }, { data: growthPlan }, { data: profile }, { data: studies }, { data: latestCompleted }] = await Promise.all([
    getTrades(),
    supabase.from("daily_reviews").select("id").eq("review_date", today).maybeSingle(),
    supabase.from("growth_plans").select("id,title,account_type,starting_balance,target_balance,currency,risk_percent,deadline,milestones").eq("is_active", true).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("user_profiles").select("full_name,timezone").maybeSingle(),
    supabase.from("analysis_studies").select("id,title,trade_id,outcome,cause,lesson").eq("status", "Complete").order("updated_at", { ascending: false }).limit(30),
    supabase.from("trades").select("id,trade_date,pair,outcome,entry_reason,exit_reason,notes,review_comment,lesson_learned,emotion_notes")
      .eq("status", "Completed").order("trade_date", { ascending: false }).order("created_at", { ascending: false }).limit(12),
  ]);
  const pendingReviews = trades.filter((trade) => trade.review_required && trade.reviewed_at === null);
  const latestIds = (latestCompleted ?? []).map((trade) => trade.id);
  const { data: reviewedMatches } = latestIds.length
    ? await supabase.from("analysis_matches").select("study_id,trade_id,review_status").in("trade_id", latestIds)
    : { data: [] };
  const patternAlerts = (studies ?? []).flatMap((study) => {
    const reviewed = new Set((reviewedMatches ?? []).filter((item) => item.study_id === study.id && item.review_status !== "Suggested").map((item) => item.trade_id));
    const suggested = (reviewedMatches ?? []).filter((item) => item.study_id === study.id && item.review_status === "Suggested").map((item) => item.trade_id);
    const repeats = possibleRepeats(study, (latestCompleted ?? []) as PatternTrade[]).map((item) => item.trade_id);
    const candidateIds = new Set([...suggested, ...repeats].filter((id) => !reviewed.has(id)));
    return candidateIds.size ? [{ studyId: study.id, title: study.title, outcome: study.outcome, count: candidateIds.size }] : [];
  }).slice(0, 3);

  return (
    <AppShell>
      <DashboardOverview
        trades={trades}
        pendingReviews={pendingReviews}
        reviewComplete={Boolean(todayReview)}
        growthPlan={growthPlan}
        fullName={profile?.full_name ?? null}
        timezone={profile?.timezone ?? null}
        patternAlerts={patternAlerts}
      />
    </AppShell>
  );
}
