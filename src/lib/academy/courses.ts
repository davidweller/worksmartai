import { academySupabase } from '~/lib/academy';

// Courses live in public.courses (added by admins at /academy/admin/), not in code.

export type AcademyCourse = {
  id: string;
  title: string;
  code: string;
  summary: string;
  level: string;
  group_name: string;
  module: string;
  content_path: string;
  page_titles: string[];
  page_count: number;
  is_live: boolean;
  sort_order: number;
};

const COURSE_COLUMNS =
  'id, title, code, summary, level, group_name, module, content_path, page_titles, page_count, is_live, sort_order';

export const COURSE_GROUPS = ['All-Staff Workshops', 'Academic Workshops', 'Professional Services Workshops'];

export function coursePlayerHref(courseId: string): string {
  return `/academy/view/?id=${encodeURIComponent(courseId)}`;
}

export async function fetchCourse(courseId: string): Promise<AcademyCourse | null> {
  if (!academySupabase || !courseId) return null;
  const { data, error } = await academySupabase.from('courses').select(COURSE_COLUMNS).eq('id', courseId).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as AcademyCourse | null) ?? null;
}

export async function fetchCourses(): Promise<AcademyCourse[]> {
  if (!academySupabase) return [];
  const { data, error } = await academySupabase
    .from('courses')
    .select(COURSE_COLUMNS)
    .order('sort_order')
    .order('title');
  if (error) throw new Error(error.message);
  return (data as AcademyCourse[] | null) ?? [];
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`);
}
