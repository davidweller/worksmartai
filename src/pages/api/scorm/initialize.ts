import type { APIRoute } from 'astro';

import { createAcademyServerClient } from '~/lib/supabase/server';
import { defaultResumeCmi, resumePayloadFromStored } from '~/lib/scorm/parseCmi';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let courseId = '';
  try {
    const body = (await request.json()) as { courseId?: string };
    courseId = String(body.courseId || '').trim();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!courseId) {
    return new Response(JSON.stringify({ error: 'courseId is required' }), {
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

  const { data: enrollment, error: enrollmentError } = await supabase
    .from('enrollments')
    .upsert({ user_id: user.id, course_id: courseId }, { onConflict: 'user_id,course_id' })
    .select('id')
    .single();

  if (enrollmentError || !enrollment) {
    return new Response(JSON.stringify({ error: enrollmentError?.message ?? 'Enrollment failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data: latestList, error: latestError } = await supabase
    .from('scorm_sessions')
    .select('id, is_complete, raw_cmi, started_at')
    .eq('enrollment_id', enrollment.id)
    .order('started_at', { ascending: false })
    .limit(1);

  if (latestError) {
    return new Response(JSON.stringify({ error: latestError.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const latest = latestList?.[0];
  if (latest && !latest.is_complete) {
    return new Response(
      JSON.stringify({
        sessionId: latest.id,
        resume: resumePayloadFromStored(latest.raw_cmi),
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { data: created, error: insertError } = await supabase
    .from('scorm_sessions')
    .insert({
      enrollment_id: enrollment.id,
      raw_cmi: {},
    })
    .select('id')
    .single();

  if (insertError || !created) {
    return new Response(JSON.stringify({ error: insertError?.message ?? 'Could not create session' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(
    JSON.stringify({
      sessionId: created.id,
      resume: defaultResumeCmi(),
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
