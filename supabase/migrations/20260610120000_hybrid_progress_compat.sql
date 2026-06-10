-- Hybrid progress: 50% pages viewed (from suspend_data) + 50% normalized quiz score.

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
parsed as (
  select
    sr.user_id,
    sr.course_id,
    sr.suspend_data,
    sr.updated_at,
    sr.started_at,
    case sr.course_id
      when 'ai-foundations' then 7
      when 'copilot-workflows' then 7
      when 'agentic-automation' then 7
      else 7
    end as total_pages,
    case
      when nullif(trim(sr.suspend_data), '') is not null
        and left(trim(sr.suspend_data), 1) = '{'
      then coalesce(
        (
          select count(distinct value)::int
          from jsonb_array_elements_text((sr.suspend_data::jsonb) -> 'viewed') as value
          where value ~ '^\d+$'
            and value::int >= 0
            and value::int < case sr.course_id
              when 'ai-foundations' then 7
              when 'copilot-workflows' then 7
              when 'agentic-automation' then 7
              else 7
            end
        ),
        0
      )
      else 0
    end as pages_viewed,
    coalesce(
      sr.score,
      nullif(trim(sr.raw_cmi #>> '{core,score,raw}'), '')::numeric,
      0
    ) as quiz_score,
    coalesce(
      nullif(trim(sr.raw_cmi #>> '{core,score,max}'), '')::numeric,
      10
    ) as quiz_score_max
  from sessions_ranked sr
  where sr.rn_pick = 1
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
