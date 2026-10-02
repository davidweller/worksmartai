export const DEFAULT_QUIZ_SCORE_MAX = 10;

// Page totals come from public.courses (course.page_count); 7 is the old default.
export const DEFAULT_TOTAL_PAGES = 7;

export type HybridProgressInput = {
  totalPages: number;
  viewedPageIndices: number[];
  quizScore: number;
  quizScoreMax?: number | null;
  currentPageIndex?: number;
};

export function countViewedPages(viewedPageIndices: number[], totalPages: number, currentPageIndex?: number): number {
  const unique = new Set(
    viewedPageIndices.filter((index) => Number.isInteger(index) && index >= 0 && index < totalPages)
  );

  if (currentPageIndex != null && currentPageIndex >= 0 && currentPageIndex < totalPages) {
    unique.add(currentPageIndex);
  }

  return Math.min(totalPages, unique.size);
}

export function computeHybridProgressPercent(input: HybridProgressInput): number {
  const totalPages = input.totalPages > 0 ? input.totalPages : DEFAULT_TOTAL_PAGES;
  const pagesViewed = countViewedPages(input.viewedPageIndices, totalPages, input.currentPageIndex);
  const pagePercent = totalPages > 0 ? (pagesViewed / totalPages) * 100 : 0;

  const quizMax = input.quizScoreMax != null && input.quizScoreMax > 0 ? input.quizScoreMax : DEFAULT_QUIZ_SCORE_MAX;
  const quizScore = Math.max(0, input.quizScore);
  const quizPercent = Math.min(100, (quizScore / quizMax) * 100);

  const hybrid = 0.5 * pagePercent + 0.5 * quizPercent;
  return Math.max(0, Math.min(100, Math.round(hybrid)));
}

export function formatHybridProgressLabel(
  percent: number,
  pagesViewed: number,
  totalPages: number,
  quizScore: number,
  quizMax: number
): string {
  return `${percent}% complete (${pagesViewed}/${totalPages} pages, ${Math.round(quizScore)}/${quizMax} quiz)`;
}

export function parseSuspendData(suspendData: string): { viewed: number[]; score: number } {
  if (!suspendData || !suspendData.trim().startsWith('{')) {
    return { viewed: [], score: 0 };
  }

  try {
    const state = JSON.parse(suspendData) as { viewed?: unknown; score?: unknown };
    const viewed = Array.isArray(state.viewed)
      ? state.viewed.map((value) => Number(value)).filter((value) => Number.isInteger(value))
      : [];
    const score = typeof state.score === 'number' ? state.score : Number(state.score) || 0;
    return { viewed, score: Number.isFinite(score) ? score : 0 };
  } catch {
    return { viewed: [], score: 0 };
  }
}

export function readQuizScoreFromCmi(coreScore?: { raw?: string | number; max?: string | number }): {
  score: number;
  max: number;
} {
  const raw = coreScore?.raw;
  const max = coreScore?.max;
  const score = raw !== '' && raw != null ? Number(raw) : 0;
  const scoreMax = max !== '' && max != null && Number(max) > 0 ? Number(max) : DEFAULT_QUIZ_SCORE_MAX;

  return {
    score: Number.isFinite(score) ? score : 0,
    max: Number.isFinite(scoreMax) && scoreMax > 0 ? scoreMax : DEFAULT_QUIZ_SCORE_MAX,
  };
}
