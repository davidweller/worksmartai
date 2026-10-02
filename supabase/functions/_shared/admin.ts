import { createClient, type SupabaseClient, type User } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

// Service-role client: bypasses RLS. Only use after assertAdmin has passed.
export function createServiceClient(): SupabaseClient | null {
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Admins carry app_metadata.role = 'admin', which only the service role can set.
export function isAdmin(user: User | null): boolean {
  return user?.app_metadata?.role === 'admin';
}
