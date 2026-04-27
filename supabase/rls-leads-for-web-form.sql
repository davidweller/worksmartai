-- Run in Supabase: Dashboard -> SQL -> New query.
-- Use when the higher-education guide form (browser + anon key) returns HTTP 401/403
-- or "new row violates row-level security policy for table leads".

-- 1) Table: adjust if yours already exists (keep column names: name, email, source)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text,
  email text not null,
  source text
);

alter table public.leads add column if not exists name text;
alter table public.leads add column if not exists email text;
alter table public.leads add column if not exists source text;
alter table public.leads add column if not exists created_at timestamptz not null default now();

-- 2) RLS: allow anonymous inserts from the public site (anon + anon key)
alter table public.leads enable row level security;

drop policy if exists "web_lead_insert" on public.leads;

-- AllowInserts for site visitors (anon key = role anon) and for any logged-in users if you later use auth
create policy "web_lead_insert"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- 3) Privileges: PostgREST uses role "anon" for the publishable key
grant usage on schema public to anon;
grant insert on table public.leads to anon;
grant insert on table public.leads to authenticated;
