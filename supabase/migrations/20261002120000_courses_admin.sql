-- Course registry and Academy admins.
-- Courses move out of code into public.courses so admins can add them from /academy/admin/
-- without a rebuild. Admins are users with app_metadata.role = 'admin' (set by SQL only).

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

grant execute on function public.is_admin() to authenticated;

create table if not exists public.courses (
  id text primary key check (id ~ '^[a-z0-9-]{3,60}$'),
  title text not null,
  code text not null default '',
  summary text not null default '',
  level text not null default 'Foundation',
  group_name text not null default 'All-Staff Workshops',
  module text not null default '',
  content_path text not null,
  page_titles text[] not null,
  page_count int generated always as (cardinality(page_titles)) stored,
  is_live boolean not null default true,
  sort_order int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (cardinality(page_titles) >= 1)
);

alter table public.courses enable row level security;

drop policy if exists courses_select_authenticated on public.courses;
create policy courses_select_authenticated on public.courses
  for select to authenticated using (true);

drop policy if exists courses_admin_insert on public.courses;
create policy courses_admin_insert on public.courses
  for insert to authenticated with check (public.is_admin());

drop policy if exists courses_admin_update on public.courses;
create policy courses_admin_update on public.courses
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists courses_admin_delete on public.courses;
create policy courses_admin_delete on public.courses
  for delete to authenticated using (public.is_admin());

grant select, insert, update, delete on public.courses to authenticated;

-- Admins can see every enrolment (writes still go through the admin-enroll Edge Function).
drop policy if exists enrollments_admin_select on public.enrollments;
create policy enrollments_admin_select on public.enrollments
  for select to authenticated using (public.is_admin());

insert into public.courses (id, title, code, summary, level, group_name, module, content_path, page_titles, sort_order)
values
  (
    'ai-foundations',
    'AI Foundations & Responsible Use',
    'AI FOUNDATIONS',
    'Core principles, safe use patterns, and practical prompting for teams.',
    'Foundation',
    'All-Staff Workshops',
    'Module 1',
    'ai_fundamentals',
    array[
      'You already use AI',
      'How AI actually works',
      'The AI use hierarchy',
      'Responsible use principles',
      'Green/amber/red decisions',
      'Your first AI task',
      'Reflection and next steps'
    ],
    10
  ),
  (
    'copilot-intermediate-advanced',
    'Intermediate to Advanced Copilot',
    'INTERMEDIATE TO ADVANCED COPILOT',
    'Plan, build and test Copilot agents and workflows, and judge when they are good enough to use.',
    'Intermediate',
    'All-Staff Workshops',
    'Agents and Workflows',
    'copilot-intermediate-advanced',
    array[
      'Introduction',
      'Module 1: Prompt, agent, workflow',
      'Module 2: What an agent is made of',
      'Module 3: Plan the agent',
      'Module 4: Build and test the agent',
      'Module 5: Plan the workflow',
      'Module 6: Build and test the workflow',
      'Module 7: Good enough to use?',
      'Course conclusion and next steps'
    ],
    20
  )
on conflict (id) do nothing;

-- Page totals now come from public.courses instead of a hardcoded CASE.
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
),
with_totals as (
  select
    sr.*,
    coalesce(c.page_count, 7) as total_pages
  from sessions_ranked sr
  left join public.courses c on c.id = sr.course_id
  where sr.rn_pick = 1
),
parsed as (
  select
    wt.user_id,
    wt.course_id,
    wt.suspend_data,
    wt.updated_at,
    wt.started_at,
    wt.total_pages,
    case
      when nullif(trim(wt.suspend_data), '') is not null
        and left(trim(wt.suspend_data), 1) = '{'
      then coalesce(
        (
          select count(distinct value)::int
          from jsonb_array_elements_text((wt.suspend_data::jsonb) -> 'viewed') as value
          where value ~ '^\d+$'
            and value::int >= 0
            and value::int < wt.total_pages
        ),
        0
      )
      else 0
    end as pages_viewed,
    coalesce(
      wt.score,
      nullif(trim(wt.raw_cmi #>> '{core,score,raw}'), '')::numeric,
      0
    ) as quiz_score,
    coalesce(
      nullif(trim(wt.raw_cmi #>> '{core,score,max}'), '')::numeric,
      10
    ) as quiz_score_max
  from with_totals wt
)
select
  user_id,
  course_id,
  coalesce(suspend_data, '') as suspend_data,
  coalesce(quiz_score, 0) as score,
  least(
    100,
    greatest(
      0,
      round(
        0.5 * (least(pages_viewed, total_pages)::numeric / total_pages * 100)
        + 0.5 * least(
          100,
          coalesce(quiz_score, 0)::numeric / nullif(quiz_score_max, 0) * 100
        )
      )::int
    )
  ) as progress_percent,
  coalesce(updated_at, started_at) as updated_at
from parsed;

grant select on public.progress_compat to authenticated;

-- Lookups for the admin-enroll Edge Function (service role only).
create or replace function public.admin_user_ids_by_email(p_emails text[])
returns table (email text, user_id uuid)
language sql
security definer
set search_path = public, auth
as $$
  select lower(u.email)::text, u.id
  from auth.users u
  where lower(u.email) = any (select lower(e) from unnest(p_emails) as e);
$$;

create or replace function public.admin_course_learners(p_course_id text)
returns table (email text, enrolled_at timestamptz, progress_percent int, last_activity timestamptz)
language sql
security definer
set search_path = public, auth
as $$
  select
    lower(u.email)::text,
    e.enrolled_at,
    coalesce(p.progress_percent, 0)::int,
    p.updated_at
  from public.enrollments e
  join auth.users u on u.id = e.user_id
  left join public.progress_compat p on p.user_id = e.user_id and p.course_id = e.course_id
  where e.course_id = p_course_id
  order by lower(u.email);
$$;

revoke all on function public.admin_user_ids_by_email(text[]) from public, anon, authenticated;
revoke all on function public.admin_course_learners(text) from public, anon, authenticated;
grant execute on function public.admin_user_ids_by_email(text[]) to service_role;
grant execute on function public.admin_course_learners(text) to service_role;
