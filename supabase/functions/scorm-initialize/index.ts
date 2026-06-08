import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import {
  assertSessionOwned,
  corsHeaders,
  createAuthedClient,
  defaultResumeCmi,
  getAuthenticatedUser,
  json,
  resumePayloadFromStored,
} from '../_shared/scorm.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const supabase = createAuthedClient(req);
  if (!supabase) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const user = await getAuthenticatedUser(supabase);
  if (!user) {
    return json({ error: 'Unauthorized' }, 401);
  }

  let payload: { courseId?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const courseId = typeof payload.courseId === 'string' ? payload.courseId.trim() : '';
  if (!courseId) {
    return json({ error: 'courseId is required' }, 400);
  }

  const { data: enrollment, error: enrError } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .maybeSingle();

  if (enrError) {
    return json({ error: enrError.message }, 500);
  }

  if (!enrollment?.id) {
    return json({ error: 'You are not enrolled in this course' }, 403);
  }

  const { data: latestSessions, error: sessError } = await supabase
    .from('scorm_sessions')
    .select('id, is_complete, raw_cmi')
    .eq('enrollment_id', enrollment.id)
    .order('started_at', { ascending: false })
    .limit(1);

  if (sessError) {
    return json({ error: sessError.message }, 500);
  }

  const latest = latestSessions?.[0];

  if (latest && !latest.is_complete) {
    const owned = await assertSessionOwned(supabase, latest.id, user.id);
    if (!owned) {
      return json({ error: 'Session not found' }, 404);
    }
    return json({
      sessionId: latest.id,
      resume: resumePayloadFromStored(latest.raw_cmi),
    });
  }

  const { data: newSession, error: insertError } = await supabase
    .from('scorm_sessions')
    .insert({
      enrollment_id: enrollment.id,
      raw_cmi: defaultResumeCmi(),
    })
    .select('id')
    .single();

  if (insertError || !newSession?.id) {
    return json({ error: insertError?.message ?? 'Could not create session' }, 500);
  }

  return json({
    sessionId: newSession.id,
    resume: defaultResumeCmi(),
  });
});
