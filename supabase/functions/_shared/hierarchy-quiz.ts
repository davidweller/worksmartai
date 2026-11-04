// The AI Use Hierarchy Quiz: questions, scoring and result copy.
// Imported by src/pages/ai-use-hierarchy-quiz.astro and supabase/functions/send-quiz-results,
// so the on-screen report and the emailed report can't drift. No imports, so Vite and Deno both load it.
// Source: the vault notes "AI Use Hierarchy Quiz" and "AI Use Hierarchy - Capability, Confidence and
// Compliance". Change the framework first, then this.

export const QUIZ_VERSION = '2026-11-04';

export type Pillar = 'capability' | 'confidence' | 'compliance';
export type Rating = 'yes' | 'partly' | 'not-yet';
export type Grade = 'green' | 'amber' | 'red';

export const PILLARS: { key: Pillar; label: string; question: string }[] = [
  { key: 'capability', label: 'Capability', question: 'What you can do' },
  { key: 'confidence', label: 'Confidence', question: "Whether you'll do it without someone beside you" },
  { key: 'compliance', label: 'Compliance', question: 'Whether you do it safely' },
];

/** Level names and definitions. A test checks these match src/data/brand/hierarchy.ts. */
export const LEVELS: { level: number; name: string; capability: string; confidence: string; compliance: string }[] = [
  {
    level: 1,
    name: 'Conversational AI',
    capability: 'Uses an AI assistant to draft, summarise and question, refining through conversation',
    confidence: 'Willing to try AI on low-risk tasks; knows its limits',
    compliance: 'Follows the AI policy; no sensitive data in unapproved tools; checks outputs',
  },
  {
    level: 2,
    name: 'Structured Prompting',
    capability: 'Uses the R-C-T framework and reusable prompts for reliable, repeatable results',
    confidence: 'Uses AI routinely without step-by-step help; trusts own judgement on outputs',
    compliance: 'Applies the Green/Amber/Red Decision Matrix to choose suitable tasks',
  },
  {
    level: 3,
    name: 'Custom Configuration',
    capability: 'Builds reusable assistants with set instructions, tone and knowledge',
    confidence: 'Shares tools with colleagues; adapts when tools change',
    compliance: 'Configures with approved data sources, permissions and guardrails',
  },
  {
    level: 4,
    name: 'Agents and Workflows',
    capability: 'Designs and runs agents and multi-step workflows with checks and handoffs',
    confidence: 'Hands off multi-step work to AI while staying accountable',
    compliance: 'Builds human checkpoints, data handling and audit trails into workflows',
  },
  {
    level: 5,
    name: 'Integration and Orchestration',
    capability: 'Connects AI into team or institutional systems and coordinates several tools',
    confidence: 'Leads others’ adoption and makes the case for change',
    compliance: 'Owns governance: risk assessment, accountability, monitoring',
  },
];

export const INTRO = {
  title: 'Where are you on the AI Use Hierarchy?',
  body: "Five levels of AI use, measured three ways: what you can do (capability), whether you'll do it without someone beside you (confidence), and whether you do it safely (compliance). Most people sit at different levels on each, and that's the useful part. Answer for a normal working week, not your best day. Something you've done once doesn't count yet. It takes about 7 minutes, and Level 1 is where most staff in UK higher education are right now.",
};

export interface Option {
  value: string;
  label: string;
}

export const RATINGS: Option[] = [
  { value: 'yes', label: "Yes, that's me" },
  { value: 'partly', label: 'Partly, or only once or twice' },
  { value: 'not-yet', label: 'Not yet' },
];

export interface AboutQuestion {
  kind: 'about';
  id: 'role' | 'approvedTool';
  prompt: string;
  hint?: string;
  options: Option[];
}

export interface StatementQuestion {
  kind: 'statement';
  id: string;
  pillar: Pillar;
  level: number;
  text: string;
  /** The statement reworded as the next step, shown when this is the next level up. */
  next: string;
}

export interface CheckOption extends Option {
  correct: boolean;
  feedback: string;
}

export interface SingleCheck {
  kind: 'single';
  id: 'k1' | 'k4' | 'k5';
  pillar: Pillar;
  title: string;
  prompt: string;
  options: CheckOption[];
}

export interface MultiCheck {
  kind: 'multi';
  id: 'k2';
  pillar: Pillar;
  title: string;
  prompt: string;
  /** `correct` marks a red flag. */
  options: CheckOption[];
}

