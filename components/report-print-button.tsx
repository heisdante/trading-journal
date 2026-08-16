"use client";

import { Printer } from "lucide-react";

export function ReportPrintButton() {
  return <button type="button" onClick={() => window.print()} className="inline-flex h-11 items-center gap-2 border border-terminal-line px-4 text-sm font-semibold hover:border-terminal-cyan hover:text-terminal-cyan"><Printer className="h-4 w-4" />Print or save PDF</button>;
}
