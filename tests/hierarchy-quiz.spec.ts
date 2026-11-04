import { expect, test, type Page } from '@playwright/test';

import { HIERARCHY } from '../src/data/brand/hierarchy';
import {
  LEVELS,
  QUESTIONS,
  levelLabel,
  profileLine,
  renderReportEmail,
  scoreQuiz,
  type QuizAnswers,
} from '../supabase/functions/_shared/hierarchy-quiz';

// Every check answered correctly, and the profile questions answered.
const PASS: QuizAnswers = {
  role: 'academic',
  approvedTool: 'yes-known',
  k1: 'c',
  k2: ['a', 'b', 'c', 'd'],
  k3: { email: 'green', feedback: 'amber', appeal: 'red', disciplinary: 'red' },
  k4: 'a',
  k5: 'b',
};

const yes = (...ids: string[]) => Object.fromEntries(ids.map((id) => [id, 'yes'])) as QuizAnswers;

test.describe('hierarchy quiz scoring', () => {
  test('level names match the brand hierarchy', () => {
    expect(LEVELS.map(({ level, name }) => ({ level, name }))).toEqual(
      HIERARCHY.map(({ level, name }) => ({ level, name }))
    );
  });

  test('visitor copy has no course jargon', () => {
    const r = scoreQuiz({ ...PASS, ...yes('c1', 'c2', 'c3', 'f1', 'p1', 'p2', 'p3'), k4: 'b' });
    // Keys such as `pillar` are code, not copy, so only string values are checked.
    const values: string[] = [];
    JSON.stringify({ LEVELS, QUESTIONS }, (_k, v) => (typeof v === 'string' && values.push(v), v));
    const copy = values.join(' ') + renderReportEmail('Sam', r);
    expect(copy).not.toMatch(/R-C-T|Decision Matrix|pillar|shadow AI|guardrail|approval gate|Starting Level 1/i);
  });

  test('below Level 1 reads "Not yet at Level 1"', () => {
    expect(levelLabel(0)).toBe('Not yet at Level 1');
    expect(profileLine({ capability: 0, confidence: 0, compliance: 0 })).toBe('Not yet at Level 1 on all three');
    expect(profileLine({ capability: 3, confidence: 1, compliance: 0 })).toBe(
      'Capability 3, Confidence 1, Compliance not yet at Level 1'
    );
  });

  test('the email leads with the score and carries the diagram', () => {
    const html = renderReportEmail('Sam', scoreQuiz({ ...PASS, ...yes('c1', 'c2', 'c3', 'f1', 'p1') }));
    const score = html.indexOf('Capability 3, Confidence 1, Compliance 1');
    expect(score).toBeGreaterThan(-1);
    expect(score).toBeLessThan(html.indexOf('Hi Sam'));
    expect(html).toContain('aria-label="Capability Level 3, Confidence Level 1, Compliance Level 1"');
  });

  test('has 22 questions', () => {
    expect(QUESTIONS).toHaveLength(22);
  });

  test("doesn't skip levels: C1 and C3 without C2 is Capability 1", () => {
    const r = scoreQuiz({ ...PASS, ...yes('c1', 'c3'), c2: 'partly' });
    expect(r.levels.capability).toBe(1);
  });

  test('no Level 1 statement is not yet at Level 1', () => {
    const r = scoreQuiz({ ...PASS, c1: 'not-yet' });
    expect(r.levels.capability).toBe(0);
  });

  test("a check below the self-rated level doesn't bite", () => {
    const r = scoreQuiz({ ...PASS, ...yes('p1'), k4: 'b' });
    expect(r.levels.compliance).toBe(1);
    expect(r.checks.find((c) => c.id === 'k4')!.capped).toBe(false);
  });

  test('failing the red flags check puts compliance below Level 1', () => {
    const r = scoreQuiz({ ...PASS, ...yes('p1', 'p2'), k2: ['a', 'b', 'e'] });
    expect(r.levels.compliance).toBe(0);
  });

  test('grading a red task wrong fails the green, amber or red check', () => {
    const r = scoreQuiz({
      ...PASS,
      ...yes('p1', 'p2', 'p3'),
      k3: { email: 'green', feedback: 'amber', appeal: 'amber', disciplinary: 'red' },
    });
    expect(r.levels.compliance).toBe(1);
  });

  test('patterns show in order', () => {
    const r = scoreQuiz({ ...PASS, ...yes('c1', 'c2', 'c3', 'f1', 'p1') });
    expect(r.levels).toEqual({ capability: 3, confidence: 1, compliance: 1 });
    expect(r.patterns).toEqual(['cap-over-comp', 'cap-over-conf']);
  });

  test('all three level is "ready to move up"', () => {
    expect(scoreQuiz({ ...PASS, ...yes('c1', 'f1', 'p1') }).patterns).toEqual(['level']);
  });
});

