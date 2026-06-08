import 'jsr:@supabase/functions-js/edge-runtime.d.ts';

import {
  assertSessionOwned,
  corsHeaders,
  createAuthedClient,
  extractScalarsFromCmi,
  getAuthenticatedUser,
  json,
  parseInteractionsFromCmi,
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

  let payload: { sessionId?: string; cmi?: Record<string, unknown> };
  try {
    payload = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const sessionId = typeof payload.sessionId === 'string' ? payload.sessionId.trim() : '';
  if (!sessionId) {
    return json({ error: 'sessionId is required' }, 400);
  }

  const cmi =
    payload.cmi && typeof payload.cmi === 'object' && !Array.isArray(payload.cmi)
      ? (payload.cmi as Record<string, unknown>)
      : null;

  if (!cmi) {
    return json({ error: 'cmi is required' }, 400);
  }

  const owned = await assertSessionOwned(supabase, sessionId, user.id);
  if (!owned) {
    return json({ error: 'Session not found' }, 404);
  }

  const scalars = extractScalarsFromCmi(cmi);

  const { error: updateError } = await supabase
    .from('scorm_sessions')
    .update({
      raw_cmi: cmi,
      suspend_data: scalars.suspend_data,
      lesson_status: scalars.lesson_status,
      lesson_location: scalars.lesson_location,
      session_time: scalars.session_time,
      score: scalars.score,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (updateError) {
    return json({ error: updateError.message }, 500);
  }

  const interactions = parseInteractionsFromCmi(cmi);
  if (interactions.length > 0) {
    await supabase.from('quiz_responses').delete().eq('session_id', sessionId);

    const rows = interactions.map((row) => ({
      session_id: sessionId,
      interaction_id: row.interaction_id,
      interaction_type: row.interaction_type,
      learner_response: row.learner_response,
      correct_response: row.correct_response,
      result: row.result,
      latency: row.latency,
    }));

    const { error: quizError } = await supabase.from('quiz_responses').insert(rows);
    if (quizError) {
      return json({ error: quizError.message }, 500);
    }
  }

  return json({ ok: true });
});
