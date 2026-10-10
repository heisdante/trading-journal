export type PatternTrade = {
  id: string;
  trade_date: string;
  pair: string;
  outcome: string | null;
  entry_reason: string | null;
  exit_reason: string | null;
  notes: string | null;
  review_comment: string | null;
  lesson_learned: string | null;
  emotion_notes: string | null;
};

export type PatternStudy = {
  id: string;
  trade_id: string | null;
  outcome: string;
  cause: string;
  lesson: string;
};

const ignored = new Set([
  "about", "after", "again", "against", "because", "before", "could", "every",
  "from", "have", "into", "just", "loss", "made", "more", "other", "over",
  "price", "same", "setup", "should", "that", "their", "there", "these", "this",
  "trade", "traded", "trading", "when", "which", "while", "with", "would", "your",
  "winner", "winning", "worked", "result", "market", "entry", "exit", "good",
]);

function terms(value: string) {
  return new Set((value.toLowerCase().match(/[a-z]{4,}/g) ?? []).filter((word) => !ignored.has(word)));
}

export function possibleRepeats(study: PatternStudy, trades: PatternTrade[]) {
  if (study.outcome !== "Win" && study.outcome !== "Loss") return [];
  const focus = terms(`${study.cause} ${study.lesson}`);
  if (focus.size < 2) return [];
  return trades.flatMap((trade) => {
    if (trade.id === study.trade_id || trade.outcome !== study.outcome) return [];
    const record = terms([
      trade.entry_reason, trade.exit_reason, trade.notes, trade.review_comment,
      trade.lesson_learned, trade.emotion_notes,
    ].filter(Boolean).join(" "));
    const shared = [...focus].filter((word) => record.has(word));
    if (shared.length < 2) return [];
    return [{ trade_id: trade.id, rationale: `This ${study.outcome.toLowerCase()} shares journal terms: ${shared.slice(0, 4).join(", ")}. Review the actual setup before confirming.` }];
  });
}
