"use client";

import { FormEvent, useState } from "react";

type Message = { role: "user" | "coach"; text: string };

export function JournalCoach() {
  const [messages, setMessages] = useState<Message[]>([{ role: "coach", text: "Ask about your process, discipline, rule warnings, or recent series. I will use your journal, not market predictions." }]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = question.trim();
    if (!text || busy) return;
    setQuestion("");
    setBusy(true);
    setMessages((current) => [...current, { role: "user", text }]);
    const response = await fetch("/api/coach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text }) });
    const body = await response.json();
    setMessages((current) => [...current, { role: "coach", text: response.ok ? body.reply : body.error }]);
    setBusy(false);
  }
  return <section className="mx-auto flex min-h-[580px] w-full max-w-3xl flex-col terminal-panel rounded-lg"><div className="border-b border-terminal-line p-5"><p className="font-mono text-xs uppercase text-terminal-cyan">coach / journal</p><h1 className="mt-2 text-2xl font-semibold text-terminal-text">Interactive performance review</h1></div><div className="flex-1 space-y-4 overflow-y-auto p-5">{messages.map((message, index) => <div key={index} className={`max-w-[85%] rounded border p-4 text-sm leading-6 ${message.role === "coach" ? "border-terminal-line bg-terminal-panel2 text-terminal-muted" : "ml-auto border-terminal-cyan/40 bg-terminal-cyan/10 text-terminal-text"}`}>{message.text}</div>)}</div><form onSubmit={submit} className="border-t border-terminal-line p-4"><label className="sr-only" htmlFor="coach-question">Ask your journal coach</label><div className="flex gap-3"><input id="coach-question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="What pattern should I investigate in my last 20 trades?" className="h-11 min-w-0 flex-1 rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text placeholder:text-terminal-muted/50" /><button disabled={busy} className="h-11 rounded bg-terminal-cyan px-5 font-semibold text-terminal-bg disabled:opacity-40">{busy ? "Thinking..." : "Ask"}</button></div></form></section>;
}
