import type { APIRoute } from 'astro';

import { extractScalarsFromCmi, parseInteractionsFromCmi, type QuizRow } from '~/lib/scorm/parseCmi';
import { createAcademyServerClient } from '~/lib/supabase/server';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let sessionId = '';
  let cmi: Record<string, unknown> = {};
  try {
    const body = (await request.json()) as { sessionId?: string; cmi?: Record<string, unknown> };
    sessionId = String(body.sessionId || '').trim();
    cmi = body.cmi && typeof body.cmi === 'object' ? body.cmi : {};
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'sessionId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createAcademyServerClient(cookies);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data: sessionRow } = await supabase
    .from('scorm_sessions')
    .select('enrollment_id')
    .eq('id', sessionId)
    .maybeSingle();

  const enrollmentId =
    sessionRow && typeof sessionRow === 'object' && 'enrollment_id' in sessionRow
      ? String((sessionRow as { enrollment_id?: string }).enrollment_id || '')
      : '';

  let owned = false;
  if (enrollmentId) {
    const { data: enrollmentRow } = await supabase
      .from('enrollments')
      .select('user_id')
      .eq('id', enrollmentId)
      .maybeSingle();

    const ownerId =
      enrollmentRow && typeof enrollmentRow === 'object' && 'user_id' in enrollmentRow
        ? String((enrollmentRow as { user_id?: string }).user_id || '')
        : '';
    owned = ownerId === user.id;
  }

  if (!owned) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const scalars = extractScalarsFromCmi(cmi);
  const quizRows = parseInteractionsFromCmi(cmi);

  const { error: updateError } = await supabase
    .from('scorm_sessions')
    .update({
      raw_cmi: cmi as unknown as Record<string, never>,
      suspend_data: scalars.suspend_data || null,
      lesson_status: scalars.lesson_status || null,
      lesson_location: scalars.lesson_location || null,
      session_time: scalars.session_time || null,
      score: scalars.score,
      updated_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { error: delError } = await supabase.from('quiz_responses').delete().eq('session_id', sessionId);

  if (delError) {
    return new Response(JSON.stringify({ error: delError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (quizRows.length > 0) {
    const insertPayload = quizRows.map((r: QuizRow) => ({
      session_id: sessionId,
      interaction_id: r.interaction_id,
      interaction_type: r.interaction_type,
      learner_response: r.learner_response,
      correct_response: r.correct_response,
      result: r.result,
      latency: r.latency,
    }));

    const { error: insQuizError } = await supabase.from('quiz_responses').insert(insertPayload);

    if (insQuizError) {
      return new Response(JSON.stringify({ error: insQuizError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
