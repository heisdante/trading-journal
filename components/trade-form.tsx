import { addTradeAction } from "@/lib/trades/actions";

function Field({
  label,
  name,
  type = "text",
  required = true,
  placeholder,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm text-terminal-muted">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        step={step}
        className="number mt-2 h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text outline-none transition placeholder:text-terminal-muted/50 focus:border-terminal-cyan"
      />
    </label>
  );
}

export function TradeForm() {
  return (
    <form action={addTradeAction} className="terminal-panel rounded-lg p-5">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase text-terminal-cyan">trade / new</p>
        <h1 className="mt-2 text-2xl font-semibold text-terminal-text">Log a trade</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Date" name="date" type="date" />
        <Field label="Setup name" name="setup_name" placeholder="Breakout retest" />

        <label className="block">
          <span className="text-sm text-terminal-muted">Direction</span>
          <select
            name="direction"
            defaultValue="Long"
            className="mt-2 h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text outline-none transition focus:border-terminal-cyan"
          >
            <option>Long</option>
            <option>Short</option>
          </select>
        </label>

        <label className="flex h-[68px] items-end">
          <span className="flex h-11 w-full items-center justify-between rounded border border-terminal-line bg-terminal-bg px-3">
            <span className="text-sm text-terminal-muted">Criteria met</span>
            <input name="criteria_met" type="checkbox" className="h-4 w-4 accent-terminal-cyan" />
          </span>
        </label>

        <Field label="Entry price" name="entry_price" type="number" step="0.000001" />
        <Field label="Stop price" name="stop_price" type="number" step="0.000001" />
        <Field label="Target price" name="target_price" type="number" step="0.000001" required={false} />
        <Field label="Exit price" name="exit_price" type="number" step="0.000001" />
      </div>

      <label className="mt-4 block">
        <span className="text-sm text-terminal-muted">Notes</span>
        <textarea
          name="notes"
          rows={5}
          className="mt-2 w-full resize-y rounded border border-terminal-line bg-terminal-bg px-3 py-3 text-terminal-text outline-none transition placeholder:text-terminal-muted/50 focus:border-terminal-cyan"
          placeholder="Context, execution quality, emotions, screenshots link..."
        />
      </label>

      <div className="mt-6 flex justify-end">
        <button type="submit" className="h-11 rounded bg-terminal-cyan px-5 font-semibold text-terminal-bg transition hover:bg-cyan-300">
          Save trade
        </button>
      </div>
    </form>
  );
}
