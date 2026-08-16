import { addTradeAction } from "@/lib/trades/actions";

const markets = ["Forex", "Stocks", "Futures", "Crypto", "Indices", "Options", "Bonds", "Funds", "Economy"];
const criteriaStatuses = ["Good", "Fail"];
const outcomes = ["Loss", "Win", "Breakeven"];
const followedTradingPlanOptions = ["Yes", "No"];
const sessions = ["London", "New York", "Asian", "Frankfurt"];
const tradeTypes = ["Day Trade", "Swing Trade"];
const emotions = ["Calm", "Confident", "Focused", "Anxious", "Fearful", "Frustrated", "Excited", "Tired", "Angry"];

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

function SelectField({ label, name, options, required = true, defaultValue }: { label: string; name: string; options: string[]; required?: boolean; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="text-sm text-terminal-muted">{label}</span>
      <select
        name={name}
        required={required}
        defaultValue={defaultValue ?? (required ? options[0] : "")}
        className="mt-2 h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text outline-none transition focus:border-terminal-cyan"
      >
        {!required ? <option value="">Optional</option> : null}
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export function TradeForm({ defaults }: { defaults?: { market?: string | null; session?: string | null; tradeType?: string | null } }) {
  return (
    <form action={addTradeAction} encType="multipart/form-data" className="terminal-panel rounded-lg p-5">
      <div className="mb-6">
        <p className="font-mono text-xs uppercase text-terminal-cyan">trade / new</p>
        <h1 className="mt-2 text-2xl font-semibold text-terminal-text">Log a trade</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Date" name="date" type="date" />
        <Field label="Pair" name="pair" placeholder="EUR/USD, AAPL, BTC/USD" />
        <SelectField label="Market" name="market" options={markets} defaultValue={defaults?.market ?? undefined} />
        <Field label="Setup name" name="setup_name" placeholder="Breakout retest" />
        <Field label="Entry price" name="entry_price" type="number" step="any" placeholder="1.08500" />
        <Field label="Stop price" name="stop_price" type="number" step="any" placeholder="1.08000" />
        <Field label="Target price" name="target_price" type="number" step="any" required={false} placeholder="1.09500" />
        <Field label="Exit price" name="exit_price" type="number" step="any" placeholder="1.09200" />

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

        <Field label="Entry reason" name="entry_reason" placeholder="Why did this trade qualify?" />
        <Field label="Exit reason" name="exit_reason" placeholder="Why did you close or plan to close?" />
        <Field label="Trade idea link" name="trade_idea_link" type="url" required={false} placeholder="https://..." />
        <SelectField label="Followed your trading plan?" name="followed_trading_plan" options={followedTradingPlanOptions} />
        <SelectField label="Session" name="session" options={sessions} required={false} defaultValue={defaults?.session ?? undefined} />
        <SelectField label="Type of trade" name="trade_type" options={tradeTypes} required={false} defaultValue={defaults?.tradeType ?? undefined} />
        <SelectField label="Emotion" name="emotion" options={emotions} required={false} />
      </div>

      <div className="mt-5 grid gap-3 border-t border-terminal-line pt-5 sm:grid-cols-3">
        <label className="flex min-h-11 items-center gap-3 rounded border border-terminal-line px-3 text-sm text-terminal-muted"><input name="fomo" type="checkbox" className="h-4 w-4 accent-cyan-300" /> FOMO</label>
        <label className="flex min-h-11 items-center gap-3 rounded border border-terminal-line px-3 text-sm text-terminal-muted"><input name="cut_winner_early" type="checkbox" className="h-4 w-4 accent-cyan-300" /> Cut winner early</label>
        <label className="flex min-h-11 items-center gap-3 rounded border border-terminal-line px-3 text-sm text-terminal-muted"><input name="revenge_trade" type="checkbox" className="h-4 w-4 accent-cyan-300" /> Revenge trade</label>
      </div>

      <label className="mt-4 block"><span className="text-sm text-terminal-muted">Emotion notes</span><input name="emotion_notes" placeholder="What were you feeling and why?" className="mt-2 h-11 w-full rounded border border-terminal-line bg-terminal-bg px-3 text-terminal-text placeholder:text-terminal-muted/50" /></label>

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
