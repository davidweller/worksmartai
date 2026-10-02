import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createServiceClient, isAdmin } from '../_shared/admin.ts';
import { corsHeaders, createAuthedClient, getAuthenticatedUser, json } from '../_shared/scorm.ts';

// Admin-only enrolment for the Academy admin page.
// Actions: enroll (emails[], invite_missing), unenroll (email), learners (list a course).
// Invites are generated here and sent through Resend, so they don't hit Supabase's mail limit.

const MAX_EMAILS = 500;
const EMAIL_PATTERN = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;
const SITE_URL = (Deno.env.get('ACADEMY_SITE_URL') ?? 'https://worksmart-ai.co.uk').replace(/\/$/, '');

type ResultStatus = 'enrolled' | 'already_enrolled' | 'invited' | 'skipped' | 'invalid' | 'error';
type EmailResult = { email: string; status: ResultStatus; detail?: string };

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

async function sendInviteEmail(email: string, courseTitle: string, link: string): Promise<string | null> {
  const key = Deno.env.get('RESEND_API_KEY');
  if (!key) return 'RESEND_API_KEY is not set';

  const title = escapeHtml(courseTitle);
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'WorkSmart-AI <hello@worksmart-ai.co.uk>',
      to: [email],
      subject: `You've been enrolled on ${courseTitle}`,
      html: `<p>Hello,</p>
<p>You've been enrolled on <strong>${title}</strong> in the WorkSmart-AI Academy.</p>
<p>Set your password to get started:</p>
<p><a href="${link}">Set your password</a></p>
<p>Once it's set, sign in at <a href="${SITE_URL}/academy/login/">${SITE_URL}/academy/login/</a>.</p>
<p>The link works once and expires in 24 hours. If it has expired, use "Forgot password" on the sign-in page.</p>
<p>WorkSmart-AI</p>`,
    }),
  });

  return res.ok ? null : `Email failed (${res.status})`;
}

function normaliseEmails(input: unknown): { valid: string[]; invalid: string[] } {
  const raw = Array.isArray(input) ? input : [];
  const seen = new Set<string>();
  const valid: string[] = [];
  const invalid: string[] = [];

  for (const item of raw) {
    const email = String(item ?? '')
      .trim()
      .toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    (EMAIL_PATTERN.test(email) ? valid : invalid).push(email);
  }

  return { valid, invalid };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const authed = createAuthedClient(req);
  const user = authed ? await getAuthenticatedUser(authed) : null;
  if (!user) {
    return json({ error: 'Unauthorized' }, 401);
  }
  if (!isAdmin(user)) {
    return json({ error: 'Admins only' }, 403);
  }

  const admin = createServiceClient();
  if (!admin) {
    return json({ error: 'Server is missing its service configuration' }, 500);
  }

  let payload: { action?: string; course_id?: string; emails?: unknown; email?: string; invite_missing?: boolean };
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const courseId = typeof payload.course_id === 'string' ? payload.course_id.trim() : '';
  const { data: course, error: courseError } = await admin
    .from('courses')
    .select('id, title')
    .eq('id', courseId)
    .maybeSingle();
  if (courseError) {
    return json({ error: courseError.message }, 500);
  }
  if (!course) {
    return json({ error: 'Course not found' }, 404);
  }

  const action = payload.action ?? 'enroll';

  if (action === 'learners') {
    const { data, error } = await admin.rpc('admin_course_learners', { p_course_id: course.id });
    if (error) return json({ error: error.message }, 500);
    return json({ learners: data ?? [] });
  }

  if (action === 'unenroll') {
    const email = String(payload.email ?? '')
      .trim()
      .toLowerCase();
    const { data: found, error: findError } = await admin.rpc('admin_user_ids_by_email', { p_emails: [email] });
    if (findError) return json({ error: findError.message }, 500);
    const userId = (found as { user_id: string }[] | null)?.[0]?.user_id;
    if (!userId) return json({ error: 'No account with that email' }, 404);

    const { error } = await admin.from('enrollments').delete().eq('user_id', userId).eq('course_id', course.id);
    if (error) return json({ error: error.message }, 500);
    return json({ ok: true });
  }

  if (action !== 'enroll') {
    return json({ error: 'Unknown action' }, 400);
  }

  const { valid, invalid } = normaliseEmails(payload.emails);
  if (valid.length + invalid.length > MAX_EMAILS) {
    return json({ error: `Send at most ${MAX_EMAILS} emails at a time` }, 400);
  }
  const inviteMissing = payload.invite_missing === true;

  const results: EmailResult[] = invalid.map((email) => ({ email, status: 'invalid' }));

  const { data: found, error: findError } = await admin.rpc('admin_user_ids_by_email', { p_emails: valid });
  if (findError) return json({ error: findError.message }, 500);
  const userIdByEmail = new Map(
    (found as { email: string; user_id: string }[] | null)?.map((r) => [r.email, r.user_id])
  );

  const { data: existing, error: existingError } = await admin
    .from('enrollments')
    .select('user_id')
    .eq('course_id', course.id);
  if (existingError) return json({ error: existingError.message }, 500);
  const enrolledUserIds = new Set((existing ?? []).map((row) => String(row.user_id)));

  for (const email of valid) {
    let userId = userIdByEmail.get(email);
    let invited = false;

    if (!userId) {
      if (!inviteMissing) {
        results.push({ email, status: 'skipped', detail: 'No account' });
        continue;
      }

      const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
        type: 'invite',
        email,
      });
      const tokenHash = linkData?.properties?.hashed_token;
      if (linkError || !linkData?.user || !tokenHash) {
        results.push({ email, status: 'error', detail: linkError?.message ?? 'Could not create account' });
        continue;
      }

      userId = linkData.user.id;
      const link = `${SITE_URL}/academy/reset-password/?token_hash=${encodeURIComponent(tokenHash)}&type=invite`;
      const sendError = await sendInviteEmail(email, course.title, link);
      if (sendError) {
        results.push({ email, status: 'error', detail: `Account created but ${sendError}` });
        // Still enrol, so a resend from "Forgot password" gets them straight in.
      }
      invited = !sendError;
    }

    if (enrolledUserIds.has(userId)) {
      results.push({ email, status: 'already_enrolled' });
      continue;
    }

    const { error: insertError } = await admin
      .from('enrollments')
      .upsert({ user_id: userId, course_id: course.id }, { onConflict: 'user_id,course_id', ignoreDuplicates: true });
    if (insertError) {
      results.push({ email, status: 'error', detail: insertError.message });
      continue;
    }

    enrolledUserIds.add(userId);
    if (invited) {
      results.push({ email, status: 'invited' });
    } else if (!results.some((r) => r.email === email)) {
      results.push({ email, status: 'enrolled' });
    }
  }

  return json({ results });
});
