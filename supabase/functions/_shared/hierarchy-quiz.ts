// The AI Use Hierarchy Quiz: questions, scoring and result copy.
// Imported by src/pages/ai-use-hierarchy-quiz.astro and supabase/functions/send-quiz-results,
// so the on-screen report and the emailed report can't drift. No imports, so Vite and Deno both load it.
// Source: the vault notes "AI Use Hierarchy Quiz" and "AI Use Hierarchy - Capability, Confidence and
// Compliance". Change the framework first, then this.

export const QUIZ_VERSION = '2026-11-05';

export type Pillar = 'capability' | 'confidence' | 'compliance';
export type Rating = 'yes' | 'partly' | 'not-yet' | 'would-know';
export type Grade = 'green' | 'amber' | 'red';

// Visitors haven't done our courses, so result copy avoids course terms (R-C-T, the Decision Matrix,
// guardrails). Level names match src/data/brand/hierarchy.ts; a test checks that.
export const PILLARS: { key: Pillar; label: string; question: string }[] = [
  { key: 'capability', label: 'Capability', question: 'What you can do' },
  { key: 'confidence', label: 'Confidence', question: "Whether you'll do it on your own" },
  { key: 'compliance', label: 'Compliance', question: 'Whether you do it safely' },
];

export const LEVELS: {
  level: number;
  name: string;
  summary: string;
  capability: string;
  confidence: string;
  compliance: string;
}[] = [
  {
    level: 1,
    name: 'Conversational AI',
    summary: 'Chatting with an AI assistant to draft, summarise and explain',
    capability:
      'You use an AI assistant to draft, summarise and explain, and you ask follow-up questions to improve its answers.',
    confidence: 'You’ll try AI on low-risk tasks, and you know it can sound right and still be wrong.',
    compliance:
      'You use only your organisation’s approved tool, keep personal data out of it, and check what it tells you.',
  },
  {
    level: 2,
    name: 'Structured Prompting',
    summary: 'Writing clear, reusable prompts that give reliable results',
    capability:
      'You tell AI who to be, what the situation is and exactly what to produce, and you reuse prompts that work.',
    confidence: 'You use AI every week without help, and you trust your own judgement on what it gives you.',
    compliance: 'Before you start, you decide whether a task is safe for AI, needs care, or shouldn’t go near it.',
  },
  {
    level: 3,
    name: 'Custom Configuration',
    summary: 'Building reusable assistants with their own instructions and documents',
    capability:
      'You build reusable assistants with their own instructions and documents, so anyone who uses them gets the same quality.',
    confidence: 'You share what you’ve built with colleagues and keep it working when things change.',
    compliance:
      'You control what your assistant can see, write its rules into its instructions, and decide who can use it.',
  },
  {
    level: 4,
    name: 'Agents and Workflows',
    summary: 'Designing multi-step processes where AI does some of the steps',
    capability: 'You design multi-step processes where AI does some of the steps and each step is checked.',
    confidence: 'You hand multi-step work to AI and still take responsibility for the result.',
    compliance: 'A person signs off before anything leaves the process, and there’s a record of what ran.',
  },
  {
    level: 5,
    name: 'Integration and Orchestration',
    summary: 'Connecting AI into the systems your organisation runs on',
    capability: 'You connect AI into your organisation’s systems and coordinate several tools as one process.',
    confidence: 'You lead other teams through adopting AI and make the case for it to senior leaders.',
    compliance: 'You assess the risks of AI systems, name who’s accountable for each, and keep monitoring them.',
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

/** Offered only on statements with a `knowCheck`: counts as yes, and the scenario then tests it. */
export const KNOW_RATING: Option = {
  value: 'would-know',
  label: "I don't build these yet, but I know what I'd need to do",
};

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
  /** The scenario that tests a "would know" answer. Its cap in CAPS pulls the level back if it's failed. */
  knowCheck?: 'k4' | 'k5';
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

const statement = (
  id: string,
  pillar: Pillar,
  level: number,
  text: string,
  next: string,
  knowCheck?: StatementQuestion['knowCheck']
): StatementQuestion => ({
  kind: 'statement',
  id,
  pillar,
  level,
  text,
  next,
  ...(knowCheck ? { knowCheck } : {}),
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
    title: 'Scenario: a weekly summary',
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
          'It tells the AI who to be, what the situation is and exactly what to produce, so you get the same shape every week.',
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
    'Before I start a task, I decide how risky it is: fine for AI, fine with personal data removed and a person checking, or not for AI at all. I also tell the AI what to flag for me rather than deal with itself.',
    'Before you start a task, decide how risky it is: fine for AI, fine with personal data removed and a person checking, or not for AI at all. Then tell the AI what to flag for you rather than deal with itself.'
  ),
  statement(
    'p3',
    'compliance',
    3,
    'When I build an assistant, I give it approved documents only, write its rules into its instructions, and decide who can use it and who can edit it.',
    'When you build an assistant, give it approved documents only, write its rules into its instructions, and decide who can use it and who can edit it.',
    'k4'
  ),
  statement(
    'p4',
    'compliance',
    4,
    'In my AI workflows, a person signs off before anything leaves them, and there’s a record of what ran and what it used.',
    'Make sure a person signs off before anything leaves your AI workflows, and keep a record of what ran and what it used.',
    'k5'
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
    title: 'Scenario: spot the compliance problems',
    prompt:
      'A colleague is preparing for an exam board. They paste a spreadsheet of student names, marks and notes from learning support plans into a free AI chatbot on their personal account, ask it which students are at risk of failing, and email the answer straight to the board chair. Which of these are compliance red flags? Choose all that apply.',
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
        feedback: "It might not be the best prompt, but it isn't a compliance problem.",
      },
    ],
  },
  {
    kind: 'grade',
    id: 'k3',
    pillar: 'compliance',
    title: 'Scenario: is this safe for AI?',
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
    title: 'Scenario: where should the rule live?',
    prompt:
      'Your team has an AI assistant, such as a Copilot agent or custom GPT, that drafts the annual student feedback report. It must never name a member of staff. Where should that rule live?',
    options: [
      {
        value: 'a',
        label: "In the AI assistant's instructions",
        correct: true,
        feedback: 'A rule in the instructions applies whoever runs it.',
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
    title: 'Scenario: where should a person sign off?',
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
        feedback: 'A person signs off before anything leaves the workflow.',
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
  { check: 'k1', pillar: 'capability', gates: 2, capTo: 1, name: 'weekly summary' },
  { check: 'k2', pillar: 'compliance', gates: 1, capTo: 0, name: 'spot the compliance problems' },
  { check: 'k3', pillar: 'compliance', gates: 2, capTo: 1, name: 'is this safe for AI' },
  { check: 'k4', pillar: 'compliance', gates: 3, capTo: 2, name: 'where should the rule live' },
  { check: 'k5', pillar: 'compliance', gates: 4, capTo: 3, name: 'where should a person sign off' },
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
      .map((o) =>
        o.correct ? `Missed: ${o.label}. ${o.feedback}` : `Not a compliance red flag: ${o.label}. ${o.feedback}`
      );
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
  /** 0 is not yet at Level 1. */
  levels: Record<Pillar, number>;
  selfRated: Record<Pillar, number>;
  checks: CheckResult[];
  patterns: PatternId[];
  showPolicyMessage: boolean;
  /** Pillars whose final level rests on a "would know" answer rather than practice. */
  knowledgeOnly: Pillar[];
}

export function selfRatedLevel(pillar: Pillar, a: QuizAnswers): number {
  const prefix = { capability: 'c', confidence: 'f', compliance: 'p' }[pillar];
  let level = 0;
  for (let n = 1; n <= 5; n++) {
    const v = (a as Record<string, unknown>)[`${prefix}${n}`];
    if (v !== 'yes' && v !== 'would-know') break;
    level = n;
  }
  return level;
}

export function levelLabel(level: number): string {
  return level === 0 ? 'Not yet at Level 1' : `Level ${level}`;
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
        ? `Your answer to the '${c.name}' scenario means your ${c.pillar} isn't at Level 1 yet. Here's why:`
        : `Your answer to the '${c.name}' scenario held your ${c.pillar} at Level ${c.capTo}. Here's why:`
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
    knowledgeOnly: PILLARS.map((p) => p.key).filter((key) =>
      QUESTIONS.some(
        (q) =>
          q.kind === 'statement' &&
          q.pillar === key &&
          q.level <= levels[key] &&
          (a as Record<string, unknown>)[q.id] === 'would-know'
      )
    ),
  };
}

export type PatternId = 'cap-over-comp' | 'cap-over-conf' | 'conf-over-cap' | 'comp-over-cap' | 'level';

export const PATTERNS: Record<PatternId, { headline: string; start: string }> = {
  'cap-over-comp': {
    headline: 'Skilled, and not yet safe',
    start:
      'Get the safety basics right at your current level before learning anything new. People in this position often use AI in ways their organisation can’t see or protect.',
  },
  'cap-over-conf': {
    headline: "You have the skill, and you're not using it yet",
    start: 'Use what you know on real tasks each week, ideally alongside a colleague.',
  },
  'conf-over-cap': {
    headline: 'Keen, and ready to learn the next technique',
    start: 'Learn to give AI a role, the background and a clear task, so its answers are reliable and repeatable.',
  },
  'comp-over-cap': {
    headline: 'Careful: you know the rules better than the tools',
    start: 'Start with low-risk tasks, such as internal emails and summaries, to build your skill safely.',
  },
  level: { headline: 'Ready to move up', start: 'Take the next step up in what you can do.' },
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
  'First, find out which AI tool your institution approves for staff, and what must never go into it. Ask your IT service or line manager. Everything else here builds on that.';

export const SELF_REPORT_NOTE =
  'Above Level 2, these answers are your own view. The best test is someone looking at what you’ve built.';

export const KNOWLEDGE_NOTE =
  'At this level, your result reflects what you know, confirmed by the scenario, rather than something you’ve built yet.';

export const FOLLOW_UP_NOTE =
  'We may get in touch once about your results. If you’d rather we didn’t, reply to this email and tell us.';

export const CLOSING =
  'Want to see where your whole team sits? Book a free AI Capability Check: a 30-minute call, then a short written report placing your team on these five levels, with two or three next steps. For a team, the spread matters more than the average: half at Level 1 and half at Level 3 needs two different kinds of training.';

export const CHECK_HREF = '/health-check/';

export interface PillarReport {
  pillar: Pillar;
  label: string;
  /** "What you can do", lower-cased for use after the label. */
  question: string;
  level: number;
  levelLabel: string;
  levelName?: string;
  definition?: string;
  next?: string;
  knowledgeNote?: string;
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
  const pillars = PILLARS.map(({ key, label, question }) => {
    const level = result.levels[key];
    const def = LEVELS.find((l) => l.level === level);
    const nextQ = QUESTIONS.find(
      (q): q is StatementQuestion => q.kind === 'statement' && q.pillar === key && q.level === level + 1
    );
    return {
      pillar: key,
      label,
      question: question.charAt(0).toLowerCase() + question.slice(1),
      level,
      levelLabel: levelLabel(level),
      levelName: def?.name,
      definition: def?.[key],
      next: nextQ ? `Your next step: ${nextQ.next}` : undefined,
      knowledgeNote: result.knowledgeOnly.includes(key) ? KNOWLEDGE_NOTE : undefined,
      checks: result.checks.filter((c) => c.pillar === key && c.feedback.length > 0),
    };
  });
  const patterns = result.patterns.map((id) => {
    const p = PATTERNS[id];
    // "Ready to move up" points at the next capability statement, or says there's nowhere higher.
    if (id === 'level') {
      const cap = pillars[0];
      const headline = cap.level === 0 ? 'Ready to start' : p.headline;
      return { id, headline, start: cap.next ?? 'You’re at Level 5 on all three.' };
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

/** "Capability 2, Confidence 1, Compliance 2", with "not yet at Level 1" written out. */
export function profileLine(levels: Record<Pillar, number>): string {
  const all = new Set(Object.values(levels));
  if (all.size === 1) return `${levelLabel(levels.capability)} on all three`;
  return PILLARS.map(({ key, label }) => `${label} ${levels[key] === 0 ? 'not yet at Level 1' : levels[key]}`).join(
    ', '
  );
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const BLUE = '#015887';
const ORANGE = '#FF7700';

/**
 * Three little ladders, one per measure, filled up to the level, with the top filled step in orange.
 * An inline-styled table rather than SVG, so it renders the same in Gmail, Outlook and the browser.
 */
export function renderProfileDiagram(levels: Record<Pillar, number>): string {
  const label = PILLARS.map(({ key, label }) => `${label} ${levelLabel(levels[key])}`).join(', ');
  const cell = (filled: boolean, top: boolean) =>
    `<td style="padding:3px 9px;"><div style="width:48px;height:20px;border-radius:5px;${
      filled
        ? `background:${top ? ORANGE : BLUE};`
        : 'background:#eef4f8;border:1px dashed #b9cfdc;box-sizing:border-box;'
    }"></div></td>`;
  const rows = [5, 4, 3, 2, 1]
    .map(
      (n) =>
        `<tr><td style="padding:3px 8px 3px 0;font-size:11px;line-height:20px;color:#64748b;text-align:right;">${n}</td>` +
        PILLARS.map(({ key }) => cell(levels[key] >= n, levels[key] === n)).join('') +
        `</tr>`
    )
    .join('');
  const foot =
    `<tr><td></td>` +
    PILLARS.map(
      ({ key, label }) =>
        `<td style="padding:8px 4px 0;text-align:center;vertical-align:top;font-size:12px;line-height:1.3;color:#0f172a;">` +
        `<strong>${esc(label)}</strong><br/><span style="color:${BLUE};">${esc(
          levels[key] === 0 ? 'Not yet' : `Level ${levels[key]}`
        )}</span></td>`
    ).join('') +
    `</tr>`;
  return (
    `<table role="img" aria-label="${esc(label)}" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;margin:0 auto;">` +
    `<tbody aria-hidden="true">${rows}${foot}</tbody></table>`
  );
}

/** The full report as email HTML, leading with the score. */
export function renderReportEmail(name: string, result: QuizResult, siteUrl = 'https://worksmart-ai.co.uk'): string {
  const r = buildReport(result);
  const p = (text: string, style = '') => `<p style="margin:0 0 12px;${style}">${esc(text)}</p>`;
  const h2 = (text: string) => `<p style="margin:28px 0 12px;font-size:18px;font-weight:700;">${esc(text)}</p>`;
  const headlines = r.patterns.map((pt) => pt.headline).join('. ');
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
        `<div style="margin:0 0 20px;padding:0 0 0 14px;border-left:4px solid ${ORANGE};">` +
        `<p style="margin:0 0 2px;font-size:18px;font-weight:700;color:${BLUE};">${esc(head)}</p>` +
        p(`${pr.label} is ${pr.question}.`, 'font-size:14px;color:#64748b;') +
        (pr.definition ? p(pr.definition) : '') +
        (pr.knowledgeNote ? p(pr.knowledgeNote, 'font-size:14px;color:#475569;') : '') +
        (pr.next ? p(pr.next, 'font-weight:600;') : '') +
        checks +
        `</div>`
      );
    })
    .join('');
  const keyHtml =
    `<table cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:14px;">` +
    LEVELS.map(
      (l) =>
        `<tr><td style="padding:6px 10px 6px 0;vertical-align:top;width:28px;"><span style="display:inline-block;width:24px;height:24px;line-height:24px;border-radius:12px;background:${BLUE};color:#fff;text-align:center;font-weight:700;">${l.level}</span></td>` +
        `<td style="padding:6px 0;vertical-align:top;"><strong>${esc(l.name)}</strong><br/>${esc(l.summary)}</td></tr>`
    ).join('') +
    `</table>`;
  const checkUrl = `${siteUrl.replace(/\/$/, '')}${CHECK_HREF}`;
  return [
    `<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>`,
    `<body style="margin:0;padding:24px 12px;font-family:system-ui,-apple-system,sans-serif;font-size:16px;line-height:1.6;color:#0f172a;background:#f8fafc;">`,
    // Preheader: the preview line in the inbox.
    `<div style="display:none;max-height:0;overflow:hidden;">${esc(headlines)}</div>`,
    `<div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:28px;">`,
    `<p style="margin:0 0 4px;font-size:13px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:${ORANGE};">Your AI Use Hierarchy profile</p>`,
    `<p style="margin:0 0 8px;font-size:24px;line-height:1.3;font-weight:700;color:${BLUE};">${esc(profileLine(result.levels))}</p>`,
    r.patterns
      .map((pt) => `<p style="margin:0 0 4px;font-size:18px;font-weight:700;">${esc(pt.headline)}</p>`)
      .join(''),
    `<div style="margin:24px 0 8px;">${renderProfileDiagram(result.levels)}</div>`,
    `<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>`,
    p(`Hi ${name}, here's what your answers show.`),
    p(
      'You answered for three things: what you can do with AI (capability), whether you do it on your own (confidence), and whether you do it safely (compliance). Each one sits on a five-level scale, and most people are at different levels on each.'
    ),
    r.policyMessage ? p(r.policyMessage, `padding:12px;background:#fff7ed;border-radius:8px;`) : '',
    h2('Where to start'),
    r.patterns.map((pt) => `<p style="margin:0 0 4px;font-weight:700;">${esc(pt.headline)}</p>${p(pt.start)}`).join(''),
    h2('Measure by measure'),
    pillarHtml,
    r.selfReportNote ? p(r.selfReportNote, 'font-size:14px;color:#475569;') : '',
    h2('How the levels work'),
    keyHtml,
    `<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;"/>`,
    p(r.closing),
    `<p style="margin:0 0 20px;"><a href="${checkUrl}" style="display:inline-block;background:${ORANGE};color:#ffffff;font-weight:600;text-decoration:none;padding:10px 16px;border-radius:8px;">Book your free AI Capability Check &rarr;</a></p>`,
    p(FOLLOW_UP_NOTE, 'font-size:14px;color:#475569;'),
    `<p style="margin:0;">The WorkSmart-AI Team<br/><a href="${siteUrl}" style="color:${BLUE};">worksmart-ai.co.uk</a></p>`,
    `</div></body></html>`,
  ].join('');
}
