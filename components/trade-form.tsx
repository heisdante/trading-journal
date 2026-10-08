"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { ArrowLeft, ArrowRight, Check, ChevronDown, ClipboardCheck, Compass, Lightbulb, Sparkles } from "lucide-react";
import { addTradeAction } from "@/lib/trades/actions";
import { FormActionButton } from "@/components/form-action-button";

const markets = ["Forex", "Stocks", "Futures", "Crypto", "Indices", "Options", "Bonds", "Funds", "Economy"];
const sessions = ["London", "New York", "Asian", "Frankfurt"];
const emotions = ["Calm", "Confident", "Focused", "Anxious", "Fearful", "Frustrated", "Excited", "Tired", "Angry"];
const steps = [
  { label: "Setup", hint: "The idea", icon: Compass },
  { label: "Context", hint: "Trade details", icon: Lightbulb },
  { label: "Review", hint: "Check details", icon: ClipboardCheck },
  { label: "Reflect & save", hint: "Your decision", icon: Sparkles },
];

const controlClass = "mt-2 h-12 w-full rounded-md border border-terminal-line bg-terminal-bg px-3.5 text-terminal-text outline-none transition duration-200 placeholder:text-terminal-muted/55 hover:border-terminal-cyan/40 focus:border-terminal-cyan focus:ring-2 focus:ring-terminal-cyan/15";
const textareaClass = "mt-2 w-full resize-y rounded-md border border-terminal-line bg-terminal-bg px-3.5 py-3 text-terminal-text outline-none transition duration-200 placeholder:text-terminal-muted/55 hover:border-terminal-cyan/40 focus:border-terminal-cyan focus:ring-2 focus:ring-terminal-cyan/15";

