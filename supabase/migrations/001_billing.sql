-- ContentTrace billing schema.
-- Run once in the Supabase SQL editor (Dashboard > SQL Editor > New query > paste > Run).
-- The server uses the service role key; browsers can only read their own profile row.

-- 1. Profiles: one row per signed-in user ------------------------------------------
create table if not exists public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  email               text,
  stripe_customer_id  text unique,
  sub_status          text,          -- Stripe subscription status: active, trialing, past_due, canceled, ...
  sub_price_id        text,          -- Stripe price of the current subscription
  sub_period_end      timestamptz,   -- end of the paid period
  pack_words          integer not null default 0 check (pack_words >= 0),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles
  for select using (auth.uid() = id);

-- Create a profile automatically when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Usage counters --------------------------------------------------------------
-- subject: 'user:<uuid>' (free, signed in), 'anon:<id>' (free, no account), 'ip:<hash>' (free, per network), 'pro:<uuid>' (Pro words). period: 'YYYY-MM' (UTC).
create table if not exists public.usage (
  subject    text not null,
  period     text not null,
  analyses   integer not null default 0,
  words      integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (subject, period)
);

alter table public.usage enable row level security;  -- no policies: server only

-- Atomically add one analysis and p_words, but only if the limits allow it.
-- A limit of null means "no limit". Returns true when the usage was recorded.
create or replace function public.consume_usage(
  p_subject text, p_period text, p_words integer,
  p_max_analyses integer, p_max_words integer
) returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  ok boolean;
begin
  insert into public.usage (subject, period) values (p_subject, p_period)
  on conflict (subject, period) do nothing;

  update public.usage
     set analyses = analyses + 1,
         words = words + p_words,
         updated_at = now()
   where subject = p_subject and period = p_period
     and (p_max_analyses is null or analyses + 1 <= p_max_analyses)
     and (p_max_words is null or words + p_words <= p_max_words)
  returning true into ok;

  return coalesce(ok, false);
end;
$$;

-- Undo one consume_usage call (used when an analysis fails).
create or replace function public.release_usage(
  p_subject text, p_period text, p_words integer
) returns void
language sql
security definer set search_path = public
as $$
  update public.usage
     set analyses = greatest(analyses - 1, 0),
         words = greatest(words - p_words, 0),
         updated_at = now()
   where subject = p_subject and period = p_period;
$$;

-- 3. Word pack credits ------------------------------------------------------------
create or replace function public.consume_pack(p_user uuid, p_words integer)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  ok boolean;
begin
  update public.profiles
     set pack_words = pack_words - p_words, updated_at = now()
   where id = p_user and pack_words >= p_words
  returning true into ok;
  return coalesce(ok, false);
end;
$$;

create or replace function public.add_pack(p_user uuid, p_words integer)
returns void
language sql
security definer set search_path = public
as $$
  update public.profiles
     set pack_words = pack_words + p_words, updated_at = now()
   where id = p_user;
$$;

-- 4. Stripe webhook idempotency ---------------------------------------------------
create table if not exists public.stripe_events (
  id          text primary key,
  type        text not null,
  received_at timestamptz not null default now()
);

alter table public.stripe_events enable row level security;  -- server only

-- Only the server (service role) may call the counter functions.
revoke execute on function public.consume_usage(text, text, integer, integer, integer) from public, anon, authenticated;
revoke execute on function public.release_usage(text, text, integer) from public, anon, authenticated;
revoke execute on function public.consume_pack(uuid, integer) from public, anon, authenticated;
revoke execute on function public.add_pack(uuid, integer) from public, anon, authenticated;
-- The trigger function must not be callable through the REST API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
