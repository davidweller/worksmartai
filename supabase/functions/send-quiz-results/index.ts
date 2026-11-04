// Deploy with: supabase functions deploy send-quiz-results
// Set secret with: supabase secrets set RESEND_API_KEY=your_key_here
// Optional: supabase secrets set FOUNDERS_NOTIFICATION_EMAIL=hello@worksmart-ai.co.uk

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createServiceClient } from '../_shared/admin.ts';
import {
  PATTERNS,
  QUESTIONS,
  QUIZ_VERSION,
  isAnswered,
  profileLine,
  renderReportEmail,
  scoreQuiz,
  type QuizAnswers,
} from '../_shared/hierarchy-quiz.ts';
import { corsHeaders, json } from '../_shared/scorm.ts';

// Stores an AI Use Hierarchy Quiz submission, emails the visitor their full report and tells the team.
// The result is recomputed here from the raw answers, so the email always follows the scoring rules.

const DEFAULT_NOTIFY_EMAIL = 'hello@worksmart-ai.co.uk';
const FROM = 'WorkSmart-AI <hello@worksmart-ai.co.uk>';
const SITE_URL = 'https://worksmart-ai.co.uk';
/** Submissions allowed per email address per hour. */
const HOURLY_LIMIT = 5;

function isPlausibleEmail(s: string): boolean {
  if (s.length < 3 || s.length > 320) return false;
  const at = s.indexOf('@');
  if (at <= 0 || at === s.length - 1) return false;
  const rest = s.slice(at + 1);
  return rest.includes('.') && !rest.startsWith('.') && !rest.endsWith('.');
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

async function sendEmail(key: string, to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], reply_to: DEFAULT_NOTIFY_EMAIL, subject, html }),
  });
  return res.ok ? null : (await res.text()) || 'Resend request failed';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ ok: false, error: 'Method not allowed' }, 405);
  }

  const key = Deno.env.get('RESEND_API_KEY');
  if (!key || !String(key).trim()) {
    return json({ ok: false, error: 'Email service not configured' }, 503);
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400);
  }

  const name = str(payload.name, 200);
  const email = str(payload.email, 320).toLowerCase();
  const source = str(payload.source, 200) || 'hierarchy-quiz';
  const marketingOptIn = payload.marketingOptIn === true;
  const answers = (payload.answers && typeof payload.answers === 'object' ? payload.answers : {}) as QuizAnswers;

  if (!name) return json({ ok: false, error: 'Name is required' }, 400);
  if (!email || !isPlausibleEmail(email)) return json({ ok: false, error: 'A valid email is required' }, 400);
  if (!QUESTIONS.every((q) => isAnswered(q, answers))) {
    return json({ ok: false, error: 'The quiz is not complete' }, 400);
  }

  const result = scoreQuiz(answers);
  const db = createServiceClient();

  if (db) {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await db
      .from('hierarchy_quiz_results')
      .select('id', { count: 'exact', head: true })
      .eq('email', email)
      .gte('created_at', since);
    if ((count ?? 0) >= HOURLY_LIMIT) {
      return json({ ok: false, error: 'Too many submissions. Please try again later.' }, 429);
    }

    const { error: resultError } = await db.from('hierarchy_quiz_results').insert({
      email,
      name,
      role: str(answers.role, 50) || null,
      approved_tool: str(answers.approvedTool, 50) || null,
      capability: result.levels.capability,
      confidence: result.levels.confidence,
      compliance: result.levels.compliance,
      patterns: result.patterns,
      answers,
      marketing_opt_in: marketingOptIn,
      source,
      quiz_version: QUIZ_VERSION,
    });
    if (resultError) console.error('[send-quiz-results] result insert failed', resultError);

    const { error: leadError } = await db.from('leads').insert({
      name,
      email,
      source: 'hierarchy-quiz',
      marketing_opt_in: marketingOptIn,
    });
    if (leadError) console.error('[send-quiz-results] lead insert failed', leadError);
  } else {
    console.error('[send-quiz-results] service client unavailable; submission not stored');
  }

  const sendError = await sendEmail(
    key,
    email,
    `Your AI profile: ${profileLine(result.levels)}`,
    // renderReportEmail escapes the name itself.
    renderReportEmail(name, result, SITE_URL)
  );
  if (sendError) {
    return json({ ok: false, error: sendError }, 502);
  }

  // The visitor has their report; a failed notification is logged, not returned.
  const notifyTo = Deno.env.get('FOUNDERS_NOTIFICATION_EMAIL')?.trim() || DEFAULT_NOTIFY_EMAIL;
  const row = (label: string, value: string) =>
    `<tr><td style="padding:4px 12px 4px 0;color:#64748b;">${label}</td><td style="padding:4px 0;">${escapeHtml(value)}</td></tr>`;
  const notifyHtml = [
    `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body style="font-family:system-ui,sans-serif;font-size:15px;color:#0f172a;">`,
    `<p>New AI Use Hierarchy Quiz submission.</p><table>`,
    row('Name', name),
    row('Email', email),
    row('Role', answers.role ?? ''),
    row('Approved tool', answers.approvedTool ?? ''),
    row('Profile', profileLine(result.levels)),
    row('Patterns', result.patterns.map((p) => PATTERNS[p].headline).join('; ')),
    row('Marketing opt-in', marketingOptIn ? 'Yes' : 'No'),
    row('Source', source),
    `</table></body></html>`,
  ].join('');
  const notifyError = await sendEmail(key, notifyTo, `Quiz: ${name}, ${profileLine(result.levels)}`, notifyHtml);
  if (notifyError) console.error('[send-quiz-results] notification failed', notifyError);

  return json({ ok: true, levels: result.levels });
});
