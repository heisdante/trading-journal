# Trading Journal PRD

## 1. Product Summary

The Trading Journal is a web application for active traders who want to record trades, measure performance in R-multiples, and understand whether discipline is helping or hurting results.

The product focuses on fast trade entry, clear performance feedback, and a simple discipline comparison between trades that followed criteria and trades that broke criteria.

## 2. Problem Statement

Many traders track outcomes inconsistently or only review raw profit and loss. This makes it difficult to understand whether their process has positive expectancy, whether losses are caused by strategy or discipline, and whether performance is improving over time.

The product solves this by normalizing every trade into R, calculating key performance metrics automatically, and surfacing process quality through criteria-met versus broken-criteria analysis.

## 3. Target Users

Primary users:

- Retail traders tracking discretionary trades
- Traders who use predefined setups and risk-based position planning
- Traders who evaluate performance using R-multiples rather than raw currency P/L

Secondary users:

- Trading coaches reviewing student discipline
- Traders testing a single setup over time

## 4. User Goals

Users need to:

- Log trades quickly after execution.
- Record whether a trade followed their criteria.
- See whether their trading system has positive expectancy.
- Compare disciplined trades against broken-criteria trades.
- Review trade history in a clean, searchable mental model.
- Understand cumulative performance over time.

## 5. Product Goals

- Provide a complete authenticated trading journal.
- Make R-multiple performance visible without manual calculation.
- Make discipline measurable through side-by-side analytics.
- Keep the first version focused on core journaling and dashboard workflows.
- Ensure each user's trade data is private and isolated.

## 6. Non-Goals

The first version will not include:

- Broker integrations
- Live market data
- Currency P/L calculations
- Position sizing calculators
- Screenshot uploads
- Tags beyond setup name and criteria status
- Multi-account or team workspaces
- AI trade review
- Import/export workflows

These can be considered for later versions after the core journal is stable.

MVP clarification: trade editing and deletion UI are deferred. Database RLS may support update/delete policies for future use, but the first UI release only needs create/read workflows.

## 7. Core User Stories

### Authentication

As a trader, I want to create an account with email and password so my journal data is private.

As a trader, I want to log in securely so I can access my dashboard and trades.

### Trade Logging

As a trader, I want to enter trade details so I can preserve a record of each execution.

As a trader, I want the app to calculate R automatically so I do not need to calculate performance manually.

As a trader, I want to mark whether criteria were met so I can measure the impact of discipline.

### Dashboard

As a trader, I want to see win rate, expectancy, total R, average win, average loss, and max drawdown so I can assess system performance.

As a trader, I want to see an equity curve in R so I can understand performance over time.

As a trader, I want to compare criteria-met trades against broken-criteria trades so I can identify whether discipline is affecting results.

### Trade History

As a trader, I want to see all trades newest first so I can quickly review recent activity.

As a trader, I want wins, losses, and break-even trades color-coded so I can scan outcomes quickly.

## 8. Functional Requirements

### 8.1 Authentication

The product must support:

- Email/password signup through Supabase Auth.
- Email/password login through Supabase Auth.
- Protected routes for logged-in users.
- Redirect unauthenticated users away from protected pages.
- Prevent authenticated users from accessing other users' trade data.

Required pages:

- `/login`
- `/signup`

### 8.2 Trade Logging

The product must provide a trade entry form at `/log`.

Required fields:

- Date
- Setup name
- Direction: Long or Short
- Entry price
- Stop price
- Target price, optional
- Exit price
- Criteria met: yes/no
- Notes

Validation requirements:

- Date is required.
- Setup name is required.
- Direction must be Long or Short.
- Entry price must be positive.
- Stop price must be positive.
- Exit price must be positive.
- Target price, when provided, must be positive.
- Long trades require entry above stop.
- Short trades require stop above entry.

### 8.3 R Calculation

The product must calculate R automatically.

Long formula:

```text
R = (exit - entry) / (entry - stop)
```

Short formula:

```text
R = (entry - exit) / (stop - entry)
```

Result classification:

- Win if R is greater than 0
- Loss if R is less than 0
- BE if R equals 0

### 8.4 Dashboard

The product must provide a dashboard at `/dashboard`.

Dashboard metrics:

- Win rate
- Expectancy
- Total R
- Average win
- Average loss
- Max drawdown

Dashboard charts:

- Equity curve line chart using cumulative R
- Discipline analysis comparing criteria-met R and broken-criteria R

### 8.5 Trade History

The product must provide a trade history page at `/trades`.

The trade table must:

- Show all trades for the authenticated user.
- Sort trades newest first.
- Display all trade fields.
- Display calculated R.
- Display result as Win, Loss, or BE.
- Color-code results.

## 9. Data Requirements

Each trade must store:

- User ID
- Date
- Setup name
- Direction
- Entry price
- Stop price
- Target price
- Exit price
- Criteria met
- Notes
- R value
- Result
- Created timestamp
- Updated timestamp

Each trade must belong to exactly one user.

## 10. Security and Privacy Requirements

The product must use Supabase Row Level Security.

RLS must enforce:

- Users can only read their own trades.
- Users can only insert trades for themselves.
- Users can only update their own trades.
- Users can only delete their own trades.

The database policy condition must be based on:

```sql
auth.uid() = user_id
```

## 11. UX and Visual Requirements

The visual design should use:

- Dark terminal aesthetic
- Navy background
- Cyan accent color
- JetBrains Mono for numeric values

The interface should prioritize:

- Fast data entry
- Readable metrics
- Dense dashboard layout
- Clear navigation
- Scan-friendly trade history
- Responsive behavior for smaller screens

## 12. Key Metrics for Product Success

Product success for the first version means:

- A user can create an account and log in.
- A user can log a valid trade in under one minute.
- A user can understand total performance from the dashboard without manual calculation.
- A user can identify whether criteria-met trades outperform broken-criteria trades.
- A user can review all historical trades from one page.

## 13. Acceptance Criteria

The MVP is accepted when:

- `/login` supports Supabase email/password login.
- `/signup` supports Supabase email/password signup.
- `/dashboard` is protected and shows all required metrics and charts.
- `/log` is protected and allows authenticated users to add trades.
- `/trades` is protected and shows authenticated user trades newest first.
- R is calculated correctly for Long and Short trades.
- Result is classified correctly as Win, Loss, or BE.
- Discipline analysis separates criteria-met and broken-criteria R.
- Supabase schema includes RLS policies that isolate user data.
- The app uses the required dark terminal visual direction.
- Production build passes.

## 14. Future Considerations

Potential future features:

- Trade editing and deletion UI
- Setup-level analytics
- Date range filters
- CSV import/export
- Screenshot attachments
- Currency P/L tracking
- Position size tracking
- AI trade review
- Broker import integrations
- Tags and custom criteria checklists

## 15. Open Questions

- Should users be able to edit and delete trades in the MVP UI, or is database-level support enough for the first version?
- Should target price affect any metric, or remain informational only?
- Should dashboard metrics support date filters in the first version?
- Should notes support markdown formatting?
- Should break-even use exact zero only, or a small tolerance around zero?
