-- Course completion certificates.
-- A certificate row is the completion record: it is written only by the certificate Edge Function
-- (service role) after it has checked every page was viewed and the quiz met courses.pass_mark.

alter table public.courses
  add column if not exists pass_mark int not null default 70 check (pass_mark between 0 and 100),
  -- The line under the course name on the certificate, e.g. '3 CPD hours | Foundation'.
  add column if not exists certificate_details text not null default '';

-- Certificate numbers run WS-0001, WS-0002, ... as on the Word design.
create sequence if not exists public.certificate_number_seq;

create or replace function public.next_certificate_code()
returns text
language sql
volatile
security definer
set search_path = public
as $$
  select 'WS-' || lpad(n::text, greatest(4, length(n::text)), '0')
  from nextval('public.certificate_number_seq') as n;
$$;

revoke all on function public.next_certificate_code() from public, anon, authenticated;
grant execute on function public.next_certificate_code() to service_role;

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  cert_code text not null unique default public.next_certificate_code(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id text not null references public.courses (id) on delete cascade,
  learner_name text not null check (char_length(learner_name) between 2 and 80),
  course_title text not null,
  course_details text not null default '',
  score_percent int not null,
  issued_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table public.certificates enable row level security;

drop policy if exists certificates_select_own on public.certificates;
create policy certificates_select_own on public.certificates
  for select to authenticated using (user_id = auth.uid());

drop policy if exists certificates_admin_select on public.certificates;
create policy certificates_admin_select on public.certificates
  for select to authenticated using (public.is_admin());

-- No insert/update/delete policies: learners can read their certificates, never write them.
grant select on public.certificates to authenticated;

-- Learners list now shows when each learner's certificate was issued.
drop function if exists public.admin_course_learners(text);
create function public.admin_course_learners(p_course_id text)
returns table (
  email text,
  enrolled_at timestamptz,
  progress_percent int,
  last_activity timestamptz,
  certificate_issued_at timestamptz
)
language sql
security definer
set search_path = public, auth
as $$
  select
    lower(u.email)::text,
    e.enrolled_at,
    coalesce(p.progress_percent, 0)::int,
    p.updated_at,
    c.issued_at
  from public.enrollments e
  join auth.users u on u.id = e.user_id
  left join public.progress_compat p on p.user_id = e.user_id and p.course_id = e.course_id
  left join public.certificates c on c.user_id = e.user_id and c.course_id = e.course_id
  where e.course_id = p_course_id
  order by lower(u.email);
$$;

revoke all on function public.admin_course_learners(text) from public, anon, authenticated;
grant execute on function public.admin_course_learners(text) to service_role;
