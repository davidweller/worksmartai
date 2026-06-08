-- Admin-provisioned enrollments only: learners cannot self-insert or update rows.
--
-- Admin enrolls a learner (SQL Editor / service role):
--   insert into public.enrollments (user_id, course_id)
--   values ('<auth-user-uuid>', 'ai-foundations');

drop policy if exists "enrollments_insert_own" on public.enrollments;

drop policy if exists "enrollments_update_own" on public.enrollments;
