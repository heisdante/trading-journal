# Trading Journal Current-State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the existing Trading Journal MVP in this repository against `docs/prd/trading-journal-prd.md`, with authenticated trade logging, R-multiple analytics, discipline analysis, protected trade history, Supabase RLS, focused calculation tests, and verified local build.

**Architecture:** Treat the existing Next.js App Router implementation as the starting point. Supabase PostgreSQL generated columns are the source of truth for stored `r_value` and `result`; TypeScript calculation logic mirrors the database formula for validation, analytics, previews, and tests. Keep the MVP create/read only in the UI; edit/delete UI remains deferred.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Supabase Auth/PostgreSQL/RLS, Recharts, Vitest, ESLint.

---

## Confirmed Decisions

- This plan targets the current repo state, not a greenfield rebuild.
- Add focused automated unit tests for trade math and dashboard metrics.
- Defer edit/delete UI from the MVP.
- Database-generated `r_value` and `result` are the source of truth for persisted trades.
- TypeScript formulas must mirror the SQL formulas.
- Stop at a locally verified MVP, with a short deployment handoff checklist.

## Current Repo Files To Audit

- `app/login/page.tsx`: login page.
- `app/signup/page.tsx`: signup page.
- `app/dashboard/page.tsx`: dashboard page.
- `app/log/page.tsx`: trade entry page.
- `app/trades/page.tsx`: trade history page.
- `components/auth-form.tsx`: shared auth UI.
- `components/app-shell.tsx`: protected navigation.
- `components/logout-button.tsx`: logout control.
- `components/trade-form.tsx`: trade creation form.
- `components/trade-table.tsx`: trade history table.
- `components/metric-card.tsx`: dashboard metric card.
- `components/equity-curve.tsx`: Recharts equity curve.
- `components/discipline-analysis.tsx`: Recharts discipline comparison.
- `lib/supabase/client.ts`: browser Supabase client.
- `lib/supabase/server.ts`: server Supabase client.
- `lib/trades/actions.ts`: trade insert server action.
- `lib/trades/calculations.ts`: R/result/metrics logic.
- `lib/trades/queries.ts`: authenticated trade query.
- `middleware.ts`: auth redirects/session refresh.
- `supabase/schema.sql`: database table, generated columns, indexes, and RLS.
- `types/trade.ts`: trade domain types.
- `types/database.ts`: Supabase database types.
- `.env.example`: Supabase env var template.
- `package.json`: scripts and dependencies.

---

### Task 1: Audit Current Implementation Against PRD

**Files:**
- Read: `docs/prd/trading-journal-prd.md`
- Read: `docs/specs/trading-journal-spec.md`
- Read: all files listed in "Current Repo Files To Audit"
- Modify: only if a clear PRD gap is found

- [ ] **Step 1: Confirm route coverage**

Verify these pages exist:

```text
app/login/page.tsx
app/signup/page.tsx
app/dashboard/page.tsx
app/log/page.tsx
app/trades/page.tsx
```

Expected: all required pages exist.

- [ ] **Step 2: Confirm trade form coverage**

Verify `components/trade-form.tsx` includes fields for:

```text
date
setup_name
direction
entry_price
stop_price
target_price
exit_price
criteria_met
notes
```

Expected: all PRD fields are present, target is optional, and criteria is boolean-like.

- [ ] **Step 3: Confirm dashboard coverage**

Verify `app/dashboard/page.tsx` renders:

```text
win rate
expectancy
total R
avg win
avg loss
max drawdown
equity curve
discipline analysis
```

Expected: all required metrics/charts are present.

- [ ] **Step 4: Confirm trade history coverage**

Verify `components/trade-table.tsx` renders:

```text
date
setup
direction
entry
stop
target
exit
criteria
R
result
notes
```

Expected: newest-first sorting is handled by `lib/trades/queries.ts`, and result styling distinguishes Win/Loss/BE.

- [ ] **Step 5: Commit only if audit fixes were needed**

If audit changes were made:

```powershell
git add app components lib types supabase
git commit -m "fix: align trading journal implementation with prd"
```

Expected: commit succeeds. If no code changes were needed, skip this step.

---

### Task 2: Add Focused Unit Tests For Trading Math

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `lib/trades/calculations.test.ts`

- [ ] **Step 1: Add Vitest dependency and scripts**

Modify `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "vitest": "^2.1.9"
  }
}
```

Keep existing scripts and dependencies. Add only the missing test scripts and `vitest`.

- [ ] **Step 2: Install dependencies**

Run:

```powershell
npm.cmd install --ignore-scripts
```

