-- Saved analyses for signed-in users. Run once in the Supabase SQL editor.
-- The server writes rows with the service role key. Each user can read and delete only their own rows.
create table if not exists public.analyses (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  created_at    timestamptz not null default now(),
  content_type  text,
  word_count    integer not null default 0,
  score         numeric(5,1),
  verdict       text,
  preview       text,
  input_text    text not null,
  result        jsonb not null
);

create index if not exists analyses_user_created_idx on public.analyses (user_id, created_at desc);

alter table public.analyses enable row level security;

drop policy if exists "read own analyses" on public.analyses;
create policy "read own analyses" on public.analyses
  for select using ((select auth.uid()) = user_id);

drop policy if exists "delete own analyses" on public.analyses;
create policy "delete own analyses" on public.analyses
  for delete using ((select auth.uid()) = user_id);
