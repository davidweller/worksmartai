import { createAcademyBrowserClient } from '~/lib/supabase/browser';
import { hasSupabaseEnv } from '~/lib/supabase/env';

// Academy persistence uses Supabase Edge Functions (scorm-initialize/commit/finish), not Astro API routes.
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

function initialsFromEmail(email: string): string | null {
  const local = email.split('@')[0]?.trim();
  if (!local) return null;

  const segments = local.split(/[.\-_]+|\s+/).filter(Boolean);
  if (segments.length >= 2) {
    return (segments[0][0] + segments[1][0]).toUpperCase();
  }

  const single = segments[0] ?? local;
  if (single.length >= 2) return single.slice(0, 2).toUpperCase();
  if (single.length === 1) return single.toUpperCase();
  return null;
}

export function getAcademyUserLabel(user: { email?: string | null; user_metadata?: Record<string, unknown> }): string {
  const metadata = user.user_metadata ?? {};
  for (const key of ['full_name', 'name'] as const) {
    const value = metadata[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }

  if (user.email) {
    const initials = initialsFromEmail(user.email);
    if (initials) return initials;
  }

  return 'Account';
}

export const FORGOT_PASSWORD_PATH = '/academy/forgot-password/';

export function forgotPasswordHref(email = ''): string {
  return email ? `${FORGOT_PASSWORD_PATH}?email=${encodeURIComponent(email)}` : FORGOT_PASSWORD_PATH;
}

export function isInvalidCredentialsError(error: { code?: string; message?: string }): boolean {
  return error.code === 'invalid_credentials' || /invalid login credentials/i.test(error.message ?? '');
}

// Replaces the bare "Invalid login credentials" message with one that offers a reset.
export function showInvalidCredentials(el: HTMLElement, email: string) {
  const link = document.createElement('a');
  link.href = forgotPasswordHref(email);
  link.textContent = 'Reset your password';
  link.className = 'font-semibold underline hover:no-underline';
  el.replaceChildren("That email and password don't match. ", link, '.');
}
