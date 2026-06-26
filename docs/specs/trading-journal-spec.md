# Trading Journal Web App Specification

## Goal

Build a full-stack trading journal web app that lets authenticated users log trades, automatically calculate R-multiple performance, review trade history, and analyze discipline through dashboard metrics and charts.

## Technology Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Recharts

## Authentication

The app must support email/password authentication through Supabase.

Required auth pages:

- `/login`
- `/signup`

Requirements:

- Users can sign up with email and password.
- Users can log in with email and password.
- Protected app pages must only be accessible to authenticated users.
- Each authenticated user must only access their own trade data.

## Application Pages

### `/login`

Purpose: authenticate an existing user.

Required behavior:

- Email input
- Password input
- Login action using Supabase email/password auth
- Link to `/signup`
- Redirect authenticated users into the app

### `/signup`

Purpose: create a new user account.

Required behavior:

- Email input
- Password input
- Signup action using Supabase email/password auth
- Link to `/login`
- Handle Supabase email confirmation behavior if enabled

### `/dashboard`

Purpose: show trading performance and discipline analytics.

Required dashboard items:

- Equity curve line chart
- Win rate
- Expectancy
- Total R
- Average win
- Average loss
- Max drawdown
- Discipline analysis comparing:
  - Criteria-met trades R
  - Broken-criteria trades R

### `/log`

Purpose: add a new trade.

Required form fields:

- Date
- Setup name
- Direction: Long or Short
- Entry price
- Stop price
- Target price, optional
- Exit price
- Criteria met: yes/no
- Notes

### `/trades`

Purpose: show full trade history.

Required behavior:

- Display all trades for the authenticated user.
- Sort newest first.
- Color-code rows or result badges by trade result.
- Show all trade fields and calculated R/result.

## Trade Fields

Each trade must store:

- `date`
- `setup_name`
- `direction`
- `entry_price`
- `stop_price`
- `target_price`
- `exit_price`
- `criteria_met`
- `notes`
- `r_value`
- `result`
- `user_id`
- timestamps

Direction values:

- `Long`
- `Short`

Criteria met:

- Boolean
- `true` means the trade followed criteria.
- `false` means the trade broke criteria.

## R Calculation

The app must automatically calculate R from price values.

Persistence note: Supabase generated columns are the source of truth for stored `r_value` and `result`. TypeScript calculation logic must mirror the SQL formula for validation, tests, UI previews, and analytics, but insert actions must not write stored R/result values directly.

Long trade formula:

```text
R = (exit - entry) / (entry - stop)
```

Short trade formula:

```text
R = (entry - exit) / (stop - entry)
```

Validation:

- Long trades require `entry_price > stop_price`.
- Short trades require `stop_price > entry_price`.
- Entry, stop, target, and exit prices must be positive numbers.
- Target price is optional.

## Result Calculation

Result is derived from R value:

- `Win` when `R > 0`
- `Loss` when `R < 0`
- `BE` when `R = 0`

## Dashboard Metrics

### Win Rate

Percentage of trades with positive R:

```text
winning trades / total trades * 100
```

### Expectancy

Average R per trade:

```text
total R / total trades
```

### Total R

Sum of all trade R values.

### Average Win

Average R among winning trades only.

### Average Loss

Average R among losing trades only.

### Max Drawdown

Largest peak-to-trough decline in cumulative R over the equity curve.

### Equity Curve

Line chart showing cumulative R over time.

Requirements:

- Trades should be ordered chronologically for equity curve calculation.
- Chart should use Recharts.
- Y-axis value is cumulative R.

### Discipline Analysis

Show side-by-side R totals for:

- Trades where `criteria_met = true`
- Trades where `criteria_met = false`

The purpose is to compare disciplined execution against broken-criteria execution.

## Trade Log Table

The trade history table must show:

- Date
- Setup name
- Direction
- Entry price
- Stop price
- Target price
- Exit price
- Criteria met
- Notes
- R
- Result

Requirements:

- Newest trades first.
- Color-coded by result:
  - Win: positive/success color
  - Loss: negative/danger color
  - BE: neutral/warning color

MVP scope: the trade history table is read-only. Edit and delete controls are deferred to a future version.

## Supabase Database Requirements

The database must include a `trades` table.

Required columns:

- `id`
- `user_id`
- `date`
- `setup_name`
- `direction`
- `entry_price`
- `stop_price`
- `target_price`
- `exit_price`
- `criteria_met`
- `notes`
- `r_value`
- `result`
- `created_at`
- `updated_at`

Required database behavior:

- `user_id` references `auth.users(id)`.
- R value should be calculated consistently from trade prices.
- Result should be derived from R.
- Add indexes useful for user/date queries.
- Enable Row Level Security.

## Row Level Security

RLS must ensure each user can only access their own trades.

Required policies:

- Authenticated users can select their own trades.
- Authenticated users can insert their own trades.
- Authenticated users can update their own trades.
- Authenticated users can delete their own trades.

Policy rule:

```sql
auth.uid() = user_id
```

## Design Requirements

Visual direction:

- Dark terminal aesthetic
- Navy background
- Cyan accent color
- JetBrains Mono for numbers

UI requirements:

- Dense, dashboard-oriented layout
- Clear navigation between dashboard, logging, and trade history
- Metric cards for dashboard statistics
- Recharts line chart for equity curve
- Side-by-side visual comparison for discipline analysis
- Form controls must be clear and accessible
- Table should be readable on desktop and horizontally scrollable on smaller screens

## Environment Variables

Required environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Deliverables

The project should include:

- Full Next.js 14 App Router application
- Supabase auth integration
- Supabase SQL schema file
- RLS policies
- Trade logging form
- Dashboard analytics
- Recharts equity curve
- Discipline analysis
- Full trade history table
- Tailwind dark terminal styling
- TypeScript types for trades and database usage

## Acceptance Criteria

The app is complete when:

- A user can sign up and log in.
- An authenticated user can create a trade.
- R and result are calculated from price inputs.
- `/dashboard` shows all requested metrics and charts.
- `/log` allows trade entry.
- `/trades` shows all user trades newest first.
- Supabase RLS prevents users from reading or modifying other users' trades.
- The SQL schema can be run in Supabase to create the required database objects.
- `npm run lint` passes.
- `npm run build` passes.
