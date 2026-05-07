---
name: Lead magnet fix rollout
overview: Update and align lead magnet PDF/link and welcome email copy across frontend and Supabase function, then verify end-to-end with deployment and smoke tests.
todos:
  - id: choose-canonical-pdf-url
    content: Choose canonical (prefer versioned) PDF URL/filename and apply consistently.
    status: completed
  - id: update-frontend-download-path
    content: Update higher-education-guide page download path to new PDF.
    status: completed
  - id: update-function-email-copy
    content: Update send-guide-email template body text (and subject/CTA if required).
    status: completed
  - id: sync-supabase-secret
    content: Set GUIDE_DOWNLOAD_URL to canonical PDF URL.
    status: completed
  - id: deploy-and-verify
    content: Deploy site + function, run smoke test and full manual E2E verification.
    status: completed
isProject: false
---

# Lead Magnet + Email Update Plan

## Goal

Ensure the lead magnet flow serves the new PDF and updated email body consistently in both:

- instant browser download after form submit
- follow-up email from Supabase Edge Function

## Files to Update

- [E:/code/worksmart/src/pages/higher-education-guide.astro](E:/code/worksmart/src/pages/higher-education-guide.astro)
- [E:/code/worksmart/supabase/functions/send-guide-email/index.ts](E:/code/worksmart/supabase/functions/send-guide-email/index.ts)
- [E:/code/worksmart/public/WorkSmart-AI - From Chatbot to Workflows.pdf](E:/code/worksmart/public/WorkSmart-AI - From Chatbot to Workflows.pdf) (replace/rename as decided)

## Implementation Steps

1. Set a single canonical PDF URL/filename strategy

- Decide whether to keep filename or version it (recommended: versioned filename to avoid CDN/browser stale cache).
- Update frontend `guideDownloadPath` so `window.location.href` points to the new asset.
- Update function fallback `DEFAULT_DOWNLOAD_URL` to the same canonical URL.

2. Update email body content in the function

- Edit HTML copy in `send-guide-email` template to the final approved wording.
- Confirm subject line and CTA text/link reflect the new campaign intent.

3. Align runtime config override

- Re-set Supabase secret `GUIDE_DOWNLOAD_URL` to the canonical URL so runtime override matches code.
- Keep fallback in code identical to secret value to reduce drift risk.

4. Publish static asset + site

- Ensure new PDF is present in `public/` and included in built output.
- Build and deploy site so `/higher-education-guide/` contains updated `data-guide-pdf` and routes to the new file.

5. Deploy function

- Deploy `send-guide-email` to the linked Supabase project so latest template/copy is live.

## Test Plan

- Run function smoke test script:
  - `scripts/smoke-test-send-guide-email.ps1`
  - Expect `ok: true` response.
- Manual end-to-end test on `/higher-education-guide/`:
  - Submit lead form with test identity.
  - Verify browser redirects to the new PDF URL and file content is the new document.
  - Verify received email contains updated body text, correct subject, and button/fallback URL to the new PDF.
- Negative/observability checks:
  - Inspect browser console for lead insert or function call errors.
  - If old PDF still appears, validate via hard refresh/private window; if needed, switch to versioned filename and retest.

## Hardening (prevent recurrence)

- Add a short release checklist item: update all three together (frontend path, function template, Supabase secret).
- Optionally centralize PDF URL in one env variable consumed by both build and function deployment workflow.
