import { AppShell } from "@/components/app-shell";
import { TradeTable } from "@/components/trade-table";
import { getTrades } from "@/lib/trades/queries";

export default async function TradesPage() {
  const trades = await getTrades();

  return (
    <AppShell>
      <TradeTable trades={trades} />
    </AppShell>
  );
}
