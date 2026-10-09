"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { ArrowLeft, ArrowRight, Check, Link2, LoaderCircle, Play, Sparkles, WandSparkles } from "lucide-react";
import { addTradeAction } from "@/lib/trades/actions";
import { FormActionButton } from "@/components/form-action-button";

type Draft = {
  pair: string;
  market: string;
  direction: string;
  criteria_met: string;
  record_state: string;
  entry_reason: string;
  notes: string;
  questions: string[];
};

const markets = ["Forex", "Stocks", "Futures", "Crypto", "Indices", "Options", "Bonds", "Funds", "Economy"];
const sessions = ["London", "New York", "Asian", "Frankfurt"];
const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

function Choice({ label, name, value, selected, onSelect, detail }: { label: string; name: string; value: string; selected: string; onSelect: (value: string) => void; detail?: string }) {
  return <label className="quick-choice">
    <input type="radio" name={name} value={value} checked={selected === value} onChange={() => onSelect(value)} />
    <span><strong>{label}</strong>{detail && <small>{detail}</small>}</span>
  </label>;
}

export function QuickTradeCapture({ defaults, onGuided }: { defaults?: { market?: string | null; session?: string | null }; onGuided: () => void }) {
  const [stage, setStage] = useState<"compose" | "review">("compose");
  const [state, saveAction] = useFormState(addTradeAction, { error: null as string | null });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [roughNotes, setRoughNotes] = useState("");
  const [answers, setAnswers] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [aiUsed, setAiUsed] = useState(false);
  const [fields, setFields] = useState({
    date: today(), pair: "", market: defaults?.market || "Forex", direction: "",
    criteria_met: "", record_state: "", session: defaults?.session || "",
    entry_reason: "", notes: "",
  });
  const update = (name: keyof typeof fields, value: string) => setFields((current) => ({ ...current, [name]: value }));

  async function organize(refine = false) {
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const details = refine
        ? [roughNotes, fields.entry_reason && `Entry reason: ${fields.entry_reason}`, fields.notes && `Additional context: ${fields.notes}`, answers && `Answers to follow-up questions: ${answers}`, fields.direction && `Direction: ${fields.direction}`, fields.criteria_met && `Meets my criteria: ${fields.criteria_met}`, fields.record_state && `Trade state: ${fields.record_state}`].filter(Boolean).join("\n")
        : roughNotes;
      const response = await fetch("/api/trades/ai-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sourceUrl, pair: refine ? fields.pair : "", details }),
      });
      const draft = await response.json() as Draft & { error?: string; code?: string };
      if (!response.ok) {
        if (response.status === 400) {
          setMessage(draft.error || "Add a valid trade idea link.");
          return;
        }
        setMessage(draft.error || "AI is unavailable. Complete the essentials below.");
        setFields((current) => ({ ...current, notes: current.notes || roughNotes }));
        setQuestions([
          "Which symbol and direction is this idea for?",
          "Why would you enter, and does it meet your trading criteria?",
          "Is this a planned setup or a trade already active?",
        ]);
        setStage("review");
        return;
      }
      setFields((current) => ({
        ...current,
        pair: draft.pair || current.pair,
        market: draft.market || current.market,
        direction: draft.direction || current.direction,
        criteria_met: draft.criteria_met || current.criteria_met,
        record_state: draft.record_state || current.record_state,
        entry_reason: draft.entry_reason || current.entry_reason,
        notes: draft.notes || current.notes,
      }));
      setQuestions(draft.questions);
      setAiUsed(true);
      setAnswers("");
      setMessage(draft.questions.length ? "Draft organized. Answer any useful questions, then check the details before saving." : "Draft organized. Check the details before saving.");
      setStage("review");
    } catch {
      setMessage("The draft could not be created. You can still complete the essentials below.");
      setFields((current) => ({ ...current, notes: current.notes || roughNotes }));
      setQuestions([
        "Which symbol and direction is this idea for?",
        "Why would you enter, and does it meet your trading criteria?",
        "Is this a planned setup or a trade already active?",
      ]);
      setStage("review");
    } finally {
      setBusy(false);
    }
  }

  return <div className="quick-capture">
    <div className="quick-capture-orbit quick-capture-orbit-one" aria-hidden="true" />
    <div className="quick-capture-orbit quick-capture-orbit-two" aria-hidden="true" />
    <header className="quick-capture-head">
      <span className="quick-capture-kicker"><Sparkles size={14} /> Trading journal / quick capture</span>
      <button type="button" onClick={() => window.dispatchEvent(new Event("trading-journal:open-tour"))} className="quick-capture-tour"><Play size={14} /> Watch the guide</button>
    </header>

    <div className="quick-capture-intro">
      <span className="quick-capture-index">01 / Capture the idea</span>
      <h1>Record the trade.<br /><em>Keep the thinking.</em></h1>
      <p>Paste your trade idea link and a few words. The journal organizes the details, asks what is missing, and saves a record you can learn from.</p>
    </div>

    {stage === "compose" ? <div className="quick-composer">
      <label htmlFor="quick-url" className="quick-composer-label">Trade idea URL</label>
      <div className="quick-url-row"><Link2 size={20} aria-hidden="true" /><input id="quick-url" type="url" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="Paste a TradingView chart or trade idea URL" autoComplete="url" /></div>
      <label htmlFor="quick-note" className="quick-composer-label">What are you seeing? <span>Optional, but helps the draft</span></label>
      <textarea id="quick-note" rows={3} value={roughNotes} onChange={(event) => setRoughNotes(event.target.value)} placeholder="For example: EURUSD long at London open. Break and retest of yesterday's high..." />
      {message && <p role="alert" className="quick-message">{message}</p>}
      <div className="quick-composer-actions">
        <span>Your link stays attached to the trade. The AI does not inspect private charts.</span>
        <button type="button" onClick={() => void organize()} disabled={busy || !sourceUrl.trim()} className="quick-primary">{busy ? <LoaderCircle size={17} className="animate-spin" /> : <WandSparkles size={17} />}{busy ? "Organizing idea…" : "Organize my idea"}<ArrowRight size={17} /></button>
      </div>
    </div> : <form action={saveAction} className="quick-review">
      <div className="quick-review-heading">
        <div><span className="quick-capture-index">02 / Review and save</span><h2>{aiUsed ? "Your organized trade" : "Capture the essentials"}</h2><p>Only your confirmed details are saved. Add execution and outcome later from the trade page.</p></div>
        <button type="button" onClick={() => setStage("compose")} className="quick-back"><ArrowLeft size={16} /> Edit source</button>
      </div>
      {message && <p role="status" className="quick-message">{message}</p>}
      {questions.length > 0 && <div className="quick-questions">
        <span className="quick-capture-index"><Sparkles size={13} /> {aiUsed ? "A few things to clarify" : "Answer these in the fields below"}</span>
        <ol>{questions.map((question, index) => <li key={index}>{question}</li>)}</ol>
        {aiUsed && <><label htmlFor="quick-answers">Your answers</label>
          <textarea id="quick-answers" rows={2} value={answers} onChange={(event) => setAnswers(event.target.value)} placeholder="Answer in your own words, or edit the fields below." />
          <button type="button" onClick={() => void organize(true)} disabled={busy || !answers.trim()} className="quick-refine">{busy ? "Updating…" : "Update draft with my answers"} <ArrowRight size={15} /></button></>}
      </div>}
      <div className="quick-field-grid">
        <label>Date spotted<input name="date" type="date" value={fields.date} onChange={(event) => update("date", event.target.value)} /></label>
        <label>Pair or symbol<input name="pair" value={fields.pair} onChange={(event) => update("pair", event.target.value)} placeholder="EUR/USD, AAPL, BTC/USD" /></label>
        <label>Market<select name="market" value={fields.market} onChange={(event) => update("market", event.target.value)}>{markets.map((market) => <option key={market}>{market}</option>)}</select></label>
        <label>Session <small>Optional</small><select name="session" value={fields.session} onChange={(event) => update("session", event.target.value)}><option value="">Choose a session</option>{sessions.map((session) => <option key={session}>{session}</option>)}</select></label>
      </div>
      <fieldset className="quick-fieldset"><legend>Direction</legend><div className="quick-choice-row"><Choice label="Long" name="direction" value="Long" selected={fields.direction} onSelect={(value) => update("direction", value)} /><Choice label="Short" name="direction" value="Short" selected={fields.direction} onSelect={(value) => update("direction", value)} /></div></fieldset>
      <fieldset className="quick-fieldset"><legend>Does it meet your trading criteria?</legend><div className="quick-choice-row"><Choice label="Yes" name="criteria_met" value="yes" selected={fields.criteria_met} onSelect={(value) => update("criteria_met", value)} /><Choice label="No" name="criteria_met" value="no" selected={fields.criteria_met} onSelect={(value) => update("criteria_met", value)} /></div></fieldset>
      <div className="quick-field-grid quick-field-grid-full">
        <label>Trade idea URL<input name="trade_idea_link" type="url" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="https://…" /></label>
        <label>Entry reason<textarea name="entry_reason" rows={3} value={fields.entry_reason} onChange={(event) => update("entry_reason", event.target.value)} placeholder="Why does this setup deserve an entry?" /></label>
        <label>Additional context <small>Optional</small><textarea name="notes" rows={2} value={fields.notes} onChange={(event) => update("notes", event.target.value)} placeholder="What should your future self remember?" /></label>
      </div>
      <fieldset className="quick-fieldset"><legend>How should this be saved?</legend><div className="quick-choice-row"><Choice label="Planned setup" detail="Entry has not happened." name="record_state" value="Planned" selected={fields.record_state} onSelect={(value) => update("record_state", value)} /><Choice label="Active trade" detail="Entry has happened; add prices later." name="record_state" value="Active" selected={fields.record_state} onSelect={(value) => update("record_state", value)} /></div></fieldset>
      {state.error && <p role="alert" className="quick-error">{state.error}</p>}
      <div className="quick-save-row"><span>Review the record before saving. You can update it as the trade unfolds.</span><FormActionButton pendingText="Saving trade…" className="quick-primary">Save trade <Check size={17} /></FormActionButton></div>
    </form>}
    <footer className="quick-capture-foot"><span>Plan <i /> Execute <i /> Reflect</span><button type="button" onClick={onGuided}>Use guided journal <ArrowRight size={15} /></button></footer>
  </div>;
}
