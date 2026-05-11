/** Confirms the SCORM session belongs to the given user via enrollment. */
export async function assertScormSessionOwned(
  supabase: {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (
          column: string,
          value: string
        ) => {
          maybeSingle: <T extends Record<string, unknown>>() => Promise<{ data: T | null }>;
        };
      };
    };
  },
  sessionId: string,
  userId: string
): Promise<boolean> {
  const { data: sessionRow } = await supabase
    .from('scorm_sessions')
    .select('enrollment_id')
    .eq('id', sessionId)
    .maybeSingle<{ enrollment_id?: string }>();

  const enrollmentId = sessionRow?.enrollment_id;
  if (!enrollmentId) return false;

  const { data: enr } = await supabase
    .from('enrollments')
    .select('user_id')
    .eq('id', enrollmentId)
    .maybeSingle<{ user_id?: string }>();

  return enr?.user_id === userId;
}
