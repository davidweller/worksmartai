# SCORM Supabase Shim Sign-off

Date: 2026-05-08 (original) · Updated 2026-06-01 (Hostinger + Edge Functions)

## Scope

Operational sign-off for the SCORM persistence rollout:

- SCORM player in `src/pages/academy/view/[courseId].astro`
- Supabase schema in `supabase/migrations/20260507153000_scorm_academy.sql`
- Admin-only enrollments: `supabase/migrations/20260601120000_enrollments_admin_only.sql`
- **Persistence:** Supabase Edge Functions (replaces Astro `/api/scorm/*` on static Hostinger)

| Function   | Deploy name        |
| ---------- | ------------------ |
| Initialize | `scorm-initialize` |
| Commit     | `scorm-commit`     |
| Finish     | `scorm-finish`     |

Client: `src/lib/scorm/api.ts` → `{SUPABASE_URL}/functions/v1/scorm-{name}` with `Authorization: Bearer <access_token>`.

## Test Summary (2026-05-08 dev)

### Build and static checks

- `npm run build`: PASS
- `npm run check:eslint`: PASS (SCORM package JS)

### Supabase schema and security

Verified on linked remote database:

- Objects: `enrollments`, `scorm_sessions`, `quiz_responses`, `progress_compat`
- RLS enabled on all three tables
- Policies: `enrollments_select_own`, `sessions_all_via_enrollment`, `quiz_all_via_session`
- **After 2026-06-01 migration:** `enrollments_insert_own` and `enrollments_update_own` removed (admin provisioning only)

### SCORM runtime (historical — Astro API dev)

- simplify-scorm loaded via ordered inline script tags
- `?scorm_debug=1` logs SCORM events
- Session resume, commit, finish lifecycle: PASS in dev

### Scenario classification

**Scenario B:** progress primarily in `cmi.suspend_data`; `quiz_responses` often empty for W1.

---

## Post-Hostinger smoke test (required after deploy)

### Deploy status (2026-06-01)

- `supabase db push`: remote database up to date (includes `20260601120000_enrollments_admin_only.sql`)
- Edge Functions deployed to project `qgizwdyeqartoavllsol`: `scorm-initialize`, `scorm-commit`, `scorm-finish`
- `npm run build`: PASS
- Unauthenticated `POST scorm-initialize`: returns `401` (expected)

Prerequisites for production browser test:

1. `supabase db push` (includes `20260601120000_enrollments_admin_only.sql`)
2. Deploy all three `scorm-*` Edge Functions
3. Build site with `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`
4. Upload full `dist/` to Hostinger
5. Test user in Supabase Auth + enrollment:

```sql
insert into public.enrollments (user_id, course_id)
values ('<uuid>', 'ai-foundations');
```

### Checklist

| Step                                 | Expected                                                |
| ------------------------------------ | ------------------------------------------------------- |
| Login `/academy/login/`              | Redirect to dashboard                                   |
| Open `/academy/view/ai-foundations/` | `POST .../functions/v1/scorm-initialize` → 200          |
| Interact with course                 | `POST .../scorm-commit` → 200                           |
| Refresh mid-course                   | Resume same session                                     |
| Finish / complete                    | `POST .../scorm-finish` → 200; dashboard % updates      |
| User without enrollment              | `scorm-initialize` → 403; UI shows not-enrolled message |

### Function URLs (replace project ref)

- `https://<project-ref>.supabase.co/functions/v1/scorm-initialize`
- `https://<project-ref>.supabase.co/functions/v1/scorm-commit`
- `https://<project-ref>.supabase.co/functions/v1/scorm-finish`

Legacy Astro path `https://worksmart-ai.co.uk/api/scorm/initialize/` is **not used** on Hostinger static hosting (expected 404).

---

## Governance

**Immediate cutover** to Edge Functions + `progress_compat` (no dual-write to legacy `progress` table).

---

## Notes

- Production uses **Hostinger static** + **Supabase Edge Functions**, not Netlify hybrid APIs.
- No `src/middleware.ts` required; JWT passed from browser session.
