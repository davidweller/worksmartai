import { createBrowserClient } from '@supabase/ssr';

import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseEnv } from './env';

export function createAcademyBrowserClient() {
  if (!hasSupabaseEnv) {
    throw new Error('Supabase URL and anon key must be set for the Academy client.');
  }
  return createBrowserClient(getSupabaseUrl(), getSupabaseAnonKey());
}
