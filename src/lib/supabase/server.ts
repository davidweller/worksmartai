import { createServerClient } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

import { getSupabaseAnonKey, getSupabaseUrl, hasSupabaseEnv } from './env';

/** Server-side client (API routes, middleware) with cookie session. */
export function createAcademyServerClient(cookies: AstroCookies) {
  if (!hasSupabaseEnv) {
    throw new Error('Supabase URL and anon key must be set.');
  }

  const cookieStore = cookies as unknown as {
    getAll?: () => Array<{ name: string; value: string }>;
    get?: (name: string) => { value: string } | undefined;
    set?: (name: string, value: string, options?: Record<string, unknown>) => void;
    delete?: (name: string, options?: Record<string, unknown>) => void;
  };

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        if (typeof cookieStore.getAll === 'function') {
          return cookieStore.getAll();
        }
        return [];
      },
      setAll(cookiesToSet) {
        if (typeof cookieStore.set !== 'function') return;
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set?.(name, value, options);
        });
      },
      get(name) {
        return cookieStore.get?.(name)?.value;
      },
      set(name, value, options) {
        cookieStore.set?.(name, value, options);
      },
      remove(name, options) {
        cookieStore.delete?.(name, options);
      },
    },
  });
}
