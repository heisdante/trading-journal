import { AppShell } from "@/components/app-shell";
import { buildTradeMetrics, formatR } from "@/lib/trades/calculations";
import { getTrades } from "@/lib/trades/queries";
import { ReportPrintButton } from "@/components/report-print-button";

export default async function ReportPage() {
  const trades = await getTrades();
  const metrics = buildTradeMetrics(trades);

  return (
    <AppShell>
      <section className="overflow-hidden rounded-lg terminal-panel print:border-0 print:bg-white print:text-black">
        <div className="app-page-heading flex flex-col gap-4 border-b border-terminal-line p-5 print:border-slate-200 sm:flex-row sm:items-start sm:justify-between sm:p-6">
          <div>
            <p className="font-mono text-xs uppercase text-terminal-cyan print:text-black">accountability / report</p>
            <h1 className="mt-2 text-3xl font-semibold">Trader performance report</h1>
            <p className="mt-3 text-sm leading-6 text-terminal-muted print:text-slate-700">A compact, coach-ready record of results and process quality.</p>
          </div>
          <div className="print:hidden">
            <ReportPrintButton />
          </div>
        </div>

        <div className="grid gap-px border-b border-terminal-line bg-terminal-line print:border-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Trades", metrics.totalTrades],
            ["Win rate", `${metrics.winRate.toFixed(1)}%`],
            ["Total R", formatR(metrics.totalR)],
            ["Discipline", `${metrics.disciplineScore.toFixed(0)}/100`],
          ].map(([label, value]) => (
            <div key={label} className="bg-terminal-panel p-5 print:bg-white">
              <p className="text-sm text-terminal-muted print:text-slate-600">{label}</p>
              <p className="number mt-1 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div className="rounded border border-terminal-line bg-terminal-bg/45 p-4 print:border-slate-200 print:bg-white">
            <h2 className="font-semibold">Process quality</h2>
            <p className="mt-3 text-sm leading-6 text-terminal-muted print:text-slate-700">
              Criteria-met trades win {metrics.criteriaMetRate.toFixed(1)}% of the time. Trades outside criteria win {metrics.brokenCriteriaRate.toFixed(1)}% of the time.
            </p>
          </div>
          <div className="rounded border border-terminal-line bg-terminal-bg/45 p-4 print:border-slate-200 print:bg-white">
            <h2 className="font-semibold">Risk profile</h2>
            <p className="mt-3 text-sm leading-6 text-terminal-muted print:text-slate-700">
              Average planned risk-to-reward is {metrics.averageRiskReward.toFixed(2)}:1. Maximum drawdown recorded: {formatR(-metrics.maxDrawdown)}.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
