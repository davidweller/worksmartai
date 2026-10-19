// Course catalogue (Source of Truth, section 2). Titles are exact: named, never numbered,
// "and" never "&". Summaries are drawn from the Course ILOs note in the vault.

export type CourseStream = 'students' | 'all-staff' | 'academic' | 'professional-services' | 'leadership';

export interface Course {
  title: string;
  stream: CourseStream;
  summary: string;
}

export const STREAM_LABELS: Record<CourseStream, string> = {
  students: 'Students',
  'all-staff': 'All staff',
  academic: 'Academic',
  'professional-services': 'Professional services',
  leadership: 'Leadership workshops',
};

export const COURSES: Course[] = [
  {
    title: 'AI Foundations and Responsible Use',
    stream: 'students',
    summary:
      'Know when AI support is appropriate in your studies, spot the risks, and prompt Copilot for reliable results.',
  },
  {
    title: 'AI Skills for the Workplace',
    stream: 'students',
    summary: 'Use AI the way employers now expect, with the judgement to know when it helps and when it doesn’t.',
  },
  {
    title: 'AI Foundations and Responsible Use',
    stream: 'all-staff',
    summary:
      'A shared understanding of AI in your role: what’s appropriate, what’s risky, and how to prompt Copilot well.',
  },
  {
    title: 'AI for Daily Workflows',
    stream: 'all-staff',
    summary: 'Draft emails and documents, run meetings and capture actions with Copilot in Outlook, Word and Teams.',
  },
  {
    title: 'AI for Summarising and Analysing',
    stream: 'all-staff',
    summary: 'Summarise documents in Word and turn data into tables and charts in Excel, checking results before use.',
  },
  {
    title: 'Building Custom AI Agents',
    stream: 'all-staff',
    summary:
      'Build reusable agents in Copilot Studio and automate multi-step tasks with clear instructions and guardrails.',
  },
  {
    title: 'Copilot Chat to 365 Copilot',
    stream: 'all-staff',
    summary:
      'What changes when you move to licensed Microsoft 365 Copilot, and how to use it safely on your own files.',
  },
  {
    title: 'Intermediate to Advanced Copilot',
    stream: 'all-staff',
    summary:
      'Go beyond drafting: complex multi-step work, reusable prompts and grounding Copilot in your own documents.',
  },
  {
    title: 'AI for Academic Content Creation',
    stream: 'academic',
    summary: 'Create and adapt teaching materials aligned to learning outcomes, checking accuracy and accessibility.',
  },
  {
    title: 'The AI-Enabled Classroom',
    stream: 'academic',
    summary:
      'Bring AI into live teaching to support discussion and active learning, and guide responsible student use.',
  },
  {
    title: 'AI for Academic Assessment',
    stream: 'academic',
    summary: 'Design assessments that hold up in an AI-enabled world, and use Copilot to support marking and feedback.',
  },
  {
    title: 'AI for Researchers',
    stream: 'academic',
    summary:
      'Use AI for literature reviews, synthesis and early writing, while judging outputs for methodological soundness.',
  },
  {
    title: 'AI for Process Improvement',
    stream: 'professional-services',
    summary: 'Map workflows, assess risk and plan where Copilot and Power Automate can redesign routine processes.',
  },
  {
    title: 'AI for Comms and Engagement',
    stream: 'professional-services',
    summary:
      'Write audience-specific communications across channels, reviewed for accuracy, inclusivity and reputation.',
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
