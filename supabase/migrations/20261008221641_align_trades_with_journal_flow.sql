-- Bring existing trading-journal projects forward without replacing their trades.
-- Older projects have the original completed-trade table and miss the journal fields.
begin;
alter table public.trades add column if not exists trade_date date;
alter table public.trades add column if not exists pair text;
alter table public.trades add column if not exists market text;
alter table public.trades add column if not exists setup_name text;
alter table public.trades add column if not exists direction text;
alter table public.trades add column if not exists status text not null default 'Completed';
alter table public.trades add column if not exists entry_reason text not null default 'Imported trade';
alter table public.trades add column if not exists exit_reason text not null default 'Imported trade';
alter table public.trades add column if not exists entry_price numeric(18, 6);
alter table public.trades add column if not exists stop_price numeric(18, 6);
alter table public.trades add column if not exists target_price numeric(18, 6);
alter table public.trades add column if not exists exit_price numeric(18, 6);
alter table public.trades add column if not exists criteria_met boolean not null default false;
alter table public.trades add column if not exists criteria_status text not null default 'Good';
alter table public.trades add column if not exists outcome text;
alter table public.trades add column if not exists trade_idea_link text;
alter table public.trades add column if not exists screenshots jsonb not null default '[]'::jsonb;
alter table public.trades add column if not exists followed_trading_plan text;
alter table public.trades add column if not exists session text;
alter table public.trades add column if not exists trade_type text;
alter table public.trades add column if not exists notes text;
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

-- Some first-generation tables used `date`, and constrained `pair` to market names.
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'trades' and column_name = 'date') then
    execute 'update public.trades set trade_date = date where trade_date is null';
    execute 'alter table public.trades alter column date drop not null';
  end if;
end $$;

update public.trades set trade_date = coalesce(trade_date, created_at::date, current_date) where trade_date is null;
update public.trades set market = case when pair in ('Forex','Stocks','Futures','Crypto','Indices','Options','Bonds','Funds','Economy') then pair else 'Forex' end where market is null;
update public.trades set pair = coalesce(nullif(pair, ''), nullif(setup_name, ''), 'Imported trade') where pair is null or pair = '';
update public.trades set setup_name = coalesce(nullif(setup_name, ''), pair || ' trade') where setup_name is null or setup_name = '';
-- Preserve the first-generation outcome before replacing its plain result field.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'trades'
      and column_name = 'result' and is_generated = 'NEVER'
  ) then
    update public.trades set outcome = case
      when result = 'Win' then 'Win'
      when result = 'Loss' then 'Loss'
      when result in ('BE', 'Breakeven') then 'Breakeven'
      else outcome
    end where outcome is null;
    alter table public.trades rename column result to legacy_result;
  end if;
end $$;
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'trades' and column_name = 'legacy_result') then
    alter table public.trades alter column legacy_result drop not null;
  end if;
end $$;
alter table public.trades alter column trade_date set not null;
alter table public.trades alter column market set not null;
alter table public.trades alter column pair set not null;
alter table public.trades alter column entry_price drop not null;
alter table public.trades alter column stop_price drop not null;
alter table public.trades alter column exit_price drop not null;
alter table public.trades alter column outcome drop not null;
alter table public.trades alter column followed_trading_plan drop not null;
alter table public.trades alter column session drop not null;
alter table public.trades alter column trade_type drop not null;
-- The old completed-trade model required this value on every insert.
-- Planned and active trades cannot have an R multiple yet.
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'trades' and column_name = 'r_multiple') then
    alter table public.trades alter column r_multiple drop not null;
  end if;
end $$;
alter table public.trades drop constraint if exists trades_pair_check;

-- Keep the original result values for historical records while giving the app
-- a status-aware generated result for planned, active, and completed trades.
alter table public.trades add column if not exists r_value numeric(18, 6) generated always as (
  case
    when status <> 'Completed' or entry_price is null or stop_price is null or exit_price is null then 0
    when direction = 'Long' and entry_price <> stop_price then (exit_price - entry_price) / nullif(entry_price - stop_price, 0)
    when direction = 'Short' and stop_price <> entry_price then (entry_price - exit_price) / nullif(stop_price - entry_price, 0)
    else 0
  end
) stored;
alter table public.trades add column if not exists result text generated always as (
  case
    when status = 'Planned' then 'Planned'
    when status = 'Active' then 'Open'
    when direction = 'Long' and entry_price is not null and stop_price is not null and exit_price is not null and entry_price <> stop_price and (exit_price - entry_price) / nullif(entry_price - stop_price, 0) > 0 then 'Win'
    when direction = 'Short' and entry_price is not null and stop_price is not null and exit_price is not null and stop_price <> entry_price and (entry_price - exit_price) / nullif(stop_price - entry_price, 0) > 0 then 'Win'
    when direction = 'Long' and entry_price is not null and stop_price is not null and exit_price is not null and entry_price <> stop_price and (exit_price - entry_price) / nullif(entry_price - stop_price, 0) < 0 then 'Loss'
    when direction = 'Short' and entry_price is not null and stop_price is not null and exit_price is not null and stop_price <> entry_price and (entry_price - exit_price) / nullif(stop_price - entry_price, 0) < 0 then 'Loss'
    else 'BE'
  end
) stored;

create index if not exists trades_user_date_idx on public.trades (user_id, trade_date desc, created_at desc);
create index if not exists trades_user_result_idx on public.trades (user_id, result);
create index if not exists trades_user_rule_status_idx on public.trades (user_id, ai_rule_status, trade_date desc);

-- Refresh PostgREST after the DDL transaction commits.
notify pgrst, 'reload schema';
commit;
