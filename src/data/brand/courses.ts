// Course catalogue (Source of Truth, section 2). Titles are exact: named, never numbered,
// "and" never "&". Summaries are drawn from the Course ILOs note in the vault.

export type CourseStream = 'students' | 'all-staff' | 'teaching-research' | 'teams-functions' | 'leadership';

export interface Course {
  title: string;
  stream: CourseStream;
  summary: string;
}

export const STREAM_LABELS: Record<CourseStream, string> = {
  students: 'Students',
  'all-staff': 'All staff',
  'teaching-research': 'Teaching and research',
  'teams-functions': 'Teams and functions',
  leadership: 'Leadership workshops',
};

export const COURSES: Course[] = [
  {
    title: 'AI Skills for Employability',
    stream: 'students',
    summary:
      'Use AI to research employers, tailor applications and prepare for interviews, then show employers what you can do.',
  },
  {
    title: 'AI Foundations and Responsible Use',
    stream: 'all-staff',
    summary:
      'A shared understanding of AI in your role: what’s appropriate, what’s risky, and how to prompt Copilot well.',
  },
  {
    title: 'AI for Microsoft 365 Apps',
    stream: 'all-staff',
    summary:
      'Use Copilot across Outlook, Teams, Word, Excel and PowerPoint, grounded in the right files and checked before use.',
  },
  {
    title: 'Intermediate to Advanced Copilot',
    stream: 'all-staff',
    summary:
      'Go beyond drafting: complex multi-step work, reusable prompts and grounding Copilot in your own documents.',
  },
  {
    title: 'AI for Lesson and Lecture Preparation',
    stream: 'teaching-research',
    summary: 'Create and adapt teaching materials aligned to learning outcomes, checking accuracy and accessibility.',
  },
  {
    title: 'AI for Assessment and Feedback',
    stream: 'teaching-research',
    summary:
      'Design assessments that hold up in an AI-enabled world, and turn marking notes into personalised feedback at scale.',
  },
  {
    title: 'AI for Researchers',
    stream: 'teaching-research',
    summary:
      'Search, screen and synthesise literature with every claim traced to its source, and disclose your AI use correctly.',
  },
  {
    title: 'AI for Communications and Marketing',
    stream: 'teams-functions',
    summary:
      'Plan a multi-channel campaign from one brief, hold your brand voice across audiences and review before you publish.',
  },
  {
    title: 'The AI Leadership Briefing',
    stream: 'leadership',
    summary: 'A non-technical view of what AI means for your area: where it helps, where it doesn’t, and what to ask.',
  },
  {
    title: 'The AI Strategic Roadmap',
    stream: 'leadership',
    summary: 'Move from isolated experiments to a phased, prioritised AI plan for your department or faculty.',
  },
];

export const coursesIn = (...streams: CourseStream[]) => COURSES.filter((c) => streams.includes(c.stream));
