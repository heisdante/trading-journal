"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, BookOpen, Check, CheckCircle2, CircleHelp, ExternalLink, FileImage, Link2, Loader2, Plus, RefreshCw, ScanSearch, Sparkles, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

type Study = Database["public"]["Tables"]["analysis_studies"]["Row"];
type Evidence = Database["public"]["Tables"]["analysis_evidence"]["Row"];
type Match = Database["public"]["Tables"]["analysis_matches"]["Row"];
type TradeOption = Pick<Database["public"]["Tables"]["trades"]["Row"], "id" | "trade_date" | "pair" | "outcome" | "status" | "entry_reason" | "exit_reason" | "notes" | "review_comment" | "lesson_learned" | "emotion_notes">;
type Kind = Evidence["kind"];
type Props = { userId: string; initialStudies: Study[]; recentTrades: TradeOption[]; latestTrades: TradeOption[]; setupError: string | null; initialTradeId?: string };

const supabase = createClient();
const dateLabel = (value: string) => new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
const isHttpUrl = (value: string) => { try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; } };

export function AnalysisStudio({ userId, initialStudies, recentTrades, latestTrades, setupError, initialTradeId = "" }: Props) {
  const initialTrade = recentTrades.find((trade) => trade.id === initialTradeId);
  const [studies, setStudies] = useState(initialStudies);
  const [activeId, setActiveId] = useState(initialStudies[0]?.id ?? "");
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  const [kind, setKind] = useState<Kind>("Note");
  const [entry, setEntry] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState(initialTrade ? `Study ${initialTrade.pair} ${(initialTrade.outcome ?? "trade").toLowerCase()}` : "");
  const [newOutcome, setNewOutcome] = useState<Study["outcome"]>(initialTrade?.outcome === "Win" || initialTrade?.outcome === "Loss" ? initialTrade.outcome : "Exploring");
  const [outcome, setOutcome] = useState<Study["outcome"]>("Exploring");
  const [tradeId, setTradeId] = useState(initialTradeId);
  const [cause, setCause] = useState("");
  const [lesson, setLesson] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");
  const [showCreate, setShowCreate] = useState(initialStudies.length === 0 || Boolean(initialTradeId));
  const [checkedCount, setCheckedCount] = useState<number | null>(null);

  const active = studies.find((study) => study.id === activeId);
  const latestTwelve = latestTrades;
  const tradeMap = useMemo(() => new Map([...recentTrades, ...latestTrades].map((trade) => [trade.id, trade])), [recentTrades, latestTrades]);

  const loadStudy = useCallback(async (id: string) => {
    const [{ data: rows, error: evidenceError }, { data: found, error: matchError }] = await Promise.all([
      supabase.from("analysis_evidence").select("*").eq("study_id", id).eq("user_id", userId).order("created_at", { ascending: true }),
      supabase.from("analysis_matches").select("*").eq("study_id", id).eq("user_id", userId).order("created_at", { ascending: false }),
    ]);
    if (evidenceError || matchError) { setNotice(evidenceError?.message || matchError?.message || "Could not load this study."); return; }
    setEvidence(rows ?? []);
    setMatches(found ?? []);
    const previews: Record<string, string> = {};
    for (const item of rows ?? []) {
      if (item.kind !== "Screenshot" || !item.storage_path) continue;
      const { data } = await supabase.storage.from("analysis-evidence").createSignedUrl(item.storage_path, 3600);
      if (data?.signedUrl) previews[item.id] = data.signedUrl;
    }
    setImageUrls(previews);
  }, [userId]);

  useEffect(() => {
    if (!active) return;
    setCause(active.cause);
    setOutcome(active.outcome);
    setLesson(active.lesson);
    setNextAction(active.next_action);
    setQuestions([]);
    setCheckedCount(null);
    setNotice("");
    void loadStudy(active.id);
  }, [activeId, active?.id, loadStudy]); // eslint-disable-line react-hooks/exhaustive-deps

  async function createStudy() {
    const cleanTitle = title.trim();
    if (!cleanTitle) { setNotice("Give this study a short title."); return; }
    setBusy("create"); setNotice("");
    const { data, error } = await supabase.from("analysis_studies").insert({
      user_id: userId, title: cleanTitle.slice(0, 160), outcome: newOutcome, trade_id: tradeId || null,
    }).select("*").single();
    setBusy("");
    if (error || !data) { setNotice(error?.message ?? "Could not create the study."); return; }
    setStudies((current) => [data, ...current]);
    setActiveId(data.id);
    setTitle(""); setTradeId(""); setNewOutcome("Exploring"); setShowCreate(false);
  }

  async function addEvidence() {
    if (!active) return;
    const body = entry.trim();
    if (kind === "Screenshot" && !file) { setNotice("Choose a screenshot to add."); return; }
    if (kind !== "Screenshot" && !body) { setNotice("Write a note or paste a link first."); return; }
    if (kind === "Link" && !isHttpUrl(body)) { setNotice("Use a full http or https link."); return; }
    if (file && (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 10_000_000)) {
      setNotice("Use a PNG, JPG, or WebP image under 10 MB."); return;
    }
    setBusy("evidence"); setNotice("");
    let storagePath: string | null = null;
    if (kind === "Screenshot" && file) {
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      storagePath = `${userId}/${active.id}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("analysis-evidence").upload(storagePath, file, { contentType: file.type, upsert: false });
      if (error) { setBusy(""); setNotice(error.message); return; }
    }
    const { data, error } = await supabase.from("analysis_evidence").insert({
      user_id: userId, study_id: active.id, kind, body: kind === "Screenshot" ? body.slice(0, 3000) : body.slice(0, 5000), storage_path: storagePath,
    }).select("*").single();
    setBusy("");
    if (error || !data) {
      if (storagePath) await supabase.storage.from("analysis-evidence").remove([storagePath]);
      setNotice(error?.message ?? "Could not save this evidence."); return;
    }
    setEvidence((current) => [...current, data]);
    const updatedAt = new Date().toISOString();
    void supabase.from("analysis_studies").update({ updated_at: updatedAt }).eq("id", active.id).eq("user_id", userId);
    setStudies((current) => current.map((study) => study.id === active.id ? { ...study, updated_at: updatedAt } : study));
    if (storagePath) {
      const { data: signed } = await supabase.storage.from("analysis-evidence").createSignedUrl(storagePath, 3600);
      if (signed?.signedUrl) setImageUrls((current) => ({ ...current, [data.id]: signed.signedUrl }));
    }
    setEntry(""); setFile(null);
    setNotice("Evidence added to this study.");
  }

  async function askAi() {
    if (!active) return;
    setBusy("ai"); setNotice("");
    try {
      const response = await fetch(`/api/analysis/${active.id}/assist`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ outcome }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setCause(result.cause); setLesson(result.lesson); setNextAction(result.next_action);
      setQuestions(result.questions ?? []);
      setNotice(`Draft ready. Review and save it in your own words. ${result.screenshotsReviewed} recent screenshot${result.screenshotsReviewed === 1 ? "" : "s"} examined.`);
    } catch (error) { setNotice(error instanceof Error ? error.message : "AI analysis is unavailable."); }
    setBusy("");
  }

  async function scanHistory(id = activeId) {
    if (!id) return;
    setBusy("scan"); setNotice("");
    try {
      const response = await fetch(`/api/analysis/${id}/scan`, { method: "POST" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setMatches(result.matches ?? []);
      setCheckedCount(result.checked ?? 0);
      setNotice(result.newSuggestions ? `${result.newSuggestions} possible repeat${result.newSuggestions === 1 ? "" : "s"} from ${result.method.toLowerCase()}. Check the evidence before confirming.` : `Latest completed trades checked using ${result.method.toLowerCase()}. You can also inspect and link one yourself.`);
    } catch (error) { setNotice(error instanceof Error ? error.message : "Could not check trade history."); }
    setBusy("");
  }

  async function saveConclusion(complete: boolean) {
    if (!active) return;
    if (complete && (outcome === "Exploring" || !cause.trim() || !lesson.trim())) {
      setNotice("Choose Win or Loss, then record the cause and lesson before completing the study."); return;
    }
    setBusy("save"); setNotice("");
    const { data, error } = await supabase.from("analysis_studies").update({
      cause: cause.trim().slice(0, 5000), lesson: lesson.trim().slice(0, 5000),
      next_action: nextAction.trim().slice(0, 5000), outcome, status: complete ? "Complete" : "In progress",
      updated_at: new Date().toISOString(),
    }).eq("id", active.id).eq("user_id", userId).select("*").single();
    setBusy("");
    if (error || !data) { setNotice(error?.message ?? "Could not save your conclusion."); return; }
    setStudies((current) => current.map((study) => study.id === data.id ? data : study));
    setNotice(complete ? "Study completed. Checking the latest 12 trades for possible repeats." : "Working conclusion saved.");
    if (complete) void scanHistory(data.id);
  }

  async function reviewMatch(match: Match, status: Match["review_status"]) {
    const { data, error } = await supabase.from("analysis_matches").update({ review_status: status })
      .eq("id", match.id).eq("user_id", userId).select("*").single();
    if (error || !data) { setNotice(error?.message ?? "Could not update review."); return; }
    setMatches((current) => current.map((item) => item.id === data.id ? data : item));
  }

  async function linkManually(trade: TradeOption) {
    if (!active) return;
    const { data, error } = await supabase.from("analysis_matches").upsert({
      user_id: userId, study_id: active.id, trade_id: trade.id,
      rationale: "Manually connected after reviewing this trade.",
      review_status: "Confirmed",
    }, { onConflict: "study_id,trade_id" }).select("*").single();
    if (error || !data) { setNotice(error?.message ?? "Could not link this trade."); return; }
    setMatches((current) => [data, ...current.filter((item) => item.trade_id !== trade.id)]);
    setNotice("Trade linked to this pattern by you.");
  }

  if (setupError) return <div className="analysis-setup"><ScanSearch size={28} /><h1>Analysis Studio needs its database update</h1><p>{setupError}</p><p>Apply the new analysis_studio migration to your Supabase project.</p></div>;

  return <div className="analysis-page">
    <header className="analysis-header">
      <div><p className="analysis-eyebrow"><span /> REVIEW & LEARN / ANALYSIS STUDIO</p><h1>Think with evidence.</h1><p>Collect the chart, your observations, and the lesson behind every win or loss. Notice a repeat. Decide what it means.</p></div>
      <button type="button" className="analysis-primary" onClick={() => { setShowCreate(true); setNotice(""); }}><Plus size={18} /> New study</button>
    </header>

    {notice && <div className="analysis-notice" role="status"><CircleHelp size={16} /><span>{notice}</span><button type="button" onClick={() => setNotice("")} aria-label="Dismiss message"><X size={16} /></button></div>}

    {showCreate && <section className="analysis-create" aria-label="Create study">
      <div><p className="analysis-kicker">START A THREAD OF EVIDENCE</p><h2>What are you studying?</h2><p>Start with a question. Add as much evidence as you need, then write the conclusion when you are ready.</p></div>
      <div className="analysis-create-fields">
        <label>Study title<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} placeholder="Why did my London breakout fail?" /></label>
        <div className="analysis-two-fields"><label>Outcome<select value={newOutcome} onChange={(event) => setNewOutcome(event.target.value as Study["outcome"])}><option>Exploring</option><option>Win</option><option>Loss</option></select></label>
        <label>Link a recorded trade <span>(optional)</span><select value={tradeId} onChange={(event) => { const id = event.target.value; setTradeId(id); const selected = recentTrades.find((trade) => trade.id === id); if (selected?.outcome === "Win" || selected?.outcome === "Loss") setNewOutcome(selected.outcome); }}><option value="">Standalone study</option>{recentTrades.map((trade) => <option key={trade.id} value={trade.id}>{trade.pair} · {trade.trade_date} · {trade.outcome || trade.status}</option>)}</select></label></div>
        <div className="analysis-actions"><button type="button" className="analysis-primary" onClick={() => void createStudy()} disabled={busy === "create"}>{busy === "create" ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Create study</button><button type="button" className="analysis-quiet" onClick={() => setShowCreate(false)}>Cancel</button></div>
      </div>
    </section>}

    <div className="analysis-grid">
      <aside className="analysis-library"><div className="analysis-panel-head"><div><p className="analysis-kicker">YOUR RESEARCH</p><h2>Studies <span>{studies.length}</span></h2></div></div>
        {studies.length ? <div className="analysis-study-list">{studies.map((study) => <button type="button" key={study.id} className={`analysis-study-item ${study.id === activeId ? "is-active" : ""}`} onClick={() => { setActiveId(study.id); setShowCreate(false); }}><span className={`analysis-outcome is-${study.outcome.toLowerCase().replace(" ", "-")}`}>{study.outcome}</span><strong>{study.title}</strong><small>{dateLabel(study.updated_at)} · {study.status}</small></button>)}</div> : <p className="analysis-empty-side">Your first study begins with one question about a trade.</p>}
        <div className="analysis-library-foot"><BookOpen size={17} /><span>Evidence stays private in your journal.</span></div>
      </aside>

      {active ? <main className="analysis-work">
        <div className="analysis-study-hero"><div><p className="analysis-kicker">OPEN STUDY / {active.status.toUpperCase()}</p><h2>{active.title}</h2><p>Build the sequence. Keep adding what you notice as your understanding changes.</p></div><span className={`analysis-outcome is-${active.outcome.toLowerCase().replace(" ", "-")}`}>{active.outcome}</span></div>
        {active.trade_id && <Link href={`/trades/${active.trade_id}`} className="analysis-linked-trade"><span>Linked trade · {tradeMap.get(active.trade_id)?.pair ?? "Open record"}</span><ArrowUpRight size={16} /></Link>}

        <section className="analysis-timeline-section"><div className="analysis-panel-head"><div><p className="analysis-kicker">01 / COLLECT</p><h3>Evidence timeline</h3></div><span>{evidence.length} item{evidence.length === 1 ? "" : "s"}</span></div>
          {evidence.length ? <ol className="analysis-timeline">{evidence.map((item, index) => <li key={item.id}><span className="analysis-step">{String(index + 1).padStart(2, "0")}</span><article><div className="analysis-evidence-meta"><span>{item.kind === "Screenshot" ? <FileImage size={14} /> : item.kind === "Link" ? <Link2 size={14} /> : <BookOpen size={14} />}{item.kind}</span><time>{dateLabel(item.created_at)}</time></div>{item.kind === "Link" ? <a href={item.body} target="_blank" rel="noopener noreferrer" className="analysis-evidence-link">{item.body}<ExternalLink size={14} /></a> : item.body ? <p>{item.body}</p> : null}{item.kind === "Screenshot" && imageUrls[item.id] && <a href={imageUrls[item.id]} target="_blank" rel="noopener noreferrer" aria-label="Open screenshot"><Image src={imageUrls[item.id]} alt={item.body || `Evidence screenshot ${index + 1}`} width={1000} height={560} unoptimized /></a>}</article></li>)}</ol> : <div className="analysis-empty-evidence"><ScanSearch size={25} /><strong>No evidence yet</strong><p>Add your first observation, chart link, or screenshot below.</p></div>}
        </section>

        <section className="analysis-composer"><div className="analysis-panel-head"><div><p className="analysis-kicker">KEEP THINKING</p><h3>Add what you see</h3></div></div>
          <div className="analysis-tabs" role="group" aria-label="Evidence type">{(["Note", "Link", "Screenshot"] as Kind[]).map((option) => <button type="button" key={option} aria-pressed={kind === option} className={kind === option ? "is-active" : ""} onClick={() => { setKind(option); setEntry(""); setFile(null); }}>{option}</button>)}</div>
          {kind === "Screenshot" ? <><label className="analysis-upload"><FileImage size={22} /><strong>{file?.name || "Choose a chart screenshot"}</strong><span>PNG, JPG, or WebP · up to 10 MB</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label><label className="analysis-field">What does this chart show? <span>(optional)</span><textarea value={entry} onChange={(event) => setEntry(event.target.value)} placeholder="I see the entry came before the retest..." rows={3} /></label></> :
          <label className="analysis-field">{kind === "Note" ? "Observation" : "Chart or reference URL"}{kind === "Note" ? <textarea value={entry} onChange={(event) => setEntry(event.target.value)} placeholder="What changed? What did you miss? What confirms or challenges your idea?" rows={4} /> : <input type="url" value={entry} onChange={(event) => setEntry(event.target.value)} placeholder="https://..." />}</label>}
          <div className="analysis-composer-foot"><p>{kind === "Link" ? "Links are saved as references. AI does not open external pages." : "Each addition stays in order, so you can follow how your thinking developed."}</p><button type="button" className="analysis-primary" onClick={() => void addEvidence()} disabled={busy === "evidence"}>{busy === "evidence" ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />} Add {kind.toLowerCase()}</button></div>
        </section>

        <section className="analysis-conclusion"><div className="analysis-panel-head"><div><p className="analysis-kicker">02 / SYNTHESIZE</p><h3>Turn evidence into a lesson</h3></div><button type="button" className="analysis-ai-button" onClick={() => void askAi()} disabled={busy === "ai" || !evidence.length}>{busy === "ai" ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Draft with AI</button></div>
          <p className="analysis-context">AI drafts from your notes and up to eight recent screenshots. It does not open URLs or prove causation. Review everything before saving.</p>
          <div className="analysis-conclusion-fields"><label className="analysis-field">Result being studied<select value={outcome} onChange={(event) => setOutcome(event.target.value as Study["outcome"])}><option>Exploring</option><option>Win</option><option>Loss</option></select></label><label className="analysis-field">What made this {outcome === "Win" ? "win possible" : outcome === "Loss" ? "loss happen" : "result happen"}?<textarea value={cause} onChange={(event) => setCause(event.target.value)} rows={3} placeholder="Describe the observed cause, and where you are still uncertain." /></label><label className="analysis-field">What did you learn?<textarea value={lesson} onChange={(event) => setLesson(event.target.value)} rows={3} placeholder="What would you recognize sooner next time?" /></label><label className="analysis-field">One action for the next setup<textarea value={nextAction} onChange={(event) => setNextAction(event.target.value)} rows={2} placeholder="A concrete habit or rule to carry forward." /></label></div>
          {questions.length > 0 && <div className="analysis-questions"><strong>Questions to investigate</strong>{questions.map((question) => <p key={question}><CircleHelp size={15} /> {question}</p>)}</div>}
          <div className="analysis-actions"><button type="button" className="analysis-primary" onClick={() => void saveConclusion(true)} disabled={busy === "save"}><Check size={17} /> Complete study</button><button type="button" className="analysis-quiet" onClick={() => void saveConclusion(false)} disabled={busy === "save"}>Save as in progress</button></div>
        </section>
      </main> : <main className="analysis-work analysis-empty-main"><ScanSearch size={38} /><h2>Your evidence starts here.</h2><p>Create a study for a win, a loss, or a question you are still exploring.</p><button type="button" className="analysis-primary" onClick={() => setShowCreate(true)}><Plus size={17} /> New study</button></main>}

      <aside className="analysis-watch"><div className="analysis-panel-head"><div><p className="analysis-kicker">03 / PATTERN WATCH</p><h2>Check for repeats</h2></div><ScanSearch size={19} /></div><p>Compare this lesson with your latest 12 completed trades. Suggestions are clues, never verdicts.</p>
        <button type="button" className="analysis-scan-button" onClick={() => void scanHistory()} disabled={!active || busy === "scan" || !active.cause || active.outcome === "Exploring"}>{busy === "scan" ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} Check latest 12 trades <ArrowRight size={16} /></button>
        {checkedCount !== null && <span className="analysis-count">Checked {checkedCount} completed trade{checkedCount === 1 ? "" : "s"}</span>}
        {matches.length > 0 && <div className="analysis-suggestions"><p className="analysis-kicker">REVIEWED CONNECTIONS</p>{matches.map((match) => { const trade = tradeMap.get(match.trade_id); return <article key={match.id}><div><span className={`analysis-match-state is-${match.review_status.toLowerCase()}`}>{match.review_status}</span><strong>{trade?.pair ?? "Trade"}</strong></div><p>{match.rationale}</p><Link href={`/trades/${match.trade_id}`}>Inspect record <ArrowUpRight size={14} /></Link>{match.review_status === "Suggested" && <div className="analysis-match-actions"><button type="button" onClick={() => void reviewMatch(match, "Confirmed")}><CheckCircle2 size={14} /> Confirm</button><button type="button" onClick={() => void reviewMatch(match, "Dismissed")}><X size={14} /> Dismiss</button></div>}</article>; })}</div>}
        <div className="analysis-manual"><p className="analysis-kicker">CHECK IT YOURSELF</p><h3>Recent completed trades</h3>{latestTwelve.length ? latestTwelve.map((trade) => <div key={trade.id} className="analysis-manual-trade"><div><strong>{trade.pair}</strong><span>{trade.trade_date} · {trade.outcome || "Unrated"}</span></div><div><Link href={`/trades/${trade.id}`} aria-label={`Inspect ${trade.pair}`}><ExternalLink size={15} /></Link>{active && !matches.some((match) => match.trade_id === trade.id && match.review_status === "Confirmed") && <button type="button" onClick={() => void linkManually(trade)} aria-label={`Mark ${trade.pair} as a confirmed repeat`} title="Mark as a confirmed repeat"><Plus size={15} /></button>}</div></div>) : <p>No completed trades yet.</p>}</div>
      </aside>
    </div>
  </div>;
}
