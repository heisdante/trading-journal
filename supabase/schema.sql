create extension if not exists "pgcrypto";

insert into storage.buckets (id, name, public)
values ('trade-screenshots', 'trade-screenshots', false)
on conflict (id) do nothing;

create table if not exists public.trades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  trade_date date not null,
  pair text not null check (char_length(trim(pair)) > 0),
  market text not null check (market in ('Forex', 'Stocks', 'Futures', 'Crypto', 'Indices', 'Options', 'Bonds', 'Funds', 'Economy')),
  setup_name text not null check (char_length(trim(setup_name)) > 0),
  direction text not null check (lower(direction) in ('long', 'short')),
  status text not null default 'Completed' check (status in ('Planned', 'Active', 'Completed')),
  entry_reason text not null default 'Imported trade',
  exit_reason text not null default 'Imported trade',
  entry_price numeric(18, 6) check (entry_price is null or entry_price > 0),
  stop_price numeric(18, 6) check (stop_price is null or stop_price > 0),
  target_price numeric(18, 6) check (target_price is null or target_price > 0),
  exit_price numeric(18, 6) check (exit_price is null or exit_price > 0),
  criteria_met boolean not null default false,
  criteria_status text not null default 'Good' check (criteria_status in ('Good', 'Fail')),
  outcome text check (outcome is null or outcome in ('Win', 'Loss', 'Breakeven')),
  trade_idea_link text,
  screenshots jsonb not null default '[]'::jsonb,
  followed_trading_plan text check (followed_trading_plan is null or followed_trading_plan in ('Yes', 'No')),
  session text check (session is null or session in ('London', 'New York', 'Asian', 'Frankfurt')),
  trade_type text check (trade_type is null or trade_type in ('Day Trade', 'Swing Trade')),
  notes text,
  volume numeric(18, 6),
  commission numeric(18, 6),
  swap numeric(18, 6),
  profit numeric(18, 6),
  risk_percent numeric(6, 3) check (risk_percent is null or (risk_percent > 0 and risk_percent <= 100)),
  source_platform text,
  source_trade_id text,
  opened_at timestamptz,
  closed_at timestamptz,
  emotion text check (emotion is null or emotion in ('Calm', 'Confident', 'Focused', 'Anxious', 'Fearful', 'Frustrated', 'Excited', 'Tired', 'Angry')),
  emotion_notes text,
  review_comment text,
  lesson_learned text,
  next_trade_action text,
  reviewed_at timestamptz,
  review_required boolean not null default false,
  fomo boolean not null default false,
  cut_winner_early boolean not null default false,
  revenge_trade boolean not null default false,
  discipline_score integer check (discipline_score is null or discipline_score between 0 and 100),
  ai_rule_status text not null default 'Unavailable' check (ai_rule_status in ('Pass', 'Warning', 'Unavailable')),
  ai_rule_feedback text,
  r_value numeric(18, 6) generated always as (
    case
      when status <> 'Completed' or entry_price is null or stop_price is null or exit_price is null then 0
      when lower(direction) = 'long' and entry_price <> stop_price
        then (exit_price - entry_price) / nullif(entry_price - stop_price, 0)
      when lower(direction) = 'short' and stop_price <> entry_price
        then (entry_price - exit_price) / nullif(stop_price - entry_price, 0)
      else 0
    end
  ) stored,
  result text generated always as (
    case
      when status = 'Planned' then 'Planned'
      when status = 'Active' then 'Open'
      when (
        case
          when lower(direction) = 'long' and entry_price <> stop_price
            then (exit_price - entry_price) / nullif(entry_price - stop_price, 0)
          when lower(direction) = 'short' and stop_price <> entry_price
            then (entry_price - exit_price) / nullif(stop_price - entry_price, 0)
          else 0
        end
      ) > 0 then 'Win'
      when (
        case
          when lower(direction) = 'long' and entry_price <> stop_price
            then (exit_price - entry_price) / nullif(entry_price - stop_price, 0)
          when lower(direction) = 'short' and stop_price <> entry_price
            then (entry_price - exit_price) / nullif(stop_price - entry_price, 0)
          else 0
        end
      ) < 0 then 'Loss'
      else 'BE'
    end
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_long_risk check (
    lower(direction) <> 'long' or entry_price > stop_price
  ),
  constraint valid_short_risk check (
    lower(direction) <> 'short' or stop_price > entry_price
  )
);

