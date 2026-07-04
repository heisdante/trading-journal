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
  direction text not null check (direction in ('Long', 'Short')),
  entry_price numeric(18, 6) not null check (entry_price > 0),
  stop_price numeric(18, 6) not null check (stop_price > 0),
  target_price numeric(18, 6) check (target_price is null or target_price > 0),
  exit_price numeric(18, 6) not null check (exit_price > 0),
  criteria_met boolean not null default false,
  criteria_status text not null default 'Good' check (criteria_status in ('Good', 'Fail')),
  outcome text not null check (outcome in ('Win', 'Loss', 'Breakeven')),
  trade_idea_link text,
  screenshots jsonb not null default '[]'::jsonb,
  followed_trading_plan text not null check (followed_trading_plan in ('Yes', 'No')),
  session text not null check (session in ('London', 'New York', 'Asian', 'Frankfurt')),
  trade_type text not null check (trade_type in ('Day Trade', 'Swing Trade')),
  notes text,
  r_value numeric(18, 6) generated always as (
    case
      when direction = 'Long' and entry_price <> stop_price
        then (exit_price - entry_price) / nullif(entry_price - stop_price, 0)
      when direction = 'Short' and stop_price <> entry_price
        then (entry_price - exit_price) / nullif(stop_price - entry_price, 0)
      else 0
    end
  ) stored,
  result text generated always as (
    case
      when (
        case
          when direction = 'Long' and entry_price <> stop_price
            then (exit_price - entry_price) / nullif(entry_price - stop_price, 0)
          when direction = 'Short' and stop_price <> entry_price
            then (entry_price - exit_price) / nullif(stop_price - entry_price, 0)
          else 0
        end
      ) > 0 then 'Win'
      when (
        case
          when direction = 'Long' and entry_price <> stop_price
            then (exit_price - entry_price) / nullif(entry_price - stop_price, 0)
          when direction = 'Short' and stop_price <> entry_price
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
    direction <> 'Long' or entry_price > stop_price
  ),
  constraint valid_short_risk check (
    direction <> 'Short' or stop_price > entry_price
  )
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

alter table public.trades enable row level security;

drop policy if exists "Users can read their own trades" on public.trades;
create policy "Users can read their own trades"
on public.trades for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own trades" on public.trades;
create policy "Users can insert their own trades"
on public.trades for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own trades" on public.trades;
create policy "Users can update their own trades"
on public.trades for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own trades" on public.trades;
create policy "Users can delete their own trades"
on public.trades for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can read their own trade screenshots" on storage.objects;
create policy "Users can read their own trade screenshots"
on storage.objects for select
to authenticated
using (
  bucket_id = 'trade-screenshots'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can upload their own trade screenshots" on storage.objects;
create policy "Users can upload their own trade screenshots"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'trade-screenshots'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can update their own trade screenshots" on storage.objects;
create policy "Users can update their own trade screenshots"
on storage.objects for update
to authenticated
using (
  bucket_id = 'trade-screenshots'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'trade-screenshots'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "Users can delete their own trade screenshots" on storage.objects;
create policy "Users can delete their own trade screenshots"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'trade-screenshots'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create index if not exists trades_user_date_idx on public.trades (user_id, trade_date desc, created_at desc);
create index if not exists trades_user_result_idx on public.trades (user_id, result);
create index if not exists trades_user_criteria_idx on public.trades (user_id, criteria_met);
