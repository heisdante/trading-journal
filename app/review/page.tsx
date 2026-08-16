import { AppShell } from "@/components/app-shell";
import { saveDailyReviewAction } from "@/lib/reviews/actions";
import { createClient } from "@/lib/supabase/server";

const emotions = ["Calm", "Confident", "Focused", "Anxious", "Fearful", "Frustrated", "Excited", "Tired", "Angry"];

export default async function ReviewPage() {
  const supabase = createClient();
  const { data: review } = await supabase.from("daily_reviews").select("*").order("review_date", { ascending: false }).limit(1).maybeSingle();

  return (
    <AppShell>
      <section className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg terminal-panel">
        <div className="app-page-heading border-b border-terminal-line p-5">
          <p className="font-mono text-xs uppercase text-terminal-cyan">review / daily</p>
          <h1 className="mt-2 text-2xl font-semibold text-terminal-text">Rate the day, keep the lesson</h1>
          <p className="mt-2 text-sm leading-6 text-terminal-muted">
            A daily review separates an unlucky result from a day where the process slipped.
          </p>
        </div>

        <form action={saveDailyReviewAction} className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="text-sm text-terminal-muted">
            Date
            <input name="review_date" type="date" defaultValue={review?.review_date ?? new Date().toISOString().slice(0, 10)} required className="mt-2 h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text" />
          </label>
          <label className="text-sm text-terminal-muted">
            How did you handle trading? (1-10)
            <input name="day_rating" type="number" min="1" max="10" defaultValue={review?.day_rating ?? 5} required className="number mt-2 h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text" />
          </label>
          <label className="text-sm text-terminal-muted">
            Your discipline score (0-100)
            <input name="discipline_score" type="number" min="0" max="100" defaultValue={review?.discipline_score ?? 50} required className="number mt-2 h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text" />
          </label>
          <label className="text-sm text-terminal-muted">
            Dominant emotion
            <select name="emotion" defaultValue={review?.emotion ?? ""} className="mt-2 h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text">
              <option value="">Select one</option>
              {emotions.map((emotion) => (
                <option key={emotion}>{emotion}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-terminal-muted sm:col-span-2">
            What happened?
            <textarea name="summary" rows={4} defaultValue={review?.summary ?? ""} className="mt-2 w-full resize-y rounded border border-terminal-line bg-terminal-bg px-3 py-3 text-terminal-text" />
          </label>
          <label className="text-sm text-terminal-muted sm:col-span-2">
            What will you repeat or change tomorrow?
            <textarea name="lesson" rows={4} defaultValue={review?.lesson ?? ""} className="mt-2 w-full resize-y rounded border border-terminal-line bg-terminal-bg px-3 py-3 text-terminal-text" />
          </label>
          <div className="sm:col-span-2">
            <button className="h-11 rounded bg-terminal-cyan px-5 font-semibold text-terminal-bg transition hover:bg-cyan-300 hover:shadow-glow">
              Save daily review
            </button>
          </div>
        </form>
      </section>
    </AppShell>
  );
}
