# Trading Journal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js 14 trading journal with Supabase auth, protected trade data, R-based analytics, and a dark terminal interface.

**Architecture:** The app uses App Router pages for auth, logging, dashboard, and history. Supabase server clients handle authenticated reads/writes, browser clients handle form auth, and shared TypeScript utilities calculate R, trade result labels, and dashboard metrics.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase Auth/PostgreSQL, Recharts.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`, `.eslintrc.json`, `.env.example`
- Create: `app/layout.tsx`, `app/globals.css`, `app/page.tsx`

- [ ] Add Next.js, Supabase, Tailwind, TypeScript, Recharts, and Lucide dependencies.
- [ ] Configure TypeScript path aliases and Tailwind content paths.
- [ ] Add global terminal-inspired styles and font loading.

### Task 2: Supabase Foundation

**Files:**
- Create: `lib/supabase/client.ts`, `lib/supabase/server.ts`, `middleware.ts`
- Create: `supabase/schema.sql`
- Create: `types/database.ts`, `types/trade.ts`

- [ ] Add browser and server Supabase clients using environment variables.
- [ ] Protect `/dashboard`, `/log`, and `/trades` in middleware.
- [ ] Add SQL schema for `public.trades`, generated R/result fields, indexes, and RLS policies scoped to `auth.uid()`.

### Task 3: Trade Domain Logic

**Files:**
- Create: `lib/trades/calculations.ts`, `lib/trades/queries.ts`, `lib/trades/actions.ts`

- [ ] Implement R calculation for long and short trades.
- [ ] Implement result classification: positive R is `Win`, negative R is `Loss`, zero R is `BE`.
- [ ] Implement analytics: win rate, expectancy, total R, avg win, avg loss, max drawdown, equity curve, criteria-met R, broken-criteria R.
- [ ] Implement server action for inserting a trade for the authenticated user.

### Task 4: UI Components and Pages

**Files:**
- Create: `components/app-shell.tsx`, `components/auth-form.tsx`, `components/metric-card.tsx`, `components/equity-curve.tsx`, `components/discipline-analysis.tsx`, `components/trade-form.tsx`, `components/trade-table.tsx`, `components/logout-button.tsx`
- Create: `app/login/page.tsx`, `app/signup/page.tsx`, `app/dashboard/page.tsx`, `app/log/page.tsx`, `app/trades/page.tsx`

- [ ] Add email/password login and signup pages.
- [ ] Add protected shell navigation and logout.
- [ ] Add trade logging form with typed inputs and direction/criteria controls.
- [ ] Add dashboard metric cards, equity curve chart, and discipline comparison.
- [ ] Add newest-first trade history table with result colors.

### Task 5: Verification

**Files:**
- Modify as needed based on compiler output.

- [ ] Run dependency installation if needed.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Fix any compile or lint failures.
