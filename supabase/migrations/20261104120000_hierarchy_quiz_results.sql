-- AI Use Hierarchy Quiz submissions, written only by the send-quiz-results edge function (service role).
-- Levels are 0-5, where 0 is Starting Level 1. team_code is reserved for the phase 2 leader view.

create table if not exists public.hierarchy_quiz_results (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  name text,
  role text,
  approved_tool text,
  capability smallint not null check (capability between 0 and 5),
  confidence smallint not null check (confidence between 0 and 5),
  compliance smallint not null check (compliance between 0 and 5),
  patterns text[] not null default '{}',
  answers jsonb not null,
  marketing_opt_in boolean not null default false,
  source text,
  team_code text,
  quiz_version text not null
);

create index if not exists hierarchy_quiz_results_email_created_idx
  on public.hierarchy_quiz_results (email, created_at desc);

-- RLS on with no policies: anon and authenticated can't read or write; the service role bypasses RLS.
alter table public.hierarchy_quiz_results enable row level security;

alter table public.leads add column if not exists marketing_opt_in boolean;