Expected: `package-lock.json` updates successfully.

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"]
  },
  resolve: {
    alias: {
      "@": new URL(".", import.meta.url).pathname
    }
  }
});
```

- [ ] **Step 4: Create `lib/trades/calculations.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { buildTradeMetrics, calculateRValue, classifyResult, isValidRisk } from "@/lib/trades/calculations";
import type { Trade } from "@/types/trade";

function trade(overrides: Partial<Trade>): Trade {
  return {
    id: "trade-id",
    user_id: "user-id",
    date: "2026-01-01",
    setup_name: "Breakout",
    direction: "Long",
    entry_price: 100,
    stop_price: 90,
    target_price: null,
    exit_price: 110,
    criteria_met: true,
    notes: null,
    r_value: 1,
    result: "Win",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    ...overrides
  };
}

describe("trade calculations", () => {
  it("calculates long R from entry, stop, and exit", () => {
    expect(calculateRValue({ direction: "Long", entry_price: 100, stop_price: 90, exit_price: 120 })).toBe(2);
    expect(calculateRValue({ direction: "Long", entry_price: 100, stop_price: 90, exit_price: 95 })).toBe(-0.5);
  });

  it("calculates short R from entry, stop, and exit", () => {
    expect(calculateRValue({ direction: "Short", entry_price: 100, stop_price: 110, exit_price: 80 })).toBe(2);
    expect(calculateRValue({ direction: "Short", entry_price: 100, stop_price: 110, exit_price: 105 })).toBe(-0.5);
  });

  it("classifies result from R value", () => {
    expect(classifyResult(1)).toBe("Win");
    expect(classifyResult(-0.25)).toBe("Loss");
    expect(classifyResult(0)).toBe("BE");
  });

  it("validates directional risk correctly", () => {
    expect(isValidRisk("Long", 100, 90)).toBe(true);
    expect(isValidRisk("Long", 100, 100)).toBe(false);
    expect(isValidRisk("Short", 100, 110)).toBe(true);
    expect(isValidRisk("Short", 100, 90)).toBe(false);
  });

  it("builds dashboard metrics from trades", () => {
    const metrics = buildTradeMetrics([
      trade({ id: "1", date: "2026-01-01", created_at: "2026-01-01T00:00:00.000Z", r_value: 2, criteria_met: true }),
      trade({ id: "2", date: "2026-01-02", created_at: "2026-01-02T00:00:00.000Z", r_value: -1, result: "Loss", criteria_met: false }),
      trade({ id: "3", date: "2026-01-03", created_at: "2026-01-03T00:00:00.000Z", r_value: 0, result: "BE", criteria_met: true })
    ]);

    expect(metrics.totalTrades).toBe(3);
    expect(metrics.winRate).toBeCloseTo(33.3333);
    expect(metrics.expectancy).toBeCloseTo(0.3333);
    expect(metrics.totalR).toBe(1);
    expect(metrics.avgWin).toBe(2);
    expect(metrics.avgLoss).toBe(-1);
    expect(metrics.maxDrawdown).toBe(1);
    expect(metrics.criteriaMetR).toBe(2);
    expect(metrics.brokenCriteriaR).toBe(-1);
    expect(metrics.equityCurve.map((point) => point.equity)).toEqual([2, 1, 1]);
  });
});
```

- [ ] **Step 5: Run tests**

```powershell
npm.cmd run test
```

Expected: all tests pass.

- [ ] **Step 6: Commit tests**

```powershell
git add package.json package-lock.json vitest.config.ts lib/trades/calculations.test.ts
git commit -m "test: cover trading calculations"
```

---

### Task 3: Clarify Database Source Of Truth

**Files:**
- Modify: `supabase/schema.sql`
- Modify: `lib/trades/actions.ts`
- Modify: `lib/trades/calculations.ts`
- Modify: `docs/specs/trading-journal-spec.md`

- [ ] **Step 1: Verify generated columns in SQL**

Confirm `supabase/schema.sql` defines:

```sql
r_value numeric(18, 6) generated always as (...)
result text generated always as (...)
```

Expected: both are generated columns and are not supplied by insert actions.

- [ ] **Step 2: Verify insert action omits generated values**

Confirm `lib/trades/actions.ts` inserts raw trade input only:

```text
date
setup_name
direction
entry_price
stop_price
target_price
exit_price
criteria_met
notes
user_id
```

Expected: payload does not include `r_value` or `result`.

- [ ] **Step 3: Add source-of-truth note to technical spec**

Add this note to `docs/specs/trading-journal-spec.md` under "R Calculation":

```markdown
Persistence note: Supabase generated columns are the source of truth for stored `r_value` and `result`. TypeScript calculation logic must mirror the SQL formula for validation, tests, UI previews, and analytics, but insert actions must not write stored R/result values directly.
```

- [ ] **Step 4: Commit documentation clarification**

```powershell
git add docs/specs/trading-journal-spec.md supabase/schema.sql lib/trades/actions.ts lib/trades/calculations.ts
git commit -m "docs: clarify trade result source of truth"
```

If only the spec changed, stage only the spec file.

---

### Task 4: Confirm MVP Scope Excludes Edit/Delete UI

**Files:**
- Modify: `docs/prd/trading-journal-prd.md`
- Modify: `docs/specs/trading-journal-spec.md`
- Read: `components/trade-table.tsx`

- [ ] **Step 1: Confirm trade table has no edit/delete controls**

Inspect `components/trade-table.tsx`.

Expected: no edit/delete buttons are required for MVP.

- [ ] **Step 2: Add explicit MVP scope note to PRD**

Add this note to `docs/prd/trading-journal-prd.md` under "Non-Goals":

```markdown
MVP clarification: trade editing and deletion UI are deferred. Database RLS may support update/delete policies for future use, but the first UI release only needs create/read workflows.
```

- [ ] **Step 3: Add explicit MVP scope note to technical spec**

Add this note to `docs/specs/trading-journal-spec.md` under "Trade Log Table":

```markdown
MVP scope: the trade history table is read-only. Edit and delete controls are deferred to a future version.
```

- [ ] **Step 4: Commit MVP scope clarification**

```powershell
git add docs/prd/trading-journal-prd.md docs/specs/trading-journal-spec.md
git commit -m "docs: clarify mvp trade history scope"
```

---

### Task 5: Final Local Verification

**Files:**
- Modify: only files required by verification failures

- [ ] **Step 1: Run lint**

```powershell
npm.cmd run lint
```

Expected:

```text
No ESLint warnings or errors
```

- [ ] **Step 2: Run tests**

```powershell
npm.cmd run test
```

Expected:

```text
Test Files  1 passed
Tests       5 passed
```

- [ ] **Step 3: Run production build**

```powershell
npm.cmd run build
```

Expected:

```text
Compiled successfully
```

- [ ] **Step 4: Start the dev server manually**

```powershell
npm.cmd run dev
```

Expected:

```text
Local: http://localhost:3000
```

- [ ] **Step 5: Manual acceptance checklist**

Open `http://localhost:3000` and verify:

