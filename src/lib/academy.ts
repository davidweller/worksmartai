import { createAcademyBrowserClient } from '~/lib/supabase/browser';
import { hasSupabaseEnv } from '~/lib/supabase/env';

// Hostinger deployment is static-only, so academy server endpoints are unavailable.
// Keep this false to avoid client flows attempting /api/scorm calls that do not exist.
export const hasAcademySupabaseConfig = false && hasSupabaseEnv;

export const academySupabase = hasAcademySupabaseConfig ? createAcademyBrowserClient() : null;

export async function requireAuth(redirectTo = '/academy/login/') {
  if (!academySupabase) return null;

  const { data, error } = await academySupabase.auth.getSession();
  if (error || !data.session?.user) {
    window.location.replace(redirectTo);
    return null;
  }

  return { session: data.session, user: data.session.user };
}
