"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Emotion } from "@/types/trade";

export async function saveDailyReviewAction(formData: FormData) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/login");
  const reviewDate = String(formData.get("review_date") ?? "").trim();
  const dayRating = Number(formData.get("day_rating"));
  const disciplineScore = Number(formData.get("discipline_score"));
  if (!reviewDate || dayRating < 1 || dayRating > 10 || disciplineScore < 0 || disciplineScore > 100) throw new Error("Review date, day rating, and discipline score are required");
  const { error } = await supabase.from("daily_reviews").upsert({ user_id: userData.user.id, review_date: reviewDate, day_rating: dayRating, discipline_score: disciplineScore, emotion: (String(formData.get("emotion") ?? "").trim() || null) as Emotion | null, summary: String(formData.get("summary") ?? "").trim() || null, lesson: String(formData.get("lesson") ?? "").trim() || null }, { onConflict: "user_id,review_date" });
  if (error) throw new Error(error.message);
  revalidatePath("/review");
  redirect("/review");
}