export interface GradeCheck {
  kind: 'grade';
  id: 'k3';
  pillar: Pillar;
  title: string;
  prompt: string;
  tasks: { id: string; text: string; answer: Grade; feedback: string }[];
}

export type Question = AboutQuestion | StatementQuestion | SingleCheck | MultiCheck | GradeCheck;

export const GRADES: { value: Grade; label: string }[] = [
  { value: 'green', label: 'Green' },
  { value: 'amber', label: 'Amber' },
  { value: 'red', label: 'Red' },
];

const statement = (id: string, pillar: Pillar, level: number, text: string, next: string): StatementQuestion => ({
  kind: 'statement',
  id,
  pillar,
  level,
  text,
  next,
});

/** Every screen of the quiz, in order: 22 questions. */
export const QUESTIONS: Question[] = [
  {
    kind: 'about',
    id: 'role',
    prompt: 'Which best describes your role?',
    options: [
      { value: 'academic', label: 'Academic or teaching staff' },
      { value: 'research', label: 'Research staff' },
      { value: 'professional-services', label: 'Professional services' },
      { value: 'leader', label: 'Leader or manager' },
      { value: 'other', label: 'Other' },
    ],
  },
  {
    kind: 'about',
    id: 'approvedTool',
    prompt: 'Does your institution have an AI tool it has approved for staff to use at work?',
    options: [
      { value: 'yes-known', label: 'Yes, and I know which one it is' },
      { value: 'yes-unsure', label: "Yes, but I'm not sure which one" },
      { value: 'no', label: 'No' },
      { value: 'unknown', label: "I don't know" },
    ],
  },

  statement(
    'c1',
    'capability',
    1,
    "I use an AI assistant to draft, summarise or explain things for my work, and when the first answer isn't right I ask follow-up questions rather than starting again.",
    "Use an AI assistant to draft, summarise or explain things for your work, and when the first answer isn't right, ask follow-up questions rather than starting again."
  ),
  statement(
    'c2',
    'capability',
    2,
    'I give my prompts a role, context and task, and I keep the prompts that work and reuse them for regular tasks.',
    'Give your prompts a role, context and task, and keep the prompts that work so you can reuse them for regular tasks.'
  ),
  statement(
    'c3',
    'capability',
    3,
    "I've built a reusable assistant, such as a Copilot agent, custom GPT, Gemini Gem or Claude Project, with set instructions and reference documents, and I fix its instructions when the results drift.",
    'Build a reusable assistant, such as a Copilot agent, custom GPT, Gemini Gem or Claude Project, with set instructions and reference documents, and fix its instructions when the results drift.'
  ),
  statement(
    'c4',
    'capability',
    4,
    "I've mapped a work process into steps, chosen which steps AI does, and built a workflow where each step's output is checked before the next one starts.",
    "Map a work process into steps, choose which steps AI does, and build a workflow where each step's output is checked before the next one starts."
  ),
  statement(
    'c5',
    'capability',
    5,
    'I connect AI tools into the systems my team or institution runs on, such as SharePoint, student records or a CRM, and coordinate several tools so they work as one process.',
    'Connect AI tools into the systems your team or institution runs on, such as SharePoint, student records or a CRM, and coordinate several tools so they work as one process.'
  ),
  {
    kind: 'single',
    id: 'k1',
    pillar: 'capability',
    title: 'Capability check',
    prompt:
      'You want a summary of this week’s team meeting notes, in the same format every week. Which prompt will give you the most reliable, repeatable result?',
    options: [
      {
        value: 'a',
        label: '"Summarise these notes."',
        correct: false,
        feedback: 'It works, but the AI decides what matters and the format changes every week.',
      },
      {
        value: 'b',
        label: '"Please summarise these notes as accurately as you can. Thank you!"',
        correct: false,
        feedback: "Being polite and asking for accuracy doesn't tell the AI what you need.",
      },
      {
        value: 'c',
        label:
          '"You\'re the team administrator. These are notes from our weekly operations meeting, for colleagues who missed it. List every decision and every action, each action with an owner and a deadline, in a table."',
        correct: true,
        feedback:
          'Role, context and task: it says who it’s for and what to produce, so you get the same shape every week.',
      },
      {
        value: 'd',
        label: '"Summarise these notes in a professional style."',
        correct: false,
        feedback: "Style isn't the problem. It still doesn't know who the summary is for or what to include.",
      },
    ],
  },

  statement(
    'f1',
    'confidence',
    1,
    "I'm willing to try AI on a low-risk task without someone showing me first, and I can explain why an answer might be wrong even when it sounds right.",
    'Try AI on a low-risk task without waiting for someone to show you first, and learn to explain why an answer might be wrong even when it sounds right.'
  ),
  statement(
    'f2',
    'confidence',
    2,
    "I use AI for some of my regular tasks every week without help, and I reject output that isn't good enough on the strength of my own expertise.",
    "Use AI for some of your regular tasks every week without help, and reject output that isn't good enough on the strength of your own expertise."
  ),
  statement(
    'f3',
    'confidence',
    3,
    'I share AI tools or set-ups I’ve built with colleagues, support them in using them, and adapt them when the tool or the process changes.',
    'Share the AI tools or set-ups you’ve built with colleagues, support them in using them, and adapt them when the tool or the process changes.'
  ),
  statement(
    'f4',
    'confidence',
    4,
    'I hand multi-step work to AI and still take responsibility for the result, and I can explain to a manager how my workflow works and where it could fail.',
    'Hand multi-step work to AI while you keep responsibility for the result, and be able to explain to a manager how your workflow works and where it could fail.'
  ),
  statement(
    'f5',
    'confidence',
    5,
    'I make the case for AI changes to senior leaders, and I lead other teams through adopting AI, not only my own.',
    'Make the case for AI changes to senior leaders, and lead other teams through adopting AI, not only your own.'
  ),

  statement(
    'p1',
    'compliance',
    1,
    'For work, I only use the AI tool my institution approves, I keep personal, student and confidential data out of anything else, and I check every fact and figure in an AI output before I use it.',
    'For work, use only the AI tool your institution approves, keep personal, student and confidential data out of anything else, and check every fact and figure in an AI output before you use it.'
  ),
  statement(
    'p2',
    'compliance',
    2,
    'Before I start a task, I decide whether it’s green, amber or red, and I tell the AI what to flag for me rather than deal with itself.',
    'Before you start a task, decide whether it’s green, amber or red, and tell the AI what to flag for you rather than deal with itself.'
  ),
  statement(
    'p3',
    'compliance',
    3,
    'When I build an assistant, I load approved sources only, write the guardrails into its instructions, and decide who can use it and who can edit it.',
    'When you build an assistant, load approved sources only, write the guardrails into its instructions, and decide who can use it and who can edit it.'
  ),
  statement(
    'p4',
    'compliance',
    4,
    'My AI workflows have a human approval gate before anything leaves them, and a record of what ran and what it used.',
    'Give your AI workflows a human approval gate before anything leaves them, and a record of what ran and what it used.'
  ),
  statement(
    'p5',
    'compliance',
    5,
    "I carry out risk and data protection assessments for AI systems, name who's accountable for each one, and monitor them after they go live.",
    "Carry out risk and data protection assessments for AI systems, name who's accountable for each one, and monitor them after they go live."
  ),
  {
    kind: 'multi',
    id: 'k2',
    pillar: 'compliance',
    title: 'Spot the red flags',
    prompt:
      'A colleague is preparing for an exam board. They paste a spreadsheet of student names, marks and notes from learning support plans into a free AI chatbot on their personal account, ask it which students are at risk of failing, and email the answer straight to the board chair. Which of these are red flags? Choose all that apply.',
    options: [
      {
        value: 'a',
        label: 'Using a personal account instead of the approved tool',
        correct: true,
        feedback: "Nothing pasted into a personal account is covered by the institution's data protection.",
      },
      {
        value: 'b',
        label: "Putting named students' marks into it",
        correct: true,
        feedback: 'Named student data never goes into an unapproved tool.',
      },
      {
        value: 'c',
        label: 'Including details from learning support plans',
        correct: true,
        feedback: 'These can reveal disability or health information, which is special category data.',
      },
      {
        value: 'd',
        label: 'Sending the answer on without checking it',
        correct: true,
        feedback: 'Every figure gets checked before anything is shared.',
      },
      {
        value: 'e',
        label: 'Using AI to summarise information at all',
        correct: false,
        feedback: 'Summarising is a good use of AI. The problems are the tool, the data and the missing check.',
      },
      {
        value: 'f',
        label: 'Asking a question rather than giving step-by-step instructions',
        correct: false,
        feedback: "How the question is phrased isn't a compliance issue here.",
      },
    ],
  },
  {
    kind: 'grade',
    id: 'k3',
    pillar: 'compliance',
    title: 'Green, amber or red',
    prompt:
      "Green means go ahead in the approved tool with basic checks. Amber means AI can draft, but personal data is removed and a person checks everything before it's used. Red means don't use AI. Grade each task.",
    tasks: [
      {
        id: 'email',
        text: 'Drafting an internal email reminding your team about a training session',
        answer: 'green',
        feedback: 'Low risk and easy to check.',
      },
      {
        id: 'feedback',
        text: "Drafting formative feedback comments on student essays, each one reviewed and edited before it's shared",
        answer: 'amber',
        feedback: 'AI speeds it up, but the lecturer owns every comment.',
      },
      {
        id: 'appeal',
        text: "Deciding the outcome of a student's academic appeal",
        answer: 'red',
        feedback: 'A decision about a student needs human judgement and accountability.',
      },
      {
        id: 'disciplinary',
        text: 'Summarising notes from a staff disciplinary hearing',
        answer: 'red',
        feedback: 'Sensitive HR data stays out of AI.',
      },
    ],
  },
  {
    kind: 'single',
    id: 'k4',
    pillar: 'compliance',
    title: 'Guardrails',
    prompt:
      'Your team has an assistant that drafts the annual student feedback report. It must never name a member of staff. Where should that rule live?',
    options: [
      {
        value: 'a',
        label: "In the assistant's instructions",
        correct: true,
        feedback: 'A guardrail in the instructions applies whoever runs it.',
      },
      {
        value: 'b',
        label: 'In a note to whoever runs the assistant that week',
        correct: false,
        feedback: 'It depends on that person remembering, every time.',
      },
      {
        value: 'c',
        label: "In the team's AI training",
        correct: false,
        feedback: "Training helps, but the assistant doesn't attend it.",
      },
      {
        value: 'd',
        label: 'Nowhere: a reader would spot a name before it’s published',
        correct: false,
        feedback: "That's a hope, not a check.",
      },
    ],
  },
  {
    kind: 'single',
    id: 'k5',
    pillar: 'compliance',
    title: 'Approval gate',
    prompt:
      "You've built a workflow: one agent drafts replies to student enquiries and a second agent checks each draft against the student handbook. Where should a person approve the work?",
    options: [
      {
        value: 'a',
        label: 'Before the first agent starts, to check the workflow is set up properly',
        correct: false,
        feedback: 'Setting it up well matters, but nothing has been written yet to approve.',
      },
      {
        value: 'b',
        label: 'After the checking agent, before any reply is sent',
        correct: true,
        feedback: 'The human gate sits before anything leaves the workflow.',
      },
      {
        value: 'c',
        label: 'Nowhere: the checking agent does that job',
        correct: false,
        feedback: "A second agent catches errors. It doesn't take responsibility for them.",
      },
      {
        value: 'd',
        label: 'Once a month, by sampling replies that have already gone out',
        correct: false,
        feedback: 'Sampling is good monitoring, but by then the replies have gone.',
      },
    ],
  },
];

