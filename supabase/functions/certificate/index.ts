import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import { createServiceClient, isAdmin } from '../_shared/admin.ts';
import {
  corsHeaders,
  createAuthedClient,
  evaluateCompletion,
  getAuthenticatedUser,
  json,
  type CompletionResult,
} from '../_shared/scorm.ts';
import { renderCertificate, type CertificateRow } from './render.ts';

// Course completion certificates.
// Actions: status (courseId), claim (courseId, name), pdf (certificateId).
// The PDF is stamped on request from the template on the site, so nothing is stored but the row.

const SITE_URL = (Deno.env.get('ACADEMY_SITE_URL') ?? 'https://worksmart-ai.co.uk').replace(/\/$/, '');

const CERT_COLUMNS =
  'id, cert_code, user_id, course_id, learner_name, course_title, course_details, score_percent, issued_at';

function normaliseName(input: unknown): string | null {
  const name = String(input ?? '')
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();
  if (name.length < 2 || name.length > 80) return null;
  if (/[\p{Cc}\p{Cf}]/u.test(name)) return null;
  return name;
}

// The saved file is called after the course and the learner. PDF viewers name a download after
// the link's last segment, so the storage key carries the name too. Storage keys accept ASCII only:
// accents are folded (Zoë -> Zoe) and anything else dropped. The download keeps the full name.
const CERT_BUCKET = 'certificates';
const LINK_SECONDS = 60 * 60;