alter table public.trades add column if not exists entry_reason text not null default 'Imported trade';
alter table public.trades add column if not exists exit_reason text not null default 'Imported trade';
alter table public.trades add column if not exists status text not null default 'Completed' check (status in ('Planned', 'Active', 'Completed'));
alter table public.trades alter column entry_price drop not null;
alter table public.trades alter column stop_price drop not null;
alter table public.trades alter column exit_price drop not null;
alter table public.trades alter column outcome drop not null;
alter table public.trades alter column followed_trading_plan drop not null;
alter table public.trades alter column session drop not null;
alter table public.trades alter column trade_type drop not null;
alter table public.trades add column if not exists volume numeric(18, 6);
alter table public.trades add column if not exists commission numeric(18, 6);
alter table public.trades add column if not exists swap numeric(18, 6);
alter table public.trades add column if not exists profit numeric(18, 6);
alter table public.trades add column if not exists risk_percent numeric(6, 3);
alter table public.trades add column if not exists source_platform text;
alter table public.trades add column if not exists source_trade_id text;
alter table public.trades add column if not exists opened_at timestamptz;
alter table public.trades add column if not exists closed_at timestamptz;
alter table public.trades add column if not exists emotion text;
alter table public.trades add column if not exists emotion_notes text;
alter table public.trades add column if not exists fomo boolean not null default false;
alter table public.trades add column if not exists cut_winner_early boolean not null default false;
alter table public.trades add column if not exists revenge_trade boolean not null default false;
alter table public.trades add column if not exists discipline_score integer;
alter table public.trades add column if not exists ai_rule_status text not null default 'Unavailable';
alter table public.trades add column if not exists ai_rule_feedback text;
alter table public.trades add column if not exists review_comment text;
alter table public.trades add column if not exists lesson_learned text;
alter table public.trades add column if not exists next_trade_action text;
alter table public.trades add column if not exists reviewed_at timestamptz;
alter table public.trades add column if not exists review_required boolean not null default false;

alter table public.trades drop column if exists r_value;
alter table public.trades drop column if exists result;
alter table public.trades add column r_value numeric(18, 6) generated always as (
  case
    when status <> 'Completed' or entry_price is null or stop_price is null or exit_price is null then 0
    when lower(direction) = 'long' and entry_price <> stop_price then (exit_price - entry_price) / nullif(entry_price - stop_price, 0)
    when lower(direction) = 'short' and stop_price <> entry_price then (entry_price - exit_price) / nullif(stop_price - entry_price, 0)
    else 0
  end
) stored;
alter table public.trades add column result text generated always as (
  case
    when status = 'Planned' then 'Planned'
    when status = 'Active' then 'Open'
    when lower(direction) = 'long' and entry_price is not null and stop_price is not null and exit_price is not null and entry_price <> stop_price and (exit_price - entry_price) / nullif(entry_price - stop_price, 0) > 0 then 'Win'
    when lower(direction) = 'short' and entry_price is not null and stop_price is not null and exit_price is not null and stop_price <> entry_price and (entry_price - exit_price) / nullif(stop_price - entry_price, 0) > 0 then 'Win'
    when lower(direction) = 'long' and entry_price is not null and stop_price is not null and exit_price is not null and entry_price <> stop_price and (exit_price - entry_price) / nullif(entry_price - stop_price, 0) < 0 then 'Loss'
    when lower(direction) = 'short' and entry_price is not null and stop_price is not null and exit_price is not null and stop_price <> entry_price and (entry_price - exit_price) / nullif(stop_price - entry_price, 0) < 0 then 'Loss'
    else 'BE'
  end
) stored;

