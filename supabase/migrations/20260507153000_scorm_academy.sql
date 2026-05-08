-- Academy SCORM: enrollments, sessions, quiz responses, progress compatibility view.
-- Run via Supabase CLI or SQL Editor. Requires Postgres 15+ for security_invoker views.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id text not null,
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create index if not exists enrollments_user_id_idx on public.enrollments (user_id);

create table if not exists public.scorm_sessions (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments (id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  is_complete boolean not null default false,
  score numeric,
  lesson_status text,
  lesson_location text,
  suspend_data text,
  session_time text,
  raw_cmi jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists scorm_sessions_enrollment_started_idx
  on public.scorm_sessions (enrollment_id, started_at desc);

create table if not exists public.quiz_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.scorm_sessions (id) on delete cascade,
  interaction_id text,
  interaction_type text,
  learner_response text,
  correct_response text,
  result text,
  latency text,
  recorded_at timestamptz not null default now()
);

create index if not exists quiz_responses_session_idx on public.quiz_responses (session_id);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

alter table public.enrollments enable row level security;
alter table public.scorm_sessions enable row level security;
alter table public.quiz_responses enable row level security;

drop policy if exists "enrollments_select_own" on public.enrollments;
create policy "enrollments_select_own"
  on public.enrollments for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "enrollments_insert_own" on public.enrollments;
create policy "enrollments_insert_own"
  on public.enrollments for insert to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists "enrollments_update_own" on public.enrollments;
create policy "enrollments_update_own"
  on public.enrollments for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists "sessions_all_via_enrollment" on public.scorm_sessions;
create policy "sessions_all_via_enrollment"
  on public.scorm_sessions for all to authenticated
  using (
    exists (
      select 1
      from public.enrollments e
      where e.id = scorm_sessions.enrollment_id
        and e.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.enrollments e
      where e.id = scorm_sessions.enrollment_id
        and e.user_id = (select auth.uid())
    )
  );

drop policy if exists "quiz_all_via_session" on public.quiz_responses;
create policy "quiz_all_via_session"
  on public.quiz_responses for all to authenticated
  using (
    exists (
      select 1
      from public.scorm_sessions s
      join public.enrollments e on e.id = s.enrollment_id
      where s.id = quiz_responses.session_id
        and e.user_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.scorm_sessions s
      join public.enrollments e on e.id = s.enrollment_id
      where s.id = quiz_responses.session_id
        and e.user_id = (select auth.uid())
    )
  );

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.enrollments to authenticated;
grant select, insert, update, delete on public.scorm_sessions to authenticated;
grant select, insert, update, delete on public.quiz_responses to authenticated;

-- ---------------------------------------------------------------------------
-- Compatibility view (one row per enrollment; prefer latest incomplete session)
-- ---------------------------------------------------------------------------

create or replace view public.progress_compat
with (security_invoker = true)
as
with sessions_ranked as (
  select
    s.id,
    s.enrollment_id,
    s.suspend_data,
    s.score,
    s.raw_cmi,
    s.updated_at,
    s.started_at,
    s.is_complete,
    e.user_id,
    e.course_id,
    row_number() over (
      partition by s.enrollment_id
      order by s.is_complete asc, s.started_at desc
    ) as rn_pick
  from public.scorm_sessions s
  join public.enrollments e on e.id = s.enrollment_id
)
select
  sr.user_id,
  sr.course_id,
  coalesce(sr.suspend_data, '') as suspend_data,
  coalesce(sr.score, 0) as score,
  least(
    100,
    greatest(
      0,
      round(
        coalesce(
          sr.score,
          nullif(trim(sr.raw_cmi #>> '{core,score,raw}'), '')::numeric,
          0
        )
      )::int
    )
  ) as progress_percent,
  coalesce(sr.updated_at, sr.started_at) as updated_at
from sessions_ranked sr
where sr.rn_pick = 1;

grant select on public.progress_compat to authenticated;

-- ---------------------------------------------------------------------------
-- Optional: backfill from legacy public.progress if it exists (one-time)
-- ---------------------------------------------------------------------------

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'progress'
  ) then
    -- Legacy `progress` schemas can vary by environment; only backfill when
    -- required columns are available and default optional ones safely.
    if exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'progress'
        and column_name = 'user_id'
    ) and exists (
      select 1
      from information_schema.columns
      where table_schema = 'public'
        and table_name = 'progress'
        and column_name = 'course_id'
    ) then
      insert into public.enrollments (user_id, course_id)
      select distinct p.user_id, p.course_id::text
      from public.progress p
      on conflict (user_id, course_id) do nothing;

      insert into public.scorm_sessions (
        enrollment_id,
        started_at,
        finished_at,
        is_complete,
        score,
        lesson_status,
        lesson_location,
        suspend_data,
        session_time,
        raw_cmi,
        updated_at
      )
      select
        e.id,
        coalesce(
          (to_jsonb(p) ->> 'updated_at')::timestamptz,
          now()
        ),
        case
          when coalesce((to_jsonb(p) ->> 'progress_percent')::numeric, 0) >= 100
            then coalesce((to_jsonb(p) ->> 'updated_at')::timestamptz, now())
          else null
        end,
        coalesce((to_jsonb(p) ->> 'progress_percent')::numeric, 0) >= 100,
        nullif(to_jsonb(p) ->> 'score', '')::numeric,
        null,
        null,
        coalesce(to_jsonb(p) ->> 'suspend_data', ''),
        null,
        jsonb_build_object(
          'suspend_data', coalesce(to_jsonb(p) ->> 'suspend_data', ''),
          'core',
          jsonb_build_object(
            'score',
            jsonb_build_object('raw', coalesce(to_jsonb(p) ->> 'score', '')),
            'lesson_location',
            '0',
            'lesson_status',
            case
              when coalesce((to_jsonb(p) ->> 'progress_percent')::numeric, 0) >= 100
                then 'completed'
              else 'incomplete'
            end
          )
        ),
        coalesce(
          (to_jsonb(p) ->> 'updated_at')::timestamptz,
          now()
        )
      from public.progress p
      join public.enrollments e
        on e.user_id = p.user_id
       and e.course_id = p.course_id::text
      where not exists (
        select 1
        from public.scorm_sessions s
        where s.enrollment_id = e.id
      );
    end if;
  end if;
end $$;
