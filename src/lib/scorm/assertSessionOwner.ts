/** Confirms the SCORM session belongs to the given user via enrollment. */
export async function assertScormSessionOwned(
  supabase: {
    from: (table: string) => {
      select: (columns: string) => {
        eq: (
          column: string,
          value: string
        ) => {
          maybeSingle: () => Promise<{ data: Record<string, unknown> | null }>;
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
    .maybeSingle();

  if (!sessionRow?.enrollment_id) return false;

  const { data: enr } = await supabase
    .from('enrollments')
    .select('user_id')
    .eq('id', sessionRow.enrollment_id)
    .maybeSingle();

  return enr?.user_id === userId;
}
