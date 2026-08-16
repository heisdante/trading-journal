# Trading Journal PRD

## 1. Product Summary

The Trading Journal is a web application for active traders who want to record trades, measure performance in R-multiples, and understand whether discipline is helping or hurting results.

The product focuses on fast trade entry, clear performance feedback, explicit trading rules, behavioral self-awareness, and an AI-assisted review loop that helps a trader turn their history into a repeatable operating blueprint.

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
- Store and maintain a personal trading rulebook.
- Capture emotional state and behavioral mistakes without hiding them.
- Understand performance in rolling series of 5, 10, 20, 50, 100, and all trades.
- Receive a clear warning when a documented trade appears to breach an active rule.
- Rate each trading day and convert the record into a future process blueprint.
- Understand cumulative performance over time.

## 5. Product Goals

- Provide a complete authenticated trading journal.
- Make R-multiple performance visible without manual calculation.
- Make discipline measurable through side-by-side analytics.
- Keep the first version focused on core journaling, behavior capture, and dashboard workflows.
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
- Autonomous trade decisions or financial advice
- Silent AI judgments without evidence from the trader's rulebook or trade record

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

As a trader, I want to record my emotion, FOMO, revenge trading, and whether I cut a winner early so I can identify behavioral patterns.

As a trader, I want the journal to review my trade against my active rules and warn me about a possible breach.

### Rules and Reviews

As a trader, I want to write, pause, and maintain my trading rules.

As a trader, I want to rate how I handled a trading day from 1 to 10 and record the lesson I want to carry forward.

### Dashboard

As a trader, I want to see win rate, expectancy, total R, average win, average loss, and max drawdown so I can assess system performance.

As a trader, I want to see an equity curve in R so I can understand performance over time.

As a trader, I want to compare criteria-met trades against broken-criteria trades so I can identify whether discipline is affecting results.

As a trader, I want a discipline score from 0 to 100 that reflects rule adherence and recorded process behavior.

As a trader, I want to compare rolling trade series so I can distinguish a short-term streak from a stable edge.

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
- Average risk-to-reward ratio
- Discipline score
- Rule warning rate

Dashboard charts:

- Equity curve line chart using cumulative R
- Discipline analysis comparing criteria-met R and broken-criteria R
- Series selector for 5, 10, 20, 50, 100, and all trades

### 8.5 Trading Rules and AI Review

The product must provide a `/rules` page where users can create rules with a title and observable rule text, and pause or reactivate them.

After a trade is documented, the system must:

- Load only the authenticated user's active rules.
- Review the recorded trade fields against those rules when an AI key is configured.
- Return `Pass`, `Warning`, or `Unavailable`.
- Store concise feedback and a discipline score with the trade.
- Fall back to transparent field-based checks when AI is unavailable.
- Never invent missing execution facts or provide trading advice.

### 8.6 Behavioral and Daily Review

Trade logging must support emotion, emotion notes, FOMO, revenge trade, and cut-winner-early flags.

The product must provide a `/review` page where the trader stores one daily review per date with:

- Day rating from 1 to 10
- Discipline score from 0 to 100
- Dominant emotion
- Summary
- Lesson or adjustment for the next session

### 8.7 Series Analytics

The product must calculate each selected series using the latest N trades ordered chronologically, or all trades:

- Trade count
- Win rate
- Total R
- Expectancy
- Average risk-to-reward ratio
- Average discipline score
- Rule warning count

### 8.8 Interactive AI Coach

The product must provide a `/coach` page where a trader can ask questions about their recorded process. The coach must use the trader's journal summary and active rules, respond without market predictions or trade signals, and remain unavailable when no AI key is configured.

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
- Emotion and emotion notes
- FOMO, revenge trade, and cut-winner-early flags
- Discipline score
- AI rule review status and feedback

Each trading rule must store:

- User ID
- Title
- Rule text
- Active/paused status
- Created and updated timestamps

Each daily review must store:

- User ID
- Review date
- Day rating from 1 to 10
- Discipline score from 0 to 100
- Emotion, summary, and lesson

Each trade must belong to exactly one user.

## 10. Security and Privacy Requirements

The product must use Supabase Row Level Security.

RLS must enforce:

- Users can only read their own trades.
- Users can only insert trades for themselves.
- Users can only update their own trades.
- Users can only delete their own trades.
- Users can only read and manage their own rules and daily reviews.

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
- Rule warnings must be visually distinct and accompanied by text, not color alone.
- Forms must provide visible labels, inline feedback, and usable touch targets.
- Scan-friendly trade history
- Responsive behavior for smaller screens

## 12. Key Metrics for Product Success

Product success for the first version means:

- A user can create an account and log in.
- A user can log a valid trade in under one minute.
- A user can understand total performance from the dashboard without manual calculation.
- A user can identify whether criteria-met trades outperform broken-criteria trades.
- A user can create an active rule and see it used in post-trade review.
- A user can capture behavioral context and save a daily review.
- A user can inspect performance across at least five rolling series sizes.
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
- Average R:R and discipline score are calculated from stored trade data.
- Active rules, trade review feedback, and daily reviews are isolated by RLS.
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
- Coach-facing review and export
- Direct broker account syncing beyond the existing CSV import path
- Tags and custom criteria checklists

## 15. Open Questions

- Should users be able to edit and delete trades in the MVP UI, or is database-level support enough for the first version?
- Should target price affect any metric, or remain informational only?
- Should dashboard metrics support date filters in the first version?
- Should notes support markdown formatting?
- Should break-even use exact zero only, or a small tolerance around zero?
- Should the user be able to tune discipline score weights, or should the first version keep a transparent fixed weighting?
- Should AI reviews be rerunnable after a rule changes, with a review history per trade?
- Should daily reviews be generated automatically from that day's trades before the trader edits them?
