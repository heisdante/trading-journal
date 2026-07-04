import { addTradeAction } from "@/lib/trades/actions";

const pairs = ["Forex", "Stocks", "Futures", "Crypto", "Indices", "Options", "Bonds", "Funds", "Economy"];
const criteriaStatuses = ["Good", "Fail"];
const outcomes = ["Loss", "Win", "Breakeven"];
const followedTradingPlanOptions = ["Yes", "No"];
const sessions = ["London", "New York", "Asian", "Frankfurt"];
const tradeTypes = ["Day Trade", "Swing Trade"];

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

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <label className="block">
      <span className="text-sm text-terminal-muted">{label}</span>
      <select
        name={name}
        defaultValue={options[0]}
        className="mt-2 h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text outline-none transition focus:border-terminal-cyan"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export function TradeForm() {
  return (
    <form action={addTradeAction} encType="multipart/form-data" className="terminal-panel rounded-lg p-5">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase text-terminal-cyan">trade / new</p>
        <h1 className="mt-2 text-2xl font-semibold text-terminal-text">Log a trade</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Date" name="date" type="date" />
        <SelectField label="Pair" name="pair" options={pairs} />
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

        <SelectField label="Criteria met" name="criteria_status" options={criteriaStatuses} />
        <SelectField label="Outcome" name="outcome" options={outcomes} />

        <Field label="Entry price" name="entry_price" type="number" step="0.000001" />
        <Field label="Stop price" name="stop_price" type="number" step="0.000001" />
        <Field label="Target price" name="target_price" type="number" step="0.000001" required={false} />
        <Field label="Exit price" name="exit_price" type="number" step="0.000001" />
        <Field label="Trade idea link" name="trade_idea_link" type="url" required={false} placeholder="https://..." />
        <SelectField label="Followed your trading plan?" name="followed_trading_plan" options={followedTradingPlanOptions} />
        <SelectField label="Session" name="session" options={sessions} />
        <SelectField label="Type of trade" name="trade_type" options={tradeTypes} />
      </div>

      <label className="mt-4 block">
        <span className="text-sm text-terminal-muted">Screenshots</span>
        <input
          name="screenshots"
          type="file"
          accept="image/*"
          multiple
          className="mt-2 block w-full rounded border border-terminal-line bg-terminal-bg px-3 py-2 text-sm text-terminal-muted outline-none transition file:mr-3 file:rounded file:border-0 file:bg-terminal-cyan file:px-3 file:py-2 file:font-semibold file:text-terminal-bg hover:file:bg-cyan-300 focus:border-terminal-cyan"
        />
      </label>

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
