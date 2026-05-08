# SCORM Supabase Shim Sign-off

Date: 2026-05-08

## Scope

Operational sign-off for the SCORM API persistence rollout:

- SCORM player shim/runtime wiring in `src/pages/academy/view/[courseId].astro`
- Supabase schema/migration in `supabase/migrations/20260507153000_scorm_academy.sql`
- API routes:
  - `src/pages/api/scorm/initialize.ts`
  - `src/pages/api/scorm/commit.ts`
  - `src/pages/api/scorm/finish.ts`

## Test Summary

### Build and static checks

- `npm run build`: PASS
- `npm run check:astro`: known existing project-wide warnings/errors outside this scope
- `npm run check:eslint`: PASS after cleanup in `public/courses/ai_fundamentals/scorm-api.js`

### Supabase schema and security

Verified on linked remote database:

- Objects exist:
  - `public.enrollments`
  - `public.scorm_sessions`
  - `public.quiz_responses`
  - `public.progress_compat` (view)
- RLS enabled on all 3 tables
- Expected policies present:
  - `enrollments_select_own`
  - `enrollments_insert_own`
  - `enrollments_update_own`
  - `sessions_all_via_enrollment`
  - `quiz_all_via_session`

### SCORM runtime and API behavior

- simplify-scorm script load issue fixed by using inline classic script tags to preserve order.
- `?scorm_debug=1` shows active SCORM event logging.
- Runtime network evidence:
  - `POST /api/scorm/commit/` returns `200`
  - `POST /api/scorm/finish/` returns `200`

### Lifecycle behavior

- Refresh during in-progress attempt reuses latest incomplete session: PASS
- Finish marks current session complete (`is_complete=true`, `finished_at` set): PASS
- Relaunch after completion creates a new session row: PASS

## Scenario Classification

Observed behavior indicates **Scenario B** (quiz/progress state primarily in `cmi.suspend_data`):

- Example stored value:
  - `suspend_data = {"viewed":[0],"score":0,"answers":{}}`
- `raw_cmi` shows `core` and `suspend_data` populated
- `raw_cmi.interactions` not present in observed session data
- `quiz_responses` remains empty for observed run

## Governance Decision

Decision: **Immediate cutover** (no dual-write period).

Rationale:

- App is already operating on new SCORM API write path and `progress_compat` read path.
- Adding dual-write now would add complexity with low rollback value.

## Remaining Production Actions

1. Deploy latest build to production environment.
   - Current smoke test result for production endpoint:
     - `https://worksmart-ai.co.uk/api/scorm/initialize/` returns `404` (at test time)
2. Confirm Netlify environment variables and auth redirect/cookie settings in linked site config.
3. Run one post-deploy smoke test:
   - login -> open course -> commit observed -> finish observed.

## Notes

- Temporary dev-only finish button was added only for QA completion and removed immediately after verification.
- No plan file changes were made.