create table if not exists public.growth_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null check (char_length(trim(title)) > 0),
  account_type text not null check (account_type in ('Prop firm', 'Personal account')),
  starting_balance numeric(18, 2) not null check (starting_balance > 0),
  target_balance numeric(18, 2) not null check (target_balance > starting_balance),
  currency text not null default 'USD' check (char_length(currency) = 3),
  risk_percent numeric(6, 3) not null check (risk_percent > 0 and risk_percent <= 100),
  deadline date,
  milestones text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.trading_rules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null check (char_length(trim(title)) > 0),
  rule_text text not null check (char_length(trim(rule_text)) > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  review_date date not null,
  day_rating integer not null check (day_rating between 1 and 10),
  discipline_score integer not null check (discipline_score between 0 and 100),
  emotion text check (emotion is null or emotion in ('Calm', 'Confident', 'Focused', 'Anxious', 'Fearful', 'Frustrated', 'Excited', 'Tired', 'Angry')),
  summary text,
  lesson text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, review_date)
);

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  full_name text,
  timezone text not null default 'UTC',
  currency text not null default 'USD' check (char_length(currency) = 3),
  default_market text check (default_market is null or default_market in ('Forex', 'Stocks', 'Futures', 'Crypto', 'Indices', 'Options', 'Bonds', 'Funds', 'Economy')),
  default_session text check (default_session is null or default_session in ('London', 'New York', 'Asian', 'Frankfurt')),
  default_trade_type text check (default_trade_type is null or default_trade_type in ('Day Trade', 'Swing Trade')),
  default_risk_percent numeric(6, 3) check (default_risk_percent is null or (default_risk_percent > 0 and default_risk_percent <= 100)),
  ai_coach_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trades_set_updated_at on public.trades;
create trigger trades_set_updated_at
before update on public.trades
for each row execute function public.set_updated_at();

drop trigger if exists trading_rules_set_updated_at on public.trading_rules;
create trigger trading_rules_set_updated_at before update on public.trading_rules for each row execute function public.set_updated_at();
drop trigger if exists daily_reviews_set_updated_at on public.daily_reviews;
create trigger daily_reviews_set_updated_at before update on public.daily_reviews for each row execute function public.set_updated_at();
drop trigger if exists user_profiles_set_updated_at on public.user_profiles;
create trigger user_profiles_set_updated_at before update on public.user_profiles for each row execute function public.set_updated_at();

alter table public.trades enable row level security;
alter table public.trading_rules enable row level security;
alter table public.daily_reviews enable row level security;
alter table public.user_profiles enable row level security;
alter table public.growth_plans enable row level security;

grant select, insert, update, delete on public.trades to authenticated;
grant select, insert, update, delete on public.trading_rules to authenticated;
grant select, insert, update, delete on public.daily_reviews to authenticated;
grant select, insert, update, delete on public.user_profiles to authenticated;
grant select, insert, update, delete on public.growth_plans to authenticated;

drop policy if exists "Users can manage their own growth plans" on public.growth_plans;
create policy "Users can manage their own growth plans" on public.growth_plans for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "Users can manage their own trading rules" on public.trading_rules;
create policy "Users can manage their own trading rules" on public.trading_rules for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Users can manage their own daily reviews" on public.daily_reviews;
create policy "Users can manage their own daily reviews" on public.daily_reviews for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "Users can manage their own profile" on public.user_profiles;
create policy "Users can manage their own profile" on public.user_profiles for all to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "Users can read their own trades" on public.trades;
create policy "Users can read their own trades"
on public.trades for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own trades" on public.trades;
create policy "Users can insert their own trades"
on public.trades for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own trades" on public.trades;
create policy "Users can update their own trades"
on public.trades for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own trades" on public.trades;
create policy "Users can delete their own trades"
on public.trades for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can read their own trade screenshots" on storage.objects;
create policy "Users can read their own trade screenshots"
on storage.objects for select
to authenticated
using (
  bucket_id = 'trade-screenshots'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can upload their own trade screenshots" on storage.objects;
create policy "Users can upload their own trade screenshots"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'trade-screenshots'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can update their own trade screenshots" on storage.objects;
create policy "Users can update their own trade screenshots"
on storage.objects for update
to authenticated
using (
  bucket_id = 'trade-screenshots'
  and (select auth.uid())::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'trade-screenshots'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can delete their own trade screenshots" on storage.objects;
create policy "Users can delete their own trade screenshots"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'trade-screenshots'
  and (select auth.uid())::text = (storage.foldername(name))[1]
);

create index if not exists trades_user_date_idx on public.trades (user_id, trade_date desc, created_at desc);
create index if not exists trades_user_result_idx on public.trades (user_id, result);
create index if not exists trades_user_criteria_idx on public.trades (user_id, criteria_met);
create index if not exists trades_user_rule_status_idx on public.trades (user_id, ai_rule_status, trade_date desc);
create index if not exists daily_reviews_user_date_idx on public.daily_reviews (user_id, review_date desc);
create index if not exists growth_plans_user_active_idx on public.growth_plans (user_id, is_active, created_at desc);
