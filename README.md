# trading-journal

## Automation setup

The `/import` page accepts CSV exports from MT4, MT5, and cTrader. For AI-assisted trade-idea drafts, add these server-only variables:

```text
OPENAI_API_KEY=
OPENAI_TRADE_INTAKE_MODEL=gpt-5
OPENAI_TRADE_REVIEW_MODEL=gpt-5-mini
```

AI output is always a draft. Execution prices and risk fields remain explicit so the journal does not invent trading data.
