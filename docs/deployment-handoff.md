# Trading Journal Deployment Handoff

## Required Environment Variables

Set these in local `.env.local` and in the hosting provider:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Confirm `public.trades` exists.
5. Confirm Row Level Security is enabled on `public.trades`.
6. Confirm policies exist for select, insert, update, and delete.
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

## Not Included In MVP

- Trade edit/delete UI
- Broker integrations
- Live market data
- AI trade review
- Import/export workflows
