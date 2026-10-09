"use client";

import Link from "next/link";
import { useState } from "react";

export function TradeAutomation() {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState("MT4 / MT5 / cTrader CSV");
  const [status, setStatus] = useState("");
  const [importBusy, setImportBusy] = useState(false);

  async function importFile() {
    if (!file || importBusy) return;
    setImportBusy(true);
    setStatus("Reading file...");
    try {
      const response = await fetch("/api/trades/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv: await file.text(), source }),
      });
      const body = await response.json();
      setStatus(response.ok ? `${body.imported} trades imported` : body.error);
    } catch {
      setStatus("Could not import this file. Try again.");
    } finally {
      setImportBusy(false);
    }
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
        <button type="button" onClick={importFile} disabled={!file || importBusy} className="mt-4 h-11 rounded bg-terminal-cyan px-5 font-semibold text-terminal-bg transition hover:bg-cyan-300 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-40">{importBusy ? "Importing…" : "Import trades"}</button>
      </section>

      <section className="terminal-panel app-chart-panel rounded-lg p-5">
        <p className="font-mono text-xs uppercase text-terminal-cyan">idea / assist</p>
        <h2 className="mt-2 text-2xl font-semibold text-terminal-text">Capture a new trade idea</h2>
        <p className="mt-3 text-sm leading-6 text-terminal-muted">Paste a trade idea link in Quick capture. The journal will organize your notes, ask what is missing, and let you review everything before saving.</p>
        <Link href="/log" className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-terminal-cyan px-5 text-sm font-semibold text-terminal-bg transition hover:brightness-110">Open Quick capture →</Link>
      </section>
      {status ? <p role="status" className="text-sm text-terminal-muted lg:col-span-2">{status}</p> : null}
    </div>
  );
}