function certificateFileName(cert: CertificateRow): string {
  const name = `${cert.course_title} - ${cert.learner_name}`
    .replace(/[\\/:*?"<>|]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return `${name || 'Certificate'}.pdf`;
}

function storageKeyName(fileName: string): string {
  const ascii = fileName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 ._()&,'+-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return ascii && ascii !== '.pdf' ? ascii : 'Certificate.pdf';
}

// Static assets are cached for the life of the worker.
const assetCache = new Map<string, Promise<Uint8Array | null>>();
function fetchAsset(path: string): Promise<Uint8Array | null> {
  let cached = assetCache.get(path);
  if (!cached) {
    cached = fetch(`${SITE_URL}${path}`)
      .then(async (res) => (res.ok ? new Uint8Array(await res.arrayBuffer()) : null))
      .catch(() => null);
    assetCache.set(path, cached);
    // A missing template is retried on the next request rather than remembered.
    cached.then((bytes) => {
      if (!bytes) assetCache.delete(path);
    });
  }
  return cached;
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

  const admin = createServiceClient();
  if (!admin) {
    return json({ error: 'Server is missing its service configuration' }, 500);
  }

  let payload: { action?: string; courseId?: string; certificateId?: string; name?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  // pdf returns the file itself (kept for pages loaded before link existed);
  // link stores it under its readable name and returns short-lived view and download links.
  if (payload.action === 'pdf' || payload.action === 'link') {
    const certificateId = String(payload.certificateId ?? '').trim();
    const { data: cert, error } = await admin
      .from('certificates')
      .select(CERT_COLUMNS)
      .eq('id', certificateId)
      .maybeSingle();
    if (error) return json({ error: error.message }, 500);
    if (!cert || (cert.user_id !== user.id && !isAdmin(user))) {
      return json({ error: 'Certificate not found' }, 404);
    }

    try {
      const bytes = await renderCertificate(cert as CertificateRow, fetchAsset);
      if (payload.action === 'pdf') {
        return new Response(new Blob([bytes as BlobPart]), {
          headers: { ...corsHeaders, 'Content-Type': 'application/pdf', 'Cache-Control': 'private, no-store' },
        });
      }

      // Re-rendered on every request, so design changes reach certificates already issued.
      const fileName = certificateFileName(cert as CertificateRow);
      const path = `${cert.id}/${storageKeyName(fileName)}`;
      const bucket = admin.storage.from(CERT_BUCKET);
      const { error: uploadError } = await bucket.upload(path, bytes, {
        contentType: 'application/pdf',
        cacheControl: '0',
        upsert: true,
      });
      if (uploadError) throw new Error(uploadError.message);

      const [view, download] = await Promise.all([
        bucket.createSignedUrl(path, LINK_SECONDS),
        bucket.createSignedUrl(path, LINK_SECONDS, { download: fileName }),
      ]);
      if (view.error || download.error || !view.data || !download.data) {
        throw new Error(view.error?.message ?? download.error?.message ?? 'Could not link the certificate');
      }
      return json({ viewUrl: view.data.signedUrl, downloadUrl: download.data.signedUrl, fileName });
    } catch (caught) {
      return json({ error: caught instanceof Error ? caught.message : 'Could not build the certificate' }, 500);
    }
  }

  if (payload.action !== 'status' && payload.action !== 'claim') {
    return json({ error: 'Unknown action' }, 400);
  }

  const courseId = String(payload.courseId ?? '').trim();
  const { data: enrolment, error: enrolmentError } = await admin
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .maybeSingle();
  if (enrolmentError) return json({ error: enrolmentError.message }, 500);
  if (!enrolment) return json({ error: 'Not enrolled' }, 403);

  const { data: existing, error: existingError } = await admin
    .from('certificates')
    .select(CERT_COLUMNS)
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .maybeSingle();
  if (existingError) return json({ error: existingError.message }, 500);

  const { data: course, error: courseError } = await admin
    .from('courses')
    .select('id, title, page_count, pass_mark, certificate_details')
    .eq('id', courseId)
    .maybeSingle();
  if (courseError) return json({ error: courseError.message }, 500);
  if (!course) return json({ error: 'Course not found' }, 404);

  // Take the best attempt, so reopening a course in a new session never loses a pass.
  const { data: sessions, error: sessionsError } = await admin
    .from('scorm_sessions')
    .select('suspend_data, raw_cmi, started_at')
    .eq('enrollment_id', enrolment.id)
    .order('started_at', { ascending: false });
  if (sessionsError) return json({ error: sessionsError.message }, 500);

  const results = (sessions ?? []).map((s) => evaluateCompletion(s, course));
  const completion: CompletionResult = results.find((r) => r.eligible) ?? results[0] ?? evaluateCompletion({}, course);

  if (payload.action === 'status') {
    return json({ ...completion, certificate: existing ?? null });
  }

  if (existing) {
    return json({ ...completion, certificate: existing });
  }

  if (!completion.eligible) {
    return json({ error: 'Course not yet complete', ...completion }, 409);
  }

  const learnerName = normaliseName(payload.name);
  if (!learnerName) {
    return json({ error: 'Enter your name as you want it on the certificate (2 to 80 characters).' }, 400);
  }

  // cert_code comes from the database sequence (WS-0001, WS-0002, ...).
  let inserted: CertificateRow | null = null;
  const { data, error } = await admin
    .from('certificates')
    .insert({
      user_id: user.id,
      course_id: course.id,
      learner_name: learnerName,
      course_title: course.title,
      course_details: course.certificate_details ?? '',
      score_percent: completion.scorePercent,
    })
    .select(CERT_COLUMNS)
    .single();
  if (!error) {
    inserted = data as CertificateRow;
  } else if (error.code === '23505') {
    // A double click: the other request issued it first, so return that one.
    const { data: raced } = await admin
      .from('certificates')
      .select(CERT_COLUMNS)
      .eq('user_id', user.id)
      .eq('course_id', course.id)
      .maybeSingle();
    inserted = (raced as CertificateRow | null) ?? null;
  } else {
    return json({ error: error.message }, 500);
  }
  if (!inserted) return json({ error: 'Could not issue the certificate. Please try again.' }, 500);

  // Lets the header show the learner's name instead of email initials.
  if (user.user_metadata?.full_name !== learnerName) {
    await admin.auth.admin.updateUserById(user.id, {
      user_metadata: { ...user.user_metadata, full_name: learnerName },
    });
  }

  return json({ ...completion, certificate: inserted });
});
