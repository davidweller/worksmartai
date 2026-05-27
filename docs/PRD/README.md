# WorkSmart-AI Website — Product Requirements Document

| Field                  | Value                                                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Product**            | WorkSmart-AI marketing site + Academy learning platform                                                                                                               |
| **Primary URL**        | https://worksmart-ai.co.uk                                                                                                                                            |
| **Codebase**           | Fork/customisation of **[AstroWind](https://github.com/arthelokyo/astrowind)** (Astro 5 + Tailwind) — see `vendor/integration`, upstream README retained in repo root |
| **Production hosting** | **Hostinger** (static `dist/` upload) — **not Netlify**                                                                                                               |
| **Document version**   | 1.1                                                                                                                                                                   |
| **Last updated**       | 2026-05-21                                                                                                                                                            |
| **Status**             | Living document — reflects codebase as of May 2026                                                                                                                    |

---

## 1. Executive summary

WorkSmart-AI is a UK higher-education specialist offering AI skills training, consultancy, and asynchronous learning. This product is the **public website and authenticated Academy** that:

1. **Generates qualified leads** through content, a free guide, health-check positioning, and booking flows.
2. **Explains and sells** training and consultancy services to HE decision-makers.
3. **Delivers SCORM-based online courses** to enrolled staff, with progress tracked in Supabase.

The site is optimised for SEO, accessibility (WCAG 2.1 AA target), and static hosting on **Hostinger**. **Supabase** backs auth, leads, email, and Academy data.

### Platform foundation

This repository is **not a greenfield site**. It started from the open-source **AstroWind** template and was customised for WorkSmart-AI (branding, HE copy, Academy, Supabase, lead magnet, ROI calculator, etc.). Inherited pieces include:

- AstroWind layout/widgets, blog routing, `src/config.yaml` pattern, and `vendor/integration`
- Root `README.md` still documents upstream AstroWind (demo URL updated to worksmart-ai.co.uk)

When changing structure or dependencies, assume **template conventions** unless there is a deliberate fork from AstroWind patterns.

### Production vs development hosting

| Environment          | Host          | Notes                                                                                                                                                                    |
| -------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Production**       | **Hostinger** | Manual deploy: upload entire `dist/` after `npm run build` (see root `README.md`). No Netlify CDN or Functions in prod.                                                  |
| **Not used in prod** | Netlify       | `netlify.toml` and `@astrojs/netlify` exist in the repo for optional/alternate deploys or future hybrid API hosting — **live traffic is not served from Netlify today**. |

---

## 2. Vision and goals

### Vision

Help UK higher education institutions adopt AI with **confidence, compliance, and measurable productivity** — not generic corporate training.

### Business goals

| Goal                  | How the product supports it                                                |
| --------------------- | -------------------------------------------------------------------------- |
| Lead generation       | Guide download, contact/booking CTAs, news/blog SEO                        |
| Trust and credibility | Founder story, HE-specific copy, HEPI/third-party quotes, case-style news  |
| Service discovery     | Structured services pages aligned to buyer roles                           |
| Delivery support      | Academy for async extension courses after workshops                        |
| ROI narrative         | ROI calculator + “how it works” explainer for finance/governance audiences |

### Product goals (digital)

- Fast, indexable static pages with clear conversion paths.
- Reliable lead capture (DB + optional welcome email).
- Secure per-user course progress when Academy + Supabase are enabled.
- Legal/compliance pages required for procurement and accessibility.

### Non-goals (out of scope for this repo)

- CRM pipeline automation (beyond storing leads).
- Payment / e-commerce checkout.
- Full LMS (discussions, cohort admin, certificates) — Academy is course-player focused.
- Student-facing university SSO (generic email/password auth only today).

---

## 3. Target users and personas

| Persona                           | Role                                | Primary needs on site                                 |
| --------------------------------- | ----------------------------------- | ----------------------------------------------------- |
| **L&D / HR lead**                 | Designs staff capability programmes | Staff training detail, outcomes, ROI proof, book call |
| **Senior leader**                 | Strategy, budget, governance        | Senior consulting, health check, guide, news          |
| **Professional services manager** | Day-to-day team productivity        | Staff training, calculator, workflow guide            |
| **Academic**                      | Teaching/research AI use            | Academic coaching, academic workshop track            |
| **Student experience lead**       | Student AI literacy                 | Student training page                                 |
| **Conference / CPD organiser**    | External speaking                   | Talks & workshops                                     |
| **Enrolled learner**              | Post-workshop async course          | Login → Academy dashboard → SCORM player              |

**Geography:** Primarily UK HE; FE/other education on request (see Health Check copy).

---

## 4. Problem statement

Universities need **role-specific, anxiety-aware, policy-aligned** AI training. Generic vendors and one-off workshops fail to change behaviour or satisfy governance. WorkSmart-AI must:

- Communicate **HE-specific** expertise before the first conversation.
- Offer **low-friction** entry points (free guide, health check, calculator).
- Support **ongoing learning** via Academy after live workshops.
- Demonstrate **measurable impact** to satisfy L&D and finance stakeholders.

---

## 5. Product scope

### In scope

| Area               | Description                                                                            |
| ------------------ | -------------------------------------------------------------------------------------- |
| **Marketing site** | Home, services hub + 5 service lines, about, news/blog, contact                        |
| **Lead magnet**    | Higher Education Guide landing page + PDF + Supabase lead row + welcome email          |
| **Conversion**     | Book-a-call (Outlook), contact form (Microsoft Forms), health-check landing            |
| **Tools**          | ROI calculator, calculator methodology page                                            |
| **Academy**        | Login, dashboard, SCORM 1.2 player (simplify-scorm), course catalogue UI               |
| **Compliance**     | Privacy, cookies, terms, accessibility, EDI, modern slavery, sustainability, insurance |
| **Content ops**    | Markdown/MDX blog posts under `src/data/post/`; Decap CMS config in `public/decapcms/` |

### Out of scope / deferred

- Hybrid Astro deploy with live `/api/scorm/*` on current Hostinger static production (see §10).
- Courses beyond first live module (`ai-foundations` / `ai_fundamentals` content on disk).
- `@supabase/ssr` middleware and server-side auth uplift (planned, not complete).
- Google Analytics (ID null in `src/config.yaml`).

---

## 6. Information architecture

### Primary navigation (`src/navigation.ts`)

- Home `/`
- Services `/services/`
- About Us `/about-us/`
- News `/news/`
- Contact Us `/contact-us/`
- Login `/login/` (header CTA)

### Services (buyer journeys)

| Route                          | Offering                                             |
| ------------------------------ | ---------------------------------------------------- |
| `/services/staff-training/`    | Workshop catalogue (W1–W7+), async extension courses |
| `/services/student-training/`  | Student workshop programmes                          |
| `/services/senior-consulting/` | Leadership & manager consulting                      |
| `/services/academic-coaching/` | 1:1 / small group academic coaching                  |
| `/services/talks-workshops/`   | Conferences, keynotes, bespoke events                |

### Resources & conversion

| Route                        | Purpose                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| `/higher-education-guide/`   | Lead magnet — PDF “From Chatbot to Workflows”                                          |
| `/health-check/`             | Free 45-minute AI Health Check positioning                                             |
| `/roi-calculator/`           | Interactive savings / productivity estimator                                           |
| `/how-our-calculator-works/` | Methodology transparency                                                               |
| `/book-a-call/`              | Outlook booking embed (also linked from `BOOK_A_CALL_URL` on `new.worksmart-ai.co.uk`) |
| `/contact-us/`               | Booking CTA + Microsoft Forms iframe                                                   |

### Academy (authenticated, noindex)

| Route                       | Purpose                                                                    |
| --------------------------- | -------------------------------------------------------------------------- |
| `/login/`                   | Supabase email/password sign-in                                            |
| `/academy/login/`           | Academy-specific login entry                                               |
| `/academy/dashboard/`       | Course list, progress %, links to player                                   |
| `/academy/view/{courseId}/` | SCORM player (`ai-foundations`, `copilot-workflows`, `agentic-automation`) |

### News / blog

- Listing: `/news/` (config: `pathname: 'news'` in `src/config.yaml`)
- Posts: `/{slug}/` from `src/data/post/*.md`
- Categories/tags supported by AstroWind blog routes

### Legal & policies

Privacy, cookie policy, terms of service, accessibility statement, modern slavery, EDI, sustainability, insurance — all linked from footer.

### Redirects (`astro.config.ts`)

- `/training/` → `/services/`
- `/calculator/` → `/roi-calculator/`
- `/home-v3/` → `/` (legacy staging URL)

### Staging / alternate homepages (excluded from sitemap)

- `/home-v2/`, `/homepage-original/`, `/homepage-pre-v3/` — design/copy experiments and archives; production home is `/` (`src/pages/index.astro`, promoted from home-v3).

---

## 7. Functional requirements

### 7.1 Marketing and content

| ID  | Requirement                                                                                                                                                     | Priority |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| M-1 | Home page presents HE-specific positioning, service cards, AI Partnership, personas, capability timeline, ROI calculator, health-check CTAs, and guide download | P0       |
| M-2 | Services hub routes to all five service detail pages with consistent tone (“specialist” HE focus)                                                               | P0       |
| M-3 | About page shows founders (Katie Steen, David Weller), video, credibility narrative                                                                             | P0       |
| M-4 | News posts render with SEO metadata, reading time, related posts (4), RSS                                                                                       | P1       |
| M-5 | All public pages expose canonical URLs, Open Graph, and site metadata from `src/config.yaml`                                                                    | P0       |
| M-6 | Sitemap excludes 404, academy routes, and alternate home experiments                                                                                            | P1       |

### 7.2 Lead magnet (Higher Education Guide)

| ID  | Requirement                                                                                                               | Priority |
| --- | ------------------------------------------------------------------------------------------------------------------------- | -------- |
| L-1 | Visitor submits name + work email on `/higher-education-guide/`                                                           | P0       |
| L-2 | On success: insert row into Supabase `public.leads` (anon INSERT via RLS policy in `supabase/rls-leads-for-web-form.sql`) | P0       |
| L-3 | Instant browser download of PDF (`/WorkSmart-AI From Chatbot to Workflows.pdf`, cache-busted query param)                 | P0       |
| L-4 | Invoke Edge Function `send-guide-email` for welcome email with same canonical download URL (`GUIDE_DOWNLOAD_URL` secret)  | P0       |
| L-5 | Clear error UX if RLS blocks insert (on-page hint to run SQL policy)                                                      | P1       |

### 7.3 Contact and booking

| ID  | Requirement                                                                    | Priority |
| --- | ------------------------------------------------------------------------------ | -------- |
| C-1 | Contact page embeds Microsoft Forms for async messages                         | P0       |
| C-2 | “Book a Call” uses external Outlook booking URL (`src/config/booking.ts`)      | P0       |
| C-3 | Health Check page explains offer, FAQs, and booking — no hard sell positioning | P1       |

### 7.4 ROI calculator

| ID  | Requirement                                                                 | Priority |
| --- | --------------------------------------------------------------------------- | -------- |
| R-1 | Client-side calculator widget (`ROICalculator.astro`) on `/roi-calculator/` | P1       |
| R-2 | Supporting explanatory page at `/how-our-calculator-works/`                 | P2       |

### 7.5 Academy authentication

| ID  | Requirement                                                                                                                                           | Priority |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| A-1 | Users sign in with email/password via Supabase Auth (`/login/`, `/academy/login/`)                                                                    | P0       |
| A-2 | Unauthenticated access to dashboard/player redirects to login                                                                                         | P0       |
| A-3 | `hasAcademySupabaseConfig` in `src/lib/academy.ts` gates client features — **currently `false` on Hostinger static deploy** to avoid broken API calls | P0       |

### 7.6 Academy dashboard

| ID  | Requirement                                                                              | Priority |
| --- | ---------------------------------------------------------------------------------------- | -------- |
| A-4 | Dashboard lists staff workshop courses (W1–W7) with live vs coming-soon state            | P0       |
| A-5 | Only `ai-foundations` is live (`isLive: true`, `courseId: 'ai-foundations'`)             | P0       |
| A-6 | Progress % read from Supabase (`progress_compat` view or legacy path per implementation) | P0       |
| A-7 | robots: noindex on dashboard and player                                                  | P1       |

### 7.7 SCORM course player

| ID   | Requirement                                                                                                       | Priority |
| ---- | ----------------------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------- | --- |
| A-8  | Player loads SCORM 1.2 package from `public/courses/{contentPath}/` (e.g. `ai_fundamentals` for `ai-foundations`) | P0       |
| A-9  | Parent page exposes full SCORM API via **simplify-scorm** (not a minimal shim)                                    | P0       |
| A-10 | Course navigation: module title, page list, mobile menu, iframe player                                            | P0       |
| A-11 | When Supabase + API enabled: `POST /api/scorm/initialize                                                          | commit   | finish`persist sessions,`raw_cmi`, quiz rows | P0  |
| A-12 | Resume via `loadFromJSON` from initialize response                                                                | P0       |
| A-13 | RLS: users only read/write own enrollments/sessions (`supabase/migrations/20260507153000_scorm_academy.sql`)      | P0       |

**Course ID map (player):**

| `courseId` (URL)     | Content folder       |
| -------------------- | -------------------- |
| `ai-foundations`     | `ai_fundamentals`    |
| `copilot-workflows`  | `copilot-workflows`  |
| `agentic-automation` | `agentic-automation` |

### 7.8 Staff training catalogue (marketing)

Workshop codes W1–W7+ documented on `/services/staff-training/` and mirrored on Academy dashboard — alignment between sales content and learning paths is required when launching new modules.

---

## 8. User journeys

### Journey 1: Anonymous visitor → lead

1. Lands on guide from campaign or `/higher-education-guide/`.
2. Submits name + email.
3. Receives instant PDF download + confirmation email.
4. Optional: books call via footer CTA → Outlook.

**Success:** Row in `leads`; email delivered; PDF opened.

### Journey 2: Decision-maker → consultation

1. Reads `/services/` or `/health-check/`.
2. Uses ROI calculator for internal business case.
3. Books via `BOOK_A_CALL_URL` or `/contact-us/`.

**Success:** Scheduled call (external booking system).

### Journey 3: Enrolled staff → course progress

1. Signs in at `/login/`.
2. Opens `/academy/dashboard/`, sees W1 live.
3. Launches `/academy/view/ai-foundations/`.
4. SCORM content runs; progress commits to Supabase when backend enabled.

**Success:** Measurable progress % on dashboard; session complete in `scorm_sessions`.

---

## 9. Technical architecture

### Stack

| Layer                    | Technology                                                                                                                       |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Site template**        | **AstroWind** (customised fork) — components under `src/components/widgets/`, layouts, blog utilities                            |
| Framework                | Astro 5, static `output: 'static'` (`astro.config.ts`)                                                                           |
| Styling                  | Tailwind CSS 3, custom brand tokens (`CustomStyles.astro`, `tailwind.css`)                                                       |
| Content                  | Markdown/MDX blog, YAML site config (`src/config.yaml`)                                                                          |
| Auth & DB                | Supabase (Auth, Postgres, RLS, Edge Functions)                                                                                   |
| SCORM runtime            | simplify-scorm (GitHub dependency)                                                                                               |
| **Hosting (production)** | **Hostinger only** — full `dist/` upload including `_astro/` hashed assets                                                       |
| Netlify (repo only)      | `netlify.toml`, `@astrojs/netlify` in `package.json` — **not production**; kept for optional CI/preview or future SSR/API deploy |

### Build and deploy (production path)

1. Local or CI: `npm run build` — Prettier, Astro build, `scripts/verify-dist.mjs` (fails if HTML references missing CSS).
2. **Hostinger:** Upload the **entire** `dist/` folder to the site root (File Manager or FTP). Do not deploy HTML without `_astro/`.
3. **Do not** point production DNS or customer traffic at Netlify unless hosting strategy explicitly changes.

**Critical:** Partial deploys (HTML only) break styles when Astro changes hashed asset names under `_astro/`.

### Supabase objects

| Object                           | Purpose                                    |
| -------------------------------- | ------------------------------------------ |
| `public.leads`                   | Web form lead capture                      |
| `public.enrollments`             | User ↔ course                             |
| `public.scorm_sessions`          | CMI state, scores, suspend_data, `raw_cmi` |
| `public.quiz_responses`          | Interaction-level quiz data                |
| `public.progress_compat`         | View for dashboard backward compatibility  |
| Edge Function `send-guide-email` | Guide welcome email                        |

### Environment variables

| Variable                               | Used for                |
| -------------------------------------- | ----------------------- |
| `PUBLIC_SUPABASE_URL`                  | Browser Supabase client |
| `PUBLIC_SUPABASE_ANON_KEY`             | Browser Supabase client |
| `GUIDE_DOWNLOAD_URL` (function secret) | Email PDF link override |

### Deployment constraint (important)

Production on **Hostinger is static-only** (AstroWind-style static export). Astro `output: 'static'` means **`/api/scorm/*` routes do not run** on the live Hostinger site (`SCORM_SIGNOFF.md` notes 404 on `worksmart-ai.co.uk/api/scorm/initialize/`). Academy client code guards with `hasAcademySupabaseConfig = false` to avoid calling APIs that cannot exist on static hosting.

Enabling SCORM APIs would require either a **host that runs Astro server/hybrid routes** (e.g. a future Netlify deploy — not current prod) or a separate API backend; **today’s production path does not include that**.

**Implication:** PRD requirement A-11 is **implemented in player code** but **not operational on Hostinger production** until hosting and `hasAcademySupabaseConfig` strategy change.

---

## 10. Non-functional requirements

| Category            | Requirement                                                                                                         |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Performance**     | Astro static pages; image optimization via Astro assets; lighthouse-oriented AstroWind baseline                     |
| **SEO**             | Per-page metadata, sitemap, trailing slashes, canonical URLs                                                        |
| **Accessibility**   | Target WCAG 2.1 AA (stated on accessibility page); semantic layouts, form labels                                    |
| **Security**        | Supabase RLS on all Academy tables; no anon access to sessions; leads INSERT only for anon                          |
| **Privacy**         | GDPR-aligned privacy policy; cookie policy; UK HE context                                                           |
| **Reliability**     | `verify:dist` post-build; long-cache headers for `/_astro/*` where host supports it (Hostinger / `public/_headers`) |
| **Maintainability** | AstroWind `vendor/integration`; ESLint + Prettier + `astro check`; upstream template upgrades need manual merge     |

---

## 11. Success metrics (recommended)

| Metric                     | Source                                        |
| -------------------------- | --------------------------------------------- |
| Guide conversion rate      | `leads` where `source` = guide page           |
| Email delivery rate        | Edge function logs / Resend (if used)         |
| Booked calls               | Outlook booking (external)                    |
| Organic traffic / rankings | GA (when enabled), Search Console             |
| Academy MAU                | Supabase auth users with session activity     |
| Course completion rate     | `scorm_sessions.is_complete` / enrollments    |
| Calculator engagement      | Event tracking (not yet in codebase — future) |

---

## 12. Roadmap and known gaps

Derived from `.cursor/plans/` and `SCORM_SIGNOFF.md`:

| Item                                            | Status                                                    | Notes                                                      |
| ----------------------------------------------- | --------------------------------------------------------- | ---------------------------------------------------------- |
| SCORM Supabase schema + RLS                     | Done                                                      | Migration in repo                                          |
| SCORM API routes (`src/pages/api/scorm/`)       | Referenced in player; **not present in `src/pages/api/`** | Needs restore + non–Hostinger-static host if APIs required |
| Astro hybrid + Netlify adapter                  | In deps; **not prod**; config still `static`              | Optional future path — prod remains Hostinger              |
| Auth SSR uplift (`@supabase/ssr`, middleware)   | Pending                                                   | Plan: before relying on API auth                           |
| Enable `hasAcademySupabaseConfig` in production | Blocked                                                   | Hostinger static; no live `/api/scorm`                     |
| Launch W2–W7 Academy modules                    | Planned                                                   | Dashboard placeholders exist                               |
| May 2026 website copy refresh                   | Complete (home-v3 promoted to `/`)                        | Site-wide nav/footer aligned with new homepage             |
| Google Analytics ID                             | Not configured                                            | `config.yaml` null                                         |
| Post-deploy SCORM smoke test                    | Outstanding                                               | login → course → commit → finish                           |

---

## 13. Content and brand principles

Copy and design should consistently reflect:

- **Specialist** higher education focus (not generic “practical AI”).
- **People-first**, anxiety-aware change management.
- **Measurable ROI** and data-driven reviews (calculator, 5-step process).
- **Responsible use** — GDPR, institutional policy, role-specific data sensitivity.
- **Founder-led credibility** — ex–Digital Skills Lead, University of Exeter scale (7,500 staff narrative).

Reference positioning on live home page (`src/pages/index.astro`): AI capability for higher education, health-check lead magnet, service cards, AI Partnership, personas, maturity timeline, ROI calculator, and founder credibility.

---

## 14. Acceptance criteria (release checklist)

### Public site release

- [ ] `npm run build` passes including `verify:dist`
- [ ] Full `dist/` deployed to Hostinger
- [ ] Homepage stylesheet returns HTTP 200 under `/_astro/`
- [ ] Key routes manually checked: `/`, `/services/`, `/higher-education-guide/`, `/contact-us/`
- [ ] Lead form inserts to `leads` and triggers welcome email in production Supabase project

### Academy release (when Supabase + API enabled)

- [ ] `hasAcademySupabaseConfig` set true only when API routes live
- [ ] Login → dashboard → `ai-foundations` player completes without console errors
- [ ] Progress visible on dashboard after session
- [ ] RLS verified: user A cannot read user B sessions

---

## 15. Related documents

| Document                   | Location                                                 |
| -------------------------- | -------------------------------------------------------- |
| SCORM operational sign-off | `SCORM_SIGNOFF.md`                                       |
| SCORM implementation plan  | `.cursor/plans/scorm_supabase_shim_bd5c854c.plan.md`     |
| Lead magnet rollout plan   | `.cursor/plans/lead_magnet_fix_rollout_dd8a46db.plan.md` |
| Website copy refresh plan  | `.cursor/plans/website_wording_update_8889b8ad.plan.md`  |
| Site configuration         | `src/config.yaml`                                        |
| Leads RLS SQL              | `supabase/rls-leads-for-web-form.sql`                    |
| Academy schema             | `supabase/migrations/20260507153000_scorm_academy.sql`   |

---

## 16. Open questions

1. **Academy APIs on static prod:** Stay Hostinger-only, add a separate API host, or migrate prod to Netlify/hybrid (Netlify is in repo but **not used for prod today**)?
2. **Course authoring:** SCORMcraft export workflow and who owns content updates for W2–W7?
3. **Analytics:** Which GA4 property and consent banner behaviour?
4. **Enrollment provisioning:** Manual Supabase user creation vs self-serve vs institution bulk invite?
5. **Booking consolidation:** `new.worksmart-ai.co.uk/book-a-call` vs `/book-a-call/` on main domain — intentional split?

---

## Document history

| Version | Date       | Author | Changes                                                                         |
| ------- | ---------- | ------ | ------------------------------------------------------------------------------- |
| 1.0     | 2026-05-21 | —      | Initial PRD from codebase audit                                                 |
| 1.1     | 2026-05-21 | —      | Clarify AstroWind template foundation; Hostinger prod, Netlify not used in prod |
