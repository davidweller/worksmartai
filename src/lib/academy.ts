import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.PUBLIC_SUPABASE_URL ?? import.meta.env.SUPABASE_URL ?? '').trim();
const supabaseAnonKey = (import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? import.meta.env.SUPABASE_ANON_KEY ?? '').trim();

export const hasAcademySupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

export const academySupabase = hasAcademySupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function requireAuth(redirectTo = '/academy/login/') {
  if (!academySupabase) return null;

  const { data, error } = await academySupabase.auth.getSession();
  if (error || !data.session?.user) {
    window.location.replace(redirectTo);
    return null;
  }

  return { session: data.session, user: data.session.user };
}
