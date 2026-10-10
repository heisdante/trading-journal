# trading-journal

## Automation setup

The `/import` page accepts CSV exports from MT4, MT5, and cTrader. For AI-assisted journal features, configure one provider with server-only environment variables:

```text
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=
OPENROUTER_MODEL=openai/gpt-4o-mini

# When switching to the direct OpenAI API later:
# AI_PROVIDER=openai
OPENAI_API_KEY=
OPENAI_TRADE_INTAKE_MODEL=gpt-5-mini
OPENAI_TRADE_REVIEW_MODEL=gpt-5-mini
OPENAI_ANALYSIS_MODEL=gpt-5-mini
```

OpenRouter is used first when both keys exist and `AI_PROVIDER` is unset. Set `AI_PROVIDER=openai` to switch without code changes. Keep keys in Vercel Production environment variables and redeploy after changing them; never put keys in `NEXT_PUBLIC_` variables. The default OpenRouter model supports screenshot input and JSON schema output. An OpenRouter key may require account credits for that model.

AI output is always a draft. Execution prices and risk fields remain explicit so the journal does not invent trading data.

## Analysis Studio

Apply `supabase/migrations/20261010142152_analysis_studio.sql` to the linked Supabase project before opening `/analysis`. It creates private study, evidence, and pattern review tables plus a private screenshot bucket. The same definitions are included in `supabase/schema.sql` for fresh installations.

Traders can add notes, reference URLs, and screenshots in sequence, then save their own win or loss conclusion. With an AI provider key configured and AI enabled in Settings, the assistant can draft a conclusion from notes and up to eight recent screenshots; it never opens the reference URLs. Pattern Watch compares a completed study with the latest 12 completed trades. Suggested repeats require trader confirmation. Without an AI key, journal term matching and manual trade linking remain available.
