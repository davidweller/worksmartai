-- Admin helper: enroll a learner by email (no UUID copy-paste).
-- Run from Supabase SQL Editor (service role / postgres), not from the browser client.

create or replace function public.enroll_user_by_email(
  p_email text,
  p_course_id text
)
returns uuid
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
  v_enrollment_id uuid;
  v_email text := lower(trim(p_email));
  v_course_id text := trim(p_course_id);
begin
  if v_email = '' then
    raise exception 'Email is required';
  end if;

  if v_course_id = '' then
    raise exception 'course_id is required';
  end if;

  select id into v_user_id
  from auth.users
  where lower(email) = v_email;

  if v_user_id is null then
    raise exception 'No auth user found for email: %', p_email;
  end if;

  insert into public.enrollments (user_id, course_id)
  values (v_user_id, v_course_id)
  on conflict (user_id, course_id) do nothing
  returning id into v_enrollment_id;

  if v_enrollment_id is null then
    select e.id into v_enrollment_id
    from public.enrollments e
    where e.user_id = v_user_id
      and e.course_id = v_course_id;
  end if;

  return v_enrollment_id;
end;
$$;

comment on function public.enroll_user_by_email(text, text) is
  'Admin-only: create enrollment for an auth user by email. Idempotent.';

revoke all on function public.enroll_user_by_email(text, text) from public;
revoke all on function public.enroll_user_by_email(text, text) from authenticated;
revoke all on function public.enroll_user_by_email(text, text) from anon;
grant execute on function public.enroll_user_by_email(text, text) to service_role;
