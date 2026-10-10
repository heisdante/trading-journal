create table if not exists public.analysis_studies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  trade_id uuid references public.trades(id) on delete set null,
  title text not null check (char_length(trim(title)) between 1 and 160),
  outcome text not null default 'Exploring' check (outcome in ('Exploring', 'Win', 'Loss')),
  status text not null default 'In progress' check (status in ('In progress', 'Complete')),
  cause text not null default '',
  lesson text not null default '',
  next_action text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analysis_evidence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  study_id uuid not null references public.analysis_studies(id) on delete cascade,
  kind text not null check (kind in ('Note', 'Link', 'Screenshot')),
  body text not null default '',
  storage_path text,
  created_at timestamptz not null default now(),
  constraint analysis_evidence_content check (
    (kind = 'Screenshot' and storage_path is not null)
    or (kind in ('Note', 'Link') and char_length(trim(body)) > 0)
  )
);

create table if not exists public.analysis_matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  study_id uuid not null references public.analysis_studies(id) on delete cascade,
  trade_id uuid not null references public.trades(id) on delete cascade,
  rationale text not null default '',
  review_status text not null default 'Suggested' check (review_status in ('Suggested', 'Confirmed', 'Dismissed')),
  created_at timestamptz not null default now(),
  unique (study_id, trade_id)
);

create index if not exists analysis_studies_user_updated_idx on public.analysis_studies (user_id, updated_at desc);
create index if not exists analysis_evidence_study_created_idx on public.analysis_evidence (study_id, created_at);
create index if not exists analysis_matches_user_status_idx on public.analysis_matches (user_id, review_status, created_at desc);

alter table public.analysis_studies enable row level security;
alter table public.analysis_evidence enable row level security;
alter table public.analysis_matches enable row level security;

grant select, insert, update, delete on public.analysis_studies to authenticated;
grant select, insert, update, delete on public.analysis_evidence to authenticated;
grant select, insert, update, delete on public.analysis_matches to authenticated;

drop policy if exists "Users manage their analysis studies" on public.analysis_studies;
create policy "Users manage their analysis studies" on public.analysis_studies
for all to authenticated
using ((select auth.uid()) = user_id and (
  trade_id is null or exists (select 1 from public.trades t where t.id = trade_id and t.user_id = (select auth.uid()))
))
with check ((select auth.uid()) = user_id and (
  trade_id is null or exists (select 1 from public.trades t where t.id = trade_id and t.user_id = (select auth.uid()))
));

drop policy if exists "Users manage evidence in their studies" on public.analysis_evidence;
create policy "Users manage evidence in their studies" on public.analysis_evidence
for all to authenticated
using ((select auth.uid()) = user_id and exists (
  select 1 from public.analysis_studies s where s.id = study_id and s.user_id = (select auth.uid())
))
with check ((select auth.uid()) = user_id and exists (
  select 1 from public.analysis_studies s where s.id = study_id and s.user_id = (select auth.uid())
));

drop policy if exists "Users manage their pattern reviews" on public.analysis_matches;
create policy "Users manage their pattern reviews" on public.analysis_matches
for all to authenticated
using ((select auth.uid()) = user_id
  and exists (select 1 from public.analysis_studies s where s.id = study_id and s.user_id = (select auth.uid()))
  and exists (select 1 from public.trades t where t.id = trade_id and t.user_id = (select auth.uid())))
with check ((select auth.uid()) = user_id
  and exists (select 1 from public.analysis_studies s where s.id = study_id and s.user_id = (select auth.uid()))
  and exists (select 1 from public.trades t where t.id = trade_id and t.user_id = (select auth.uid())));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('analysis-evidence', 'analysis-evidence', false, 10485760, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "Users read their analysis screenshots" on storage.objects;
create policy "Users read their analysis screenshots" on storage.objects
for select to authenticated
using (bucket_id = 'analysis-evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "Users upload their analysis screenshots" on storage.objects;
create policy "Users upload their analysis screenshots" on storage.objects
for insert to authenticated
with check (bucket_id = 'analysis-evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "Users delete their analysis screenshots" on storage.objects;
create policy "Users delete their analysis screenshots" on storage.objects
for delete to authenticated
using (bucket_id = 'analysis-evidence' and (storage.foldername(name))[1] = (select auth.uid())::text);