/** Answers every screen in the browser from a full answer set. */
async function answerQuiz(page: Page, answers: QuizAnswers) {
  const pick = (name: string, value: string) =>
    page.locator('label', { has: page.locator(`input[name="${name}"][value="${value}"]`) }).click();
  const a = answers as Record<string, unknown>;
  for (const q of QUESTIONS) {
    const v = a[q.id] ?? 'not-yet';
    if (q.kind === 'multi') for (const x of v as string[]) await pick(q.id, x);
    else if (q.kind === 'grade')
      for (const [task, grade] of Object.entries(v as Record<string, string>)) await pick(`${q.id}:${task}`, grade);
    else await pick(q.id, v as string);
    await page.locator('[data-action="next"]').click();
  }
}

test.describe('hierarchy quiz page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/ai-use-hierarchy-quiz/', { waitUntil: 'load' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'load' });
  });

  test('teaser first, full report after the email', async ({ page }) => {
    let body: Record<string, unknown> | undefined;
    await page.route('**/functions/v1/send-quiz-results', async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
    });

    await page.getByRole('button', { name: 'Start the quiz' }).click();
    await answerQuiz(page, { ...PASS, ...yes('c1', 'c2', 'c3', 'f1', 'p1') });

    await expect(page.locator('[data-score]')).toHaveText('Capability 3, Confidence 1, Compliance 1');
    await expect(
      page.getByRole('img', { name: 'Capability Level 3, Confidence Level 1, Compliance Level 1' })
    ).toBeVisible();
    await expect(page.locator('[data-pattern]')).toHaveText([
      'Skilled, and not yet safe',
      "You have the skill, and you're not using it yet",
    ]);
    await expect(page.locator('[data-policy]')).toBeHidden();
    await expect(page.locator('[data-full]')).toBeHidden();

    await page.getByLabel('Name').fill('Sam Taylor');
    await page.getByLabel('Work email').fill('sam@example.ac.uk');
    await page.getByRole('button', { name: 'Show and email my full report' }).click();

    await expect(page.locator('[data-full]')).toBeVisible();
    await expect(page.locator('[data-email-status]')).toContainText("We've emailed a copy to sam@example.ac.uk");
    await expect(page.locator('[data-pillar-report="capability"]')).toContainText('Your next step: Map a work process');
    expect(body).toMatchObject({ name: 'Sam Taylor', email: 'sam@example.ac.uk', marketingOptIn: false });
  });

  test('a failed email still shows the full report, with the cap line', async ({ page }) => {
    await page.route('**/functions/v1/send-quiz-results', (route) => route.fulfill({ status: 502, body: '{}' }));

    await page.getByRole('button', { name: 'Start the quiz' }).click();
    await answerQuiz(page, { ...PASS, approvedTool: 'unknown', ...yes('c1', 'f1', 'p1', 'p2', 'p3'), k4: 'b' });

    await expect(page.locator('[data-score]')).toHaveText('Capability 1, Confidence 1, Compliance 2');
    await expect(page.locator('[data-policy]')).toBeVisible();

    await page.getByLabel('Name').fill('Sam Taylor');
    await page.getByLabel('Work email').fill('sam@example.ac.uk');
    await page.getByRole('button', { name: 'Show and email my full report' }).click();

    await expect(page.locator('[data-email-status]')).toContainText("We couldn't send the email");
    await expect(page.locator('[data-pillar-report="compliance"] [data-cap-line]')).toHaveText(
      "Your answer to the 'where should the rule live' scenario held your compliance at Level 2. Here's why:"
    );
  });

  test('has no horizontal overflow at phone width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: 'Start the quiz' }).click();
    await page.locator('[data-action="next"]').waitFor();
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  });
});
