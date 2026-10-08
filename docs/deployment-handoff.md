# Trading Journal Deployment Handoff

## Required Environment Variables

Set these in local `.env.local` and in the hosting provider:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
OPENAI_TRADE_INTAKE_MODEL=gpt-5
OPENAI_TRADE_REVIEW_MODEL=gpt-5-mini
```

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Confirm `public.trades` and `public.growth_plans` exist, and that `trades` has the reflection and risk percentage columns from the schema.
5. Confirm Row Level Security is enabled on exposed user data tables, including `public.trades` and `public.growth_plans`.
6. Confirm user-owned policies exist for select, insert, update, and delete on those tables.
7. Configure email/password auth.
8. Enable email confirmation if you want signup verification before dashboard access.
9. For code-based signup verification, update the Supabase signup email template to show the OTP token instead of only a confirmation link. The app verifies codes on `/verify` using Supabase `verifyOtp` with `type: "signup"`.

## Local Verification

Run:

```powershell
npm.cmd run lint
npm.cmd run test
npm.cmd run build
```

Expected: all commands pass.

## Hosting Notes

The app is deployable to any Next.js-compatible host. Vercel is the default recommendation because the project uses Next.js App Router and standard environment variables.

## Current boundaries

- The first automation slice supports CSV exports from MT4, MT5, and cTrader.
- AI trade-idea drafting is optional and requires the server-only `OPENAI_API_KEY`.
- Direct broker connections, live market data, and automatic background syncing still require provider credentials and a connector service.
- Trade edit/delete UI remains to be built.