function Field({ label, name, value, onChange, type = "text", placeholder, options, defaultOption = "Choose when ready" }: {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  type?: string;
  placeholder?: string;
  options?: string[];
  defaultOption?: string;
}) {
  return <label className="block text-sm font-medium text-terminal-muted">{label}{options ? <span className="relative block"><select name={name} value={value} onChange={(event) => onChange(name, event.target.value)} className={`${controlClass} appearance-none pr-11`}><option value="">{defaultOption}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-terminal-muted" /></span> : <input name={name} type={type} step={type === "number" ? "any" : undefined} inputMode={type === "number" ? "decimal" : undefined} value={value} onChange={(event) => onChange(name, event.target.value)} placeholder={placeholder} className={controlClass} />}</label>;
}

function NoteField({ label, name, value, onChange, placeholder, rows = 3 }: { label: string; name: string; value: string; onChange: (name: string, value: string) => void; placeholder: string; rows?: number }) {
  return <label className="block text-sm font-medium text-terminal-muted">{label}<textarea name={name} rows={rows} value={value} onChange={(event) => onChange(name, event.target.value)} placeholder={placeholder} className={textareaClass} /></label>;
}

export function TradeForm({ defaults }: { defaults?: { market?: string | null; session?: string | null } }) {
  const [step, setStep] = useState(0);
  const [state, formAction] = useFormState(addTradeAction, { error: null as string | null });
  const today = new Date();
  const [values, setValues] = useState<Record<string, string>>({
    date: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
    market: defaults?.market ?? "Forex",
    direction: "",
    criteria_met: "",
    session: defaults?.session ?? "",
    record_state: "",
  });
  const [flags, setFlags] = useState({ fomo: false, cut_winner_early: false, revenge_trade: false });
  const update = (name: string, value: string) => setValues((current) => ({ ...current, [name]: value }));

  return <form action={formAction} onKeyDown={(event) => { if (step < 3 && event.key === "Enter" && !(event.target instanceof HTMLTextAreaElement)) event.preventDefault(); }} className="trade-wizard mx-auto w-full max-w-5xl overflow-hidden rounded-xl bg-terminal-panel shadow-[0_24px_72px_rgba(0,0,0,0.18)]">
    <header className="bg-terminal-panel2/55 px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div><p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-terminal-cyan"><Sparkles className="h-3.5 w-3.5" />Trade journal / guided entry</p><h1 className="mt-3 text-2xl font-semibold tracking-tight text-terminal-text sm:text-3xl">Record your trade</h1><p className="mt-2 max-w-xl text-sm leading-6 text-terminal-muted">Capture the idea and context, then choose whether it is planned or already active.</p></div>
        <div className="shrink-0 rounded-xl bg-terminal-bg/70 px-4 py-2.5"><p className="font-mono text-[10px] uppercase tracking-wider text-terminal-muted">Progress</p><p className="mt-1 text-sm font-semibold text-terminal-text">Step {step + 1} <span className="font-normal text-terminal-muted">of {steps.length}</span></p></div>
      </div>
      <ol aria-label="Trade entry steps" className="mt-7 grid grid-cols-4 gap-2 sm:gap-4">{steps.map(({ label, hint, icon: Icon }, index) => <li key={label} aria-current={step === index ? "step" : undefined} className="min-w-0"><div className={`flex items-center gap-2.5 border-t-2 pt-3 transition-colors sm:gap-3 ${index <= step ? "border-terminal-cyan" : "border-terminal-line"}`}><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${index < step ? "bg-terminal-cyan text-terminal-bg" : index === step ? "bg-terminal-cyan/15 text-terminal-cyan" : "bg-terminal-bg text-terminal-muted"}`}>{index < step ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}</span><span className="min-w-0"><span className={`block truncate text-xs font-semibold sm:text-sm ${index === step ? "text-terminal-text" : "text-terminal-muted"}`}>{label}</span><span className="hidden text-xs text-terminal-muted sm:block">{hint}</span></span></div></li>)}</ol>
    </header>

    <section hidden={step !== 0} aria-labelledby="trade-setup-title" className="p-5 sm:p-8">
      <div className="mb-6"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-terminal-cyan">01 / define the idea</p><h2 id="trade-setup-title" className="mt-2 text-xl font-semibold text-terminal-text">What are you watching?</h2><p className="mt-1 text-sm text-terminal-muted">Capture the market and direction. You’ll add the entry reason before saving.</p></div>
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2"><Field label="Date spotted" name="date" type="date" value={values.date} onChange={update} /><Field label="Pair or symbol" name="pair" value={values.pair ?? ""} onChange={update} placeholder="EUR/USD, AAPL, BTC/USD" /><Field label="Market" name="market" value={values.market} onChange={update} options={markets} defaultOption="Choose a market" />
        <fieldset className="sm:col-span-2"><legend className="text-sm font-medium text-terminal-muted">Trade direction</legend><div className="mt-2 grid grid-cols-2 gap-3">{["Long", "Short"].map((direction) => <label key={direction} className="cursor-pointer"><input className="peer sr-only" type="radio" name="direction" value={direction} checked={values.direction === direction} onChange={(event) => update("direction", event.target.value)} /><span className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-terminal-line bg-terminal-bg text-sm font-semibold text-terminal-muted transition hover:border-terminal-cyan/50 peer-checked:border-terminal-cyan peer-checked:bg-terminal-cyan/10 peer-checked:text-terminal-cyan peer-focus-visible:ring-2 peer-focus-visible:ring-terminal-cyan/50">{direction === "Long" ? "↗" : "↘"}<span>{direction}</span></span></label>)}</div></fieldset>
        <fieldset className="rounded-md border border-terminal-line bg-terminal-bg/55 p-4 sm:col-span-2"><legend className="px-1 text-sm font-medium text-terminal-muted">Does this idea meet your criteria?</legend><div className="mt-1 grid grid-cols-2 gap-3">{[["yes", "Yes, it qualifies"], ["no", "No, outside my rules"]].map(([value, label]) => <label key={value} className="cursor-pointer"><input className="peer sr-only" type="radio" name="criteria_met" value={value} checked={values.criteria_met === value} onChange={(event) => update("criteria_met", event.target.value)} /><span className="flex min-h-11 items-center justify-center rounded-md border border-terminal-line px-3 text-sm text-terminal-muted transition hover:border-terminal-cyan/50 peer-checked:border-terminal-cyan peer-checked:bg-terminal-cyan/10 peer-checked:font-semibold peer-checked:text-terminal-cyan peer-focus-visible:ring-2 peer-focus-visible:ring-terminal-cyan/50">{label}</span></label>)}</div></fieldset>
      </div>
      <div className="mt-8 flex justify-end border-t border-terminal-line pt-5"><button type="button" onClick={() => setStep(1)} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-terminal-cyan px-5 text-sm font-semibold text-terminal-bg transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-cyan sm:w-auto">Next: trading context <ArrowRight className="h-4 w-4" /></button></div>
    </section>

    <section hidden={step !== 1} aria-labelledby="trade-context-title" className="p-5 sm:p-8">
      <div className="mb-6"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-terminal-cyan">02 / add context</p><h2 id="trade-context-title" className="mt-2 text-xl font-semibold text-terminal-text">Trading context</h2><p className="mt-1 text-sm text-terminal-muted">Keep the session, chart, and notes behind this decision.</p></div>
      <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2"><Field label="Market session" name="session" value={values.session} onChange={update} options={sessions} /><Field label="Trade idea link (optional)" name="trade_idea_link" value={values.trade_idea_link ?? ""} onChange={update} placeholder="https://…" />
        <label className="block text-sm font-medium text-terminal-muted sm:col-span-2">Chart screenshots<input name="screenshots" type="file" accept="image/*" multiple className="mt-2 block min-h-12 w-full rounded-md border border-terminal-line bg-terminal-bg px-3 py-2 text-sm text-terminal-muted file:mr-3 file:min-h-8 file:rounded file:border-0 file:bg-terminal-cyan/15 file:px-3 file:font-semibold file:text-terminal-cyan hover:border-terminal-cyan/40" /><span className="mt-1 block text-xs font-normal text-terminal-muted">Optional. Attach the chart you are using to plan this setup.</span></label>
        <div className="sm:col-span-2"><NoteField label="Additional notes" name="notes" value={values.notes ?? ""} onChange={update} placeholder="Other context you want your future self to remember." rows={3} /></div>
      </div>
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-terminal-line pt-5 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={() => setStep(0)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-terminal-line px-5 text-sm font-medium text-terminal-muted transition hover:border-terminal-cyan/50 hover:text-terminal-text"><ArrowLeft className="h-4 w-4" />Back</button><button type="button" onClick={() => setStep(2)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-terminal-cyan px-5 text-sm font-semibold text-terminal-bg transition hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-cyan">Review your idea <ArrowRight className="h-4 w-4" /></button></div>
      </section>

    <section hidden={step !== 2} aria-labelledby="trade-review-title" className="p-5 sm:p-8">
      <div className="mb-6"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-terminal-cyan">03 / review</p><h2 id="trade-review-title" className="mt-2 text-xl font-semibold text-terminal-text">Review your trade</h2><p className="mt-1 text-sm text-terminal-muted">Check everything you recorded. Edit any detail before the final check-in.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <article className="rounded-xl bg-terminal-bg/55 p-4"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Trade idea</h3><button type="button" onClick={() => setStep(0)} className="text-xs font-semibold text-terminal-cyan">Edit</button></div><p className="mt-3 text-sm text-terminal-muted">{values.pair || "No symbol yet"} · {values.direction || "Direction not selected"} · {values.market}</p><p className="mt-2 text-sm text-terminal-muted">{values.date} · Criteria: {values.criteria_met === "yes" ? "Yes" : values.criteria_met === "no" ? "No" : "Not selected"}</p><p className="mt-3 text-sm leading-6 text-terminal-muted">Entry reason comes next, before you save.</p></article>
        <article className="rounded-xl bg-terminal-bg/55 p-4"><div className="flex items-center justify-between"><h3 className="text-sm font-semibold">Context</h3><button type="button" onClick={() => setStep(1)} className="text-xs font-semibold text-terminal-cyan">Edit</button></div><p className="mt-3 text-sm text-terminal-muted">{values.session || "No session selected"}</p><p className="mt-3 text-sm leading-6 text-terminal-text">{values.notes || "No additional notes yet"}</p></article>
      </div>
      <div className="mt-8 flex flex-col-reverse gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={() => setStep(1)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-terminal-panel2 px-5 text-sm font-medium text-terminal-muted"><ArrowLeft className="h-4 w-4" />Back</button><button type="button" onClick={() => setStep(3)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-terminal-cyan px-5 text-sm font-semibold text-terminal-bg">Continue to reflection <ArrowRight className="h-4 w-4" /></button></div>
    </section>

    <section hidden={step !== 3} aria-labelledby="trade-reflect-title" className="p-5 sm:p-8">
      <div className="mb-6"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-terminal-cyan">04 / final check-in</p><h2 id="trade-reflect-title" className="mt-2 text-xl font-semibold">How do you feel about this recorded trade?</h2><p className="mt-1 text-sm text-terminal-muted">Your emotion and mindset notes will stay with this trade.</p></div>
      <div className="space-y-5 rounded-xl bg-terminal-panel2/60 p-4 sm:p-5"><Field label="Emotion" name="emotion" value={values.emotion ?? ""} onChange={update} options={emotions} defaultOption="Choose an emotion" /><NoteField label="Mindset notes" name="emotion_notes" value={values.emotion_notes ?? ""} onChange={update} placeholder="What thoughts or pressures shaped this decision?" rows={3} />
        <fieldset><legend className="text-sm font-medium text-terminal-muted">Anything influencing your decisions?</legend><div className="mt-3 grid gap-3 sm:grid-cols-3">{[["fomo", "FOMO", "Rushing to catch a move"], ["cut_winner_early", "Early exit concern", "Worried about letting a win run"], ["revenge_trade", "Revenge impulse", "Trying to recover a recent loss"]].map(([name, label, hint]) => <label key={name} className={`flex min-h-[76px] cursor-pointer items-start gap-3 rounded-xl p-3 ${flags[name as keyof typeof flags] ? "bg-terminal-amber/10" : "bg-terminal-bg/60"}`}><input name={name} type="checkbox" checked={flags[name as keyof typeof flags]} onChange={(event) => setFlags((current) => ({ ...current, [name]: event.target.checked }))} className="mt-1 h-4 w-4 shrink-0" /><span><span className="block text-sm font-medium text-terminal-text">{label}</span><span className="mt-1 block text-xs leading-5 text-terminal-muted">{hint}</span></span></label>)}</div></fieldset></div>
      <fieldset className="mt-6"><legend className="text-sm font-semibold">How should this trade be saved?</legend><p className="mt-1 text-xs text-terminal-muted">Choose after reviewing the full record.</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{[["Planned", "Planned setup", "Entry has not happened yet."], ["Active", "Trade already active", "Entry has happened; record its price and stop."]].map(([value, label, hint]) => <label key={value} className="cursor-pointer"><input type="radio" name="record_state" value={value} checked={values.record_state === value} onChange={(event) => update("record_state", event.target.value)} className="peer sr-only" /><span className="block min-h-[82px] rounded-xl bg-terminal-bg p-4 peer-checked:bg-terminal-cyan/10 peer-focus-visible:ring-2 peer-focus-visible:ring-terminal-cyan/50"><span className="block text-sm font-semibold text-terminal-text">{label}</span><span className="mt-1 block text-xs text-terminal-muted">{hint}</span></span></label>)}</div></fieldset>
      {values.record_state === "Active" && <div className="mt-4 grid gap-4 rounded-xl bg-terminal-bg/55 p-4 sm:grid-cols-2"><Field label="Actual entry price" name="entry_price" type="number" value={values.entry_price ?? ""} onChange={update} placeholder="0.00" /><Field label="Protective stop price" name="stop_price" type="number" value={values.stop_price ?? ""} onChange={update} placeholder="0.00" /><p className="text-xs text-terminal-muted sm:col-span-2">Add your exit and outcome from this trade’s page when it closes.</p></div>}
      <div className="mt-5"><NoteField label="Entry reason" name="entry_reason" value={values.entry_reason ?? ""} onChange={update} placeholder={values.record_state === "Active" ? "Why did you enter this trade?" : "What conditions would make you enter this setup?"} rows={4} /><p className="mt-1 text-xs text-terminal-muted">This is saved with the trade and used in your later review.</p></div>
      {state.error && <p role="alert" className="mt-5 rounded-xl bg-terminal-red/10 px-4 py-3 text-sm text-terminal-red">{state.error}</p>}
      <div className="mt-8 flex flex-col-reverse gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between"><button type="button" onClick={() => setStep(2)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-terminal-panel2 px-5 text-sm font-medium text-terminal-muted"><ArrowLeft className="h-4 w-4" />Back to review</button><FormActionButton pendingText="Saving trade…" className="min-h-12 w-full rounded-xl bg-terminal-cyan px-5 text-sm font-semibold text-terminal-bg hover:brightness-110 sm:w-auto">{values.record_state === "Active" ? "Save active trade" : values.record_state === "Planned" ? "Save planned setup" : "Save trade"} <Check className="ml-2 inline h-4 w-4" /></FormActionButton></div>
    </section>
  </form>;
}
