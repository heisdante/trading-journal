# trading-journal

## Automation setup

The `/import` page accepts CSV exports from MT4, MT5, and cTrader. For AI-assisted trade-idea drafts, add these server-only variables:

```text
OPENAI_API_KEY=
OPENAI_TRADE_INTAKE_MODEL=gpt-5
OPENAI_TRADE_REVIEW_MODEL=gpt-5-mini
OPENAI_ANALYSIS_MODEL=gpt-5-mini
```

AI output is always a draft. Execution prices and risk fields remain explicit so the journal does not invent trading data.

## Analysis Studio

Apply `supabase/migrations/20261010142152_analysis_studio.sql` to the linked Supabase project before opening `/analysis`. It creates private study, evidence, and pattern review tables plus a private screenshot bucket. The same definitions are included in `supabase/schema.sql` for fresh installations.

Traders can add notes, reference URLs, and screenshots in sequence, then save their own win or loss conclusion. With `OPENAI_API_KEY` configured and AI enabled in Settings, the assistant can draft a conclusion from notes and up to eight recent screenshots; it never opens the reference URLs. Pattern Watch compares a completed study with the latest 12 completed trades. Suggested repeats require trader confirmation. Without an AI key, journal term matching and manual trade linking remain available.