/** Section label for the progress bar. */
export function sectionOf(q: Question): string {
  if (q.kind === 'about') return 'About you';
  const p = PILLARS.find((x) => x.key === q.pillar)!;
  return `${p.label}: ${p.question.charAt(0).toLowerCase()}${p.question.slice(1)}`;
}

export interface QuizAnswers {
  role?: string;
  approvedTool?: string;
  c1?: Rating;
  c2?: Rating;
  c3?: Rating;
  c4?: Rating;
  c5?: Rating;
  f1?: Rating;
  f2?: Rating;
  f3?: Rating;
  f4?: Rating;
  f5?: Rating;
  p1?: Rating;
  p2?: Rating;
  p3?: Rating;
  p4?: Rating;
  p5?: Rating;
  k1?: string;
  k2?: string[];
  k3?: Record<string, Grade>;
  k4?: string;
  k5?: string;
}

export function isAnswered(q: Question, a: QuizAnswers): boolean {
  const v = (a as Record<string, unknown>)[q.id];
  if (q.kind === 'multi') return Array.isArray(v) && v.length > 0;
  if (q.kind === 'grade') {
    const g = v as Record<string, Grade> | undefined;
    return !!g && q.tasks.every((t) => !!g[t.id]);
  }
  return typeof v === 'string' && v.length > 0;
}

