import type { APIRoute } from 'astro';

import { createAcademyServerClient } from '~/lib/supabase/server';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let sessionId = '';
  try {
    const body = (await request.json()) as { sessionId?: string };
    sessionId = String(body.sessionId || '').trim();
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

  const finishedAt = new Date().toISOString();

  const { error: updateError } = await supabase
    .from('scorm_sessions')
    .update({
      is_complete: true,
      finished_at: finishedAt,
      updated_at: finishedAt,
    })
    .eq('id', sessionId);

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
