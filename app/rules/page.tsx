import { AppShell } from "@/components/app-shell";
import { addRuleAction, toggleRuleAction } from "@/lib/rules/actions";
import { createClient } from "@/lib/supabase/server";

export default async function RulesPage() {
  const supabase = createClient();
  const { data: rules } = await supabase.from("trading_rules").select("*").order("created_at", { ascending: true });
  return <AppShell>
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <section className="terminal-panel rounded-lg p-5">
        <p className="font-mono text-xs uppercase text-terminal-cyan">plan / rules</p>
        <h1 className="mt-2 text-2xl font-semibold text-terminal-text">Your trading rules</h1>
        <p className="mt-2 text-sm text-terminal-muted">Write rules as observable checks. The journal uses active rules during post-trade review.</p>
        <form action={addRuleAction} className="mt-5 space-y-4">
          <label className="block text-sm text-terminal-muted">Rule name<input name="title" required placeholder="Risk before reward" className="mt-2 h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text" /></label>
          <label className="block text-sm text-terminal-muted">Rule text<textarea name="rule_text" required rows={6} placeholder="I only enter when the stop is defined and the planned reward is at least 2R." className="mt-2 w-full resize-y rounded border border-terminal-line bg-terminal-bg px-3 py-3 text-terminal-text" /></label>
          <button className="h-11 rounded bg-terminal-cyan px-5 font-semibold text-terminal-bg">Save rule</button>
        </form>
      </section>
      <section className="space-y-3">
        <div className="flex items-end justify-between"><div><p className="font-mono text-xs uppercase text-terminal-cyan">active framework</p><h2 className="mt-1 text-xl font-semibold text-terminal-text">Rule set</h2></div><span className="number text-sm text-terminal-muted">{rules?.length ?? 0} rules</span></div>
        {rules?.length ? rules.map((rule) => <article key={rule.id} className="terminal-panel rounded-lg p-4"><div className="flex items-start justify-between gap-4"><div><h3 className="font-semibold text-terminal-text">{rule.title}</h3><p className="mt-2 text-sm leading-6 text-terminal-muted">{rule.rule_text}</p></div><form action={toggleRuleAction}><input type="hidden" name="id" value={rule.id} /><input type="hidden" name="is_active" value={String(rule.is_active)} /><button className="h-10 rounded border border-terminal-line px-3 text-xs text-terminal-muted hover:border-terminal-cyan hover:text-terminal-cyan">{rule.is_active ? "Active" : "Paused"}</button></form></div></article>) : <div className="terminal-panel rounded-lg p-8 text-sm text-terminal-muted">No rules yet. Add the first rule your future self should never negotiate.</div>}
      </section>
    </div>
  </AppShell>;
}
