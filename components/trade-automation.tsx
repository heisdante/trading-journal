"use client";

import { useState } from "react";

type Draft = { pair: string; market: string; setup_name: string; direction: string; entry_reason: string; notes: string; missing_fields: string[] };

export function TradeAutomation() {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState("MT4 / MT5 / cTrader CSV");
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [aiBusy, setAiBusy] = useState(false);

  async function importFile() {
    if (!file) return;
    setStatus("Reading file...");
    const response = await fetch("/api/trades/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ csv: await file.text(), source }),
    });
    const body = await response.json();
    setStatus(response.ok ? `${body.imported} trades imported` : body.error);
  }

  async function makeDraft(formData: FormData) {
    setAiBusy(true);
    setStatus("Creating draft...");
    const response = await fetch("/api/trades/ai-draft", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(formData)) });
    const body = await response.json();
    setAiBusy(false);
    if (!response.ok) return setStatus(body.error);
    setDraft(body);
    setStatus("Draft ready. Review it before logging the trade.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="terminal-panel app-chart-panel rounded-lg p-5">
        <p className="font-mono text-xs uppercase text-terminal-cyan">trades / import</p>
        <h1 className="mt-2 text-2xl font-semibold text-terminal-text">Bring in platform history</h1>
        <p className="mt-2 text-sm text-terminal-muted">Export account history as CSV from MT4, MT5, or cTrader. The journal maps the execution fields and keeps the source ticket for traceability.</p>
        <label className="mt-5 block text-sm text-terminal-muted">Source platform
          <select value={source} onChange={(event) => setSource(event.target.value)} className="mt-2 h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text">
            <option>MT4 / MT5 CSV</option><option>cTrader CSV</option><option>Other CSV</option>
          </select>
        </label>
        <input type="file" accept=".csv,.txt" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="mt-4 block w-full rounded border border-terminal-line bg-terminal-bg px-3 py-2 text-sm text-terminal-muted" />
        <button type="button" onClick={importFile} disabled={!file} className="mt-4 h-11 rounded bg-terminal-cyan px-5 font-semibold text-terminal-bg transition hover:bg-cyan-300 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40">Import trades</button>
      </section>

      <section className="terminal-panel app-chart-panel rounded-lg p-5">
        <p className="font-mono text-xs uppercase text-terminal-cyan">idea / assist</p>
        <h2 className="mt-2 text-2xl font-semibold text-terminal-text">Turn a rough idea into a draft</h2>
        <form action={makeDraft} className="mt-5 space-y-4">
          <input name="pair" placeholder="Pair or symbol, e.g. EURUSD" className="h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text placeholder:text-terminal-muted/50" />
          <input name="url" type="url" placeholder="Reference chart or idea URL" className="h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text placeholder:text-terminal-muted/50" />
          <textarea name="details" rows={5} placeholder="What are you seeing? Bias, setup, invalidation, and execution plan..." className="w-full resize-y rounded border border-terminal-line bg-terminal-bg px-3 py-3 text-terminal-text placeholder:text-terminal-muted/50" />
          <button type="submit" disabled={aiBusy} className="h-11 rounded border border-terminal-cyan px-5 font-semibold text-terminal-cyan transition hover:bg-terminal-cyan/10 disabled:opacity-40">{aiBusy ? "Drafting..." : "Create AI draft"}</button>
        </form>
        {draft ? <div className="mt-5 border-t border-terminal-line pt-4 text-sm text-terminal-muted"><p className="font-semibold text-terminal-text">{draft.pair} · {draft.direction} · {draft.setup_name}</p><p className="mt-2">{draft.entry_reason}</p><p className="mt-2">{draft.notes}</p>{draft.missing_fields.length ? <p className="mt-2 text-terminal-amber">Still needed: {draft.missing_fields.join(", ")}</p> : null}</div> : null}
      </section>
      {status ? <p className="text-sm text-terminal-muted lg:col-span-2">{status}</p> : null}
    </div>
  );
}
