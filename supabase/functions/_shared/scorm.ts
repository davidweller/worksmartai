import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function createAuthedClient(req: Request): SupabaseClient | null {
  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anonKey) return null;

  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) return null;

  return createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
}

export async function getAuthenticatedUser(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export type QuizRow = {
  interaction_id: string | null;
  interaction_type: string | null;
  learner_response: string | null;
  correct_response: string | null;
  result: string | null;
  latency: string | null;
};

export function extractScalarsFromCmi(cmi: Record<string, unknown>) {
  const core = typeof cmi.core === 'object' && cmi.core !== null ? (cmi.core as Record<string, unknown>) : {};
  const scoreObj = typeof core.score === 'object' && core.score !== null ? (core.score as Record<string, unknown>) : {};
  const raw = scoreObj.raw;
  const score = raw !== undefined && raw !== null && String(raw).trim() !== '' ? Number(raw) : null;

  return {
    suspend_data: String(cmi.suspend_data ?? ''),
    lesson_status: String(core.lesson_status ?? ''),
    lesson_location: String(core.lesson_location ?? ''),
    session_time: String(core.session_time ?? ''),
    score: Number.isFinite(score) ? score : null,
  };
}

function flattenCorrectResponse(block: Record<string, unknown>): string {
  const cr = block.correct_responses;
  if (cr && typeof cr === 'object' && cr !== null) {
    const o = cr as Record<string, unknown>;
    const child = o['0'];
    if (child && typeof child === 'object' && child !== null) {
      const c0 = child as Record<string, unknown>;
      if (c0.pattern !== undefined) return String(c0.pattern);
      if (c0.text !== undefined) return String(c0.text);
    }
  }
  if (block.correct_response !== undefined) return String(block.correct_response);
  return '';
}

export function parseInteractionsFromCmi(cmi: Record<string, unknown>): QuizRow[] {
  const interactions = cmi.interactions;
  if (interactions == null) return [];

  const rows: QuizRow[] = [];

  const pushInteraction = (idx: string, block: Record<string, unknown>) => {
    const id = block.id ?? block.interaction_id;
    const correctFlat = flattenCorrectResponse(block);

    rows.push({
      interaction_id: id != null && String(id) !== '' ? String(id) : idx,
      interaction_type: block.type != null ? String(block.type) : null,
      learner_response:
        block.student_response !== undefined
          ? String(block.student_response)
          : block.learner_response !== undefined
            ? String(block.learner_response)
            : '',
      correct_response: correctFlat || null,
      result: block.result !== undefined ? String(block.result) : null,
      latency: block.latency !== undefined ? String(block.latency) : null,
    });
  };

  if (Array.isArray(interactions)) {
    interactions.forEach((item, i) => {
      if (item && typeof item === 'object') pushInteraction(String(i), item as Record<string, unknown>);
    });
    return rows;
  }

  if (typeof interactions === 'object') {
    for (const [key, val] of Object.entries(interactions)) {
      if (val && typeof val === 'object') pushInteraction(key, val as Record<string, unknown>);
    }
  }

  return rows;
}

export function defaultResumeCmi(): Record<string, unknown> {
  return {
    suspend_data: '',
    core: {
      lesson_status: 'not attempted',
      lesson_location: '',
      session_time: '',
      score: { raw: '', min: '', max: '' },
    },
  };
}

export function resumePayloadFromStored(raw: unknown): Record<string, unknown> {
  if (raw && typeof raw === 'object' && Object.keys(raw as object).length > 0) {
    return raw as Record<string, unknown>;
  }
  return defaultResumeCmi();
}

export async function assertSessionOwned(
  supabase: SupabaseClient,
  sessionId: string,
  userId: string
): Promise<boolean> {
  const { data: sessionRow } = await supabase
    .from('scorm_sessions')
    .select('enrollment_id')
    .eq('id', sessionId)
    .maybeSingle();

  const enrollmentId = sessionRow?.enrollment_id;
  if (!enrollmentId) return false;

  const { data: enr } = await supabase.from('enrollments').select('user_id').eq('id', enrollmentId).maybeSingle();

  return enr?.user_id === userId;
}