- Unauthenticated users are redirected to `/login`.
- `/signup` accepts email/password when Supabase env vars are configured.
- `/login` accepts email/password when Supabase env vars are configured.
- `/dashboard`, `/log`, and `/trades` require authentication.
- `/log` includes date, setup name, direction, entry, stop, target, exit, criteria met, and notes.
- A valid Long trade can be submitted.
- A valid Short trade can be submitted.
- Invalid Long risk rejects `entry_price <= stop_price`.
- Invalid Short risk rejects `stop_price <= entry_price`.
- `/dashboard` shows win rate, expectancy, total R, avg win, avg loss, max drawdown, equity curve, and discipline analysis.
- `/trades` shows authenticated user trades newest first.
- Result styling distinguishes Win, Loss, and BE.

- [ ] **Step 6: Commit final verification fixes**

If verification required code changes:

```powershell
git add app components lib types supabase docs package.json package-lock.json vitest.config.ts
git commit -m "fix: complete local mvp verification"
```

If verification required no changes, skip this commit.

---

### Task 6: Deployment Handoff Checklist

**Files:**
- Create: `docs/deployment-handoff.md`

- [ ] **Step 1: Create deployment handoff document**

```markdown
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
8. Decide whether email confirmation is enabled.

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
```

- [ ] **Step 2: Commit deployment handoff**

```powershell
git add docs/deployment-handoff.md
git commit -m "docs: add deployment handoff"
```

---

## Final Agreement From Grill-Me Review

Agreed:

- Execute from the current repo state.
- Add focused tests for calculation correctness.
- Keep UI MVP create/read only.
- Use database-generated `r_value` and `result` as persisted source of truth.
- Stop at local verified MVP and provide deployment handoff notes.

Deferred:

- Edit/delete trade UI.
- Date filtering.
- CSV import/export.
- Screenshot attachments.
- Currency P/L.
- AI trade review.
- Broker integrations.

Risks:

- Supabase auth behavior depends on whether email confirmation is enabled.
- Manual auth/trade submission checks require valid Supabase environment variables.
- `next/font` may need network access during production build unless fonts are made local.
