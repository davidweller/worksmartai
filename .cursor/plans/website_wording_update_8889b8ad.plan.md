---
name: Website Wording Update
overview: Update homepage and services-page marketing copy to the May 2026 wording, including new positioning text, revised trust/experience section, selected HEPI quote, and CTA/button updates.
todos:
  - id: update-homepage-copy
    content: Revise homepage hero and supporting sections with May 2026 wording and selected quote + dual CTAs
    status: pending
  - id: update-services-headline
    content: Change Services landing page headline from Practical to Specialist
    status: pending
  - id: update-staff-training-blocks
    content: Adjust staff-training meta labels and inclusion list to finalized wording
    status: pending
  - id: validate-pages
    content: Verify rendering, CTA links, and lints for modified files
    status: pending
isProject: false
---

# May 2026 Website Copy Refresh Plan

## Scope

Apply approved wording updates across:

- Home page hero and supporting sections
- Home page trust/experience section replacing ROI-led messaging
- Services landing page main headline
- Staff training page inclusion list and course-meta headings

## Confirmed content decisions

- Chane first quote on homepage to:
  - "Students see AI skills as essential, but institutional support lags behind..."
- Include **both CTAs** ("View Our Services" and "Contact Us") in the relevant homepage sections.
- On Services page, change **"Practical" → "Specialist"** only.
- Keep existing staff-audience wording (do **not** replace with "research staff" wording).

## File-by-file implementation

- Update homepage copy in [E:/code/worksmart/src/pages/index.astro](E:/code/worksmart/src/pages/index.astro):
  - Replace current "AI skills training" section headline/body with new specialist HE-focused wording.
  - Add/adjust services list bullets:
    - Staff training (face-to-face + online)
    - Student "AI skills for the workplace" sessions
    - 1:1 senior/middle manager consultancy
    - Bespoke academic coaching
    - Data-driven ROI underpinning line
  - Ensure CTA area includes both buttons: `View Our Services` (`/services/`) and `Contact Us` (`/contact-us/`).
  - Replace the current ROI-led section copy ("Struggling to see ROI...") with the new "We talk from experience" positioning paragraph.
  - Insert the selected HEPI/Kortext quote (option 2) with attribution.
- Update services landing page headline in [E:/code/worksmart/src/pages/services.astro](E:/code/worksmart/src/pages/services.astro):
  - Change `Practical AI expertise for higher education` to `Specialist AI expertise for higher education`.
- Update staff training details in [E:/code/worksmart/src/pages/services/staff-training.astro](E:/code/worksmart/src/pages/services/staff-training.astro):
  - Keep current audience phrasing as-is (per your choice).
  - Update top meta headings/content where relevant to reflect:
    - `3hrs` / `F2F / Online` / `Asynchronous`
    - Labels: `Workshop duration`, `Delivery method`, `Online supporting course`
  - Update `What's included` list to this finalized set:
    - Pre-training needs assessment
    - Role-specific workshop content
    - Hands-on practical exercises
    - Prompt writing and AI workflow guides
    - Post-training resource pack
    - 30-day follow-up Q&A support
    - Progress and impact reporting
  - Keep `monthly AI cafe` out of scope unless you confirm final wording/placement later.

## QA and content validation

- Verify updated pages render correctly with no layout regressions:
  - `/`
  - `/services/`
  - `/services/staff-training/`
- Validate CTA destinations:
  - `View Our Services` -> `/services/`
  - `Contact Us` -> `/contact-us/`
- Run lint checks for edited files and resolve any introduced issues.

## Notes

- Existing ROI calculator component can remain in place unless you want it removed in a follow-up pass.
- If needed, we can do a second pass specifically for tone harmonization and mobile line-break polish after this copy update lands.