/** Each check, the level of its pillar it gates, and the level a failure caps it to. */
const CAPS: { check: Question['id']; pillar: Pillar; gates: number; capTo: number; name: string }[] = [
  { check: 'k1', pillar: 'capability', gates: 2, capTo: 1, name: 'prompt' },
  { check: 'k2', pillar: 'compliance', gates: 1, capTo: 0, name: 'red flags' },
  { check: 'k3', pillar: 'compliance', gates: 2, capTo: 1, name: 'green, amber or red' },
  { check: 'k4', pillar: 'compliance', gates: 3, capTo: 2, name: 'guardrails' },
  { check: 'k5', pillar: 'compliance', gates: 4, capTo: 3, name: 'approval gate' },
];

function questionById<T extends Question>(id: string): T {
  return QUESTIONS.find((q) => q.id === id) as T;
}

export function checkPassed(id: string, a: QuizAnswers): boolean {
  if (id === 'k2') {
    const q = questionById<MultiCheck>('k2');
    const chosen = new Set(a.k2 ?? []);
    const flags = q.options.filter((o) => o.correct && chosen.has(o.value)).length;
    const wrong = q.options.some((o) => !o.correct && chosen.has(o.value));
    return flags >= 3 && !wrong;
  }
  if (id === 'k3') {
    const q = questionById<GradeCheck>('k3');
    const g = a.k3 ?? {};
    const right = q.tasks.filter((t) => g[t.id] === t.answer).length;
    const redsRight = q.tasks.filter((t) => t.answer === 'red').every((t) => g[t.id] === 'red');
    return right >= 3 && redsRight;
  }
  const q = questionById<SingleCheck>(id);
  return q.options.some((o) => o.correct && o.value === (a as Record<string, unknown>)[id]);
}

