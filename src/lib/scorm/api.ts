import { getSupabaseAnonKey, getSupabaseUrl } from '~/lib/supabase/env';

export type ScormFunctionName = 'initialize' | 'commit' | 'finish';

export function getScormFunctionUrl(name: ScormFunctionName): string {
  const base = getSupabaseUrl().replace(/\/$/, '');
  return `${base}/functions/v1/scorm-${name}`;
}

const NOT_ENROLLED_MESSAGE = 'You are not enrolled in this course. Please contact your administrator.';

export async function postScorm<T>(
  name: ScormFunctionName,
  body: Record<string, unknown>,
  accessToken: string
): Promise<T> {
  const res = await fetch(getScormFunctionUrl(name), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      apikey: getSupabaseAnonKey(),
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const serverError =
      data && typeof data === 'object' && data !== null && 'error' in data
        ? String((data as { error: unknown }).error)
        : text || res.statusText;

    if (res.status === 403) {
      throw new Error(NOT_ENROLLED_MESSAGE);
    }

    throw new Error(serverError || `Request failed (${res.status})`);
  }

  return data as T;
}
