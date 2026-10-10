import { AppShell } from "@/components/app-shell";
import { AnalysisStudio } from "@/components/analysis-studio";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import "./studio.css";

export default async function AnalysisPage({ searchParams }: { searchParams?: { trade?: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const [{ data: studies, error }, { data: trades }, { data: latestTrades }] = await Promise.all([
    supabase.from("analysis_studies").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(100),
    supabase.from("trades").select("id,trade_date,pair,outcome,status,entry_reason,exit_reason,notes,review_comment,lesson_learned,emotion_notes")
      .eq("user_id", user.id).order("trade_date", { ascending: false }).order("created_at", { ascending: false }).limit(100),
    supabase.from("trades").select("id,trade_date,pair,outcome,status,entry_reason,exit_reason,notes,review_comment,lesson_learned,emotion_notes")
      .eq("user_id", user.id).eq("status", "Completed").order("trade_date", { ascending: false }).order("created_at", { ascending: false }).limit(12),
  ]);
  return <AppShell><AnalysisStudio userId={user.id} initialStudies={studies ?? []} recentTrades={trades ?? []} latestTrades={latestTrades ?? []} setupError={error?.message ?? null} aiConfigured={Boolean(process.env.OPENAI_API_KEY)} initialTradeId={trades?.some((trade) => trade.id === searchParams?.trade) ? searchParams?.trade : ""} /></AppShell>;
}