/** Feedback lines for every wrong answer on a check. */
export function checkFeedback(id: string, a: QuizAnswers): string[] {
  if (id === 'k2') {
    const q = questionById<MultiCheck>('k2');
    const chosen = new Set(a.k2 ?? []);
    return q.options
      .filter((o) => o.correct !== chosen.has(o.value))
      .map((o) => (o.correct ? `Missed: ${o.label}. ${o.feedback}` : `Not a red flag: ${o.label}. ${o.feedback}`));
  }
  if (id === 'k3') {
    const q = questionById<GradeCheck>('k3');
    const g = a.k3 ?? {};
    const label = (v?: Grade) => GRADES.find((x) => x.value === v)?.label ?? 'no answer';
    return q.tasks
      .filter((t) => g[t.id] !== t.answer)
      .map(
        (t) =>
          `${t.text}: you said ${label(g[t.id]).toLowerCase()}, it's ${label(t.answer).toLowerCase()}. ${t.feedback}`
      );
  }
  const q = questionById<SingleCheck>(id);
  const chosen = q.options.find((o) => o.value === (a as Record<string, unknown>)[id]);
  if (chosen?.correct) return [];
  const right = q.options.find((o) => o.correct)!;
  return [chosen ? chosen.feedback : 'No answer given.', `Best answer: ${right.label}`, right.feedback];
}

export interface CheckResult {
  id: string;
  title: string;
  pillar: Pillar;
  passed: boolean;
  /** True when the failure lowered the pillar's level. */
  capped: boolean;
  capLine?: string;
  feedback: string[];
}

export interface QuizResult {
  /** 0 is Starting Level 1. */
  levels: Record<Pillar, number>;
  selfRated: Record<Pillar, number>;
  checks: CheckResult[];
  patterns: PatternId[];
  showPolicyMessage: boolean;
}

export function selfRatedLevel(pillar: Pillar, a: QuizAnswers): number {
  const prefix = { capability: 'c', confidence: 'f', compliance: 'p' }[pillar];
  let level = 0;
  for (let n = 1; n <= 5; n++) {
    if ((a as Record<string, unknown>)[`${prefix}${n}`] !== 'yes') break;
    level = n;
  }
  return level;
}

