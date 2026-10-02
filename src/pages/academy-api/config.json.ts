import { getSupabaseAnonKey, getSupabaseUrl } from '~/lib/supabase/env';

// Read by academy-api/upload-course.php to verify admin sessions. Both values are public.
export function GET() {
  return new Response(JSON.stringify({ supabaseUrl: getSupabaseUrl(), supabaseAnonKey: getSupabaseAnonKey() }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
