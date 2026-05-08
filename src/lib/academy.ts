import { createAcademyBrowserClient } from '~/lib/supabase/browser';
import { hasSupabaseEnv } from '~/lib/supabase/env';

export const hasAcademySupabaseConfig = hasSupabaseEnv;

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