export function levelLabel(level: number): string {
  return level === 0 ? 'Starting Level 1' : `Level ${level}`;
}

export function scoreQuiz(a: QuizAnswers): QuizResult {
  const selfRated = {
    capability: selfRatedLevel('capability', a),
    confidence: selfRatedLevel('confidence', a),
    compliance: selfRatedLevel('compliance', a),
  };
  const levels = { ...selfRated };
  const checks: CheckResult[] = CAPS.map((c) => {
    const q = questionById<SingleCheck | MultiCheck | GradeCheck>(c.check);
    const passed = checkPassed(c.check, a);
    // A check only bites if the level has reached the level it gates.
    const capped = !passed && levels[c.pillar] >= c.gates;
    if (capped) levels[c.pillar] = Math.min(levels[c.pillar], c.capTo);
    const capLine = capped
      ? c.capTo === 0
        ? `Your answer to the ${c.name} question set your ${c.pillar} to Starting Level 1.`
        : `Your answer to the ${c.name} question kept your ${c.pillar} at Level ${c.capTo}.`
      : undefined;
    return {
      id: c.check,
      title: q.title,
      pillar: c.pillar,
      passed,
      capped,
      capLine,
      feedback: checkFeedback(c.check, a),
    };
  });
  return {
    levels,
    selfRated,
    checks,
    patterns: profilePatterns(levels),
    showPolicyMessage: a.approvedTool !== 'yes-known',
  };
}

export type PatternId = 'cap-over-comp' | 'cap-over-conf' | 'conf-over-cap' | 'comp-over-cap' | 'level';

export const PATTERNS: Record<PatternId, { headline: string; start: string }> = {
  'cap-over-comp': {
    headline: 'Skilled, and not yet safe',
    start: 'Compliance at your current level before anything new. This is the shadow AI profile.',
  },
  'cap-over-conf': {
    headline: "You have the skill, and you're not using it yet",
    start: 'Practise on real tasks, and find someone to share the work with.',
  },
  'conf-over-cap': {
    headline: 'Keen, and ready to learn the next technique',
    start: 'Structured prompting: role, context and task.',
  },
  'comp-over-cap': {
    headline: 'Careful: you know the rules better than the tools',
    start: 'Start with low-risk green tasks to build capability.',
  },
  level: { headline: 'Ready to move up', start: "The next level's capability." },
};

/** Every pattern that applies, in display order. "Level" only when none of the others do. */
export function profilePatterns(l: Record<Pillar, number>): PatternId[] {
  const out: PatternId[] = [];
  if (l.capability > l.compliance) out.push('cap-over-comp');
  if (l.capability > l.confidence) out.push('cap-over-conf');
  if (l.confidence > l.capability) out.push('conf-over-cap');
  if (l.compliance > l.capability) out.push('comp-over-cap');
  if (!out.length) out.push('level');
  return out;
}

export const POLICY_MESSAGE =
  'First, find out which AI tool your institution approves for staff, and what must never go into it. Ask your IT service or line manager. Everything else on this page builds on that.';

export const SELF_REPORT_NOTE =
  'Above Level 2, capability here is self-reported. We measure it by reviewing a working assistant or workflow, which is part of the AI Capability Check.';

export const CLOSING =
  'This is a self-assessment. For a team, the useful number is the spread, not the average: a team averaging Level 2 can be half at Level 1 and half at Level 3, which needs two different kinds of training. Book a free 30-minute AI Capability Check and we’ll place your team on the framework.';

export const CHECK_HREF = '/health-check/';

export interface PillarReport {
  pillar: Pillar;
  label: string;
  level: number;
  levelLabel: string;
  levelName?: string;
  definition?: string;
  next?: string;
  checks: CheckResult[];
}

export interface Report {
  pillars: PillarReport[];
  patterns: { id: PatternId; headline: string; start: string }[];
  policyMessage?: string;
  selfReportNote?: string;
  closing: string;
}

