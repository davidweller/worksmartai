import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import {
  assertSessionOwned,
  corsHeaders,
  createAuthedClient,
  extractScalarsFromCmi,
  getAuthenticatedUser,
  json,
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

  let payload: { sessionId?: string };
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const sessionId = typeof payload.sessionId === 'string' ? payload.sessionId.trim() : '';
  if (!sessionId) {
    return json({ error: 'sessionId is required' }, 400);
  }

  const owned = await assertSessionOwned(supabase, sessionId, user.id);
  if (!owned) {
    return json({ error: 'Session not found' }, 404);
  }

  const { data: sessionRow, error: fetchError } = await supabase
    .from('scorm_sessions')
    .select('raw_cmi')
    .eq('id', sessionId)
    .maybeSingle();

  if (fetchError) {
    return json({ error: fetchError.message }, 500);
  }

  const rawCmi =
    sessionRow?.raw_cmi && typeof sessionRow.raw_cmi === 'object'
      ? (sessionRow.raw_cmi as Record<string, unknown>)
      : {};

  const scalars = extractScalarsFromCmi(rawCmi);
  const lessonStatus = scalars.lesson_status && scalars.lesson_status !== '' ? scalars.lesson_status : 'completed';

  const { error: updateError } = await supabase
    .from('scorm_sessions')
    .update({
      is_complete: true,
      finished_at: new Date().toISOString(),
      lesson_status: lessonStatus,
      score: scalars.score,
      suspend_data: scalars.suspend_data,
      lesson_location: scalars.lesson_location,
      session_time: scalars.session_time,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (updateError) {
    return json({ error: updateError.message }, 500);
  }

  return json({ ok: true });
});