export function buildReport(result: QuizResult): Report {
  const pillars = PILLARS.map(({ key, label }) => {
    const level = result.levels[key];
    const def = LEVELS.find((l) => l.level === level);
    const nextQ = QUESTIONS.find(
      (q): q is StatementQuestion => q.kind === 'statement' && q.pillar === key && q.level === level + 1
    );
    return {
      pillar: key,
      label,
      level,
      levelLabel: levelLabel(level),
      levelName: def?.name,
      definition: def?.[key],
      next: nextQ ? `Next: ${nextQ.next}` : undefined,
      checks: result.checks.filter((c) => c.pillar === key && c.feedback.length > 0),
    };
  });
  const patterns = result.patterns.map((id) => {
    const p = PATTERNS[id];
    // "Ready to move up" points at the next capability statement, or says there's nowhere higher.
    if (id === 'level') {
      const cap = pillars[0];
      return { id, headline: p.headline, start: cap.next ? cap.next : 'You’re at Level 5 on all three.' };
    }
    return { id, ...p };
  });
  return {
    pillars,
    patterns,
    policyMessage: result.showPolicyMessage ? POLICY_MESSAGE : undefined,
    selfReportNote: result.levels.capability >= 3 ? SELF_REPORT_NOTE : undefined,
    closing: CLOSING,
  };
}

/** "Capability 2, Confidence 1, Compliance 2", with Starting Level 1 written out. */
export function profileLine(levels: Record<Pillar, number>): string {
  return PILLARS.map(({ key, label }) => `${label} ${levels[key] === 0 ? 'starting Level 1' : levels[key]}`).join(', ');
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** The full report as email HTML, in the same inline-style shell as the guide email. */
export function renderReportEmail(name: string, result: QuizResult, siteUrl = 'https://worksmart-ai.co.uk'): string {
  const r = buildReport(result);
  const p = (text: string, style = '') => `<p style="margin:0 0 12px;${style}">${esc(text)}</p>`;
  const pillarHtml = r.pillars
    .map((pr) => {
      const head = `${pr.label}: ${pr.levelLabel}${pr.levelName ? `, ${pr.levelName}` : ''}`;
      const checks = pr.checks
        .map(
          (c) =>
            `<div style="margin:12px 0 0;padding:12px;background:#f8fafc;border-radius:8px;font-size:14px;">` +
            `<p style="margin:0 0 6px;font-weight:600;">${esc(c.title)}</p>` +
            (c.capLine ? p(c.capLine, 'font-weight:600;color:#b45309;') : '') +
            c.feedback.map((f) => p(f)).join('') +
            `</div>`
        )
        .join('');
      return (
        `<div style="margin:0 0 20px;padding:0 0 0 14px;border-left:4px solid #FF7700;">` +
        `<p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#015887;">${esc(head)}</p>` +
        (pr.definition ? p(pr.definition) : '') +
        (pr.next ? p(pr.next, 'font-weight:600;') : '') +
        checks +
        `</div>`
      );
    })
    .join('');
  const patternHtml = r.patterns
    .map(
      (pt) => `<p style="margin:0 0 4px;font-weight:700;">${esc(pt.headline)}</p>${p(`Where to start: ${pt.start}`)}`
    )
    .join('');
  const checkUrl = `${siteUrl.replace(/\/$/, '')}${CHECK_HREF}`;
  return [
    `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>`,
    `<body style="margin:0;padding:24px;font-family:system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.6;color:#0f172a;background:#f8fafc;">`,
    `<div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;">`,
    p(`Hi ${name},`),
    p('Here is your full AI Use Hierarchy profile.'),
    `<p style="margin:0 0 20px;font-size:20px;font-weight:700;color:#015887;">${esc(profileLine(result.levels))}</p>`,
    r.policyMessage ? p(r.policyMessage, 'padding:12px;background:#fff7ed;border-radius:8px;') : '',
    `<p style="margin:20px 0 8px;font-size:18px;font-weight:700;">Your profile</p>`,
    patternHtml,
    `<p style="margin:20px 0 12px;font-size:18px;font-weight:700;">Pillar by pillar</p>`,
    pillarHtml,
    r.selfReportNote ? p(r.selfReportNote, 'font-size:14px;color:#475569;') : '',
    p(r.closing),
    `<p style="margin:0 0 20px;"><a href="${checkUrl}" style="display:inline-block;background:#FF7700;color:#ffffff;font-weight:600;text-decoration:none;padding:10px 16px;border-radius:8px;">Book your free AI Capability Check &rarr;</a></p>`,
    `<p style="margin:0;">The WorkSmart-AI Team<br/><a href="${siteUrl}" style="color:#015887;">worksmart-ai.co.uk</a></p>`,
    `</div></body></html>`,
  ].join('');
}
