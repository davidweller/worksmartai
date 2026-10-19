// Brand copy from docs/WorkSmart-AI Source of Truth.md (sections 1 and 3).
// Change the Source of Truth first, then mirror it here.

export const BRAND_NAME = 'WorkSmart-AI';

export const TAGLINE = 'AI training specialists improving capability, confidence and compliance.';

export const ONE_LINERS = {
  education:
    'WorkSmart-AI are AI specialists, helping universities, colleges and schools become more productive with AI, through staff and student training built around each institution’s own policy and tools.',
  business:
    'WorkSmart-AI helps businesses improve productivity and confidence with AI, through hands-on staff skills training, coaching and consultancy tailored to their own tools and policies.',
  generic:
    'WorkSmart-AI helps organisations become more productive with AI, through practical skills training, coaching and consultancy, from education specialists.',
} as const;

export const SUMMARY_25 =
  'WorkSmart-AI’s practical AI skills training makes staff more productive. Built by education specialists, every course is tailored to your people, policy and tools.';

export const CORE_MESSAGE =
  'AI tools only make organisations more productive when people can use them well. We teach practical AI skills on real tasks, built around your policy and tools, and track progress against published outcomes.';

export const HEADLINE_OUTCOMES = [
  { title: 'Save hours every week', icon: 'tabler:clock-hour-4' },
  { title: 'Get more from the AI tools you already pay for', icon: 'tabler:license' },
  { title: 'Confident, capable staff using AI safely', icon: 'tabler:shield-check' },
  { title: 'Proof of what your training delivered', icon: 'tabler:report-analytics' },
] as const;

export const PILLARS = [
  {
    name: 'Capability',
    meaning: 'Practical, task-based skills people use tomorrow morning.',
    measuredBy: 'Assessment scores against the learning outcomes',
    icon: 'tabler:tool',
  },
  {
    name: 'Confidence',
    meaning: 'Staff feel empowered, not anxious. Nobody needs to become a tech expert.',
    measuredBy: 'Before and after can-do self-ratings',
    icon: 'tabler:mood-smile',
  },
  {
    name: 'Compliance',
    meaning: 'Responsible, policy-aligned use leaders can stand behind.',
    measuredBy: 'Scenario questions and compliance checklists',
    icon: 'tabler:shield-check',
  },
] as const;

export const WHY_US = [
  {
    title: 'Education specialists',
    proof:
      'Both founders are former Digital Skills Leads at the University of Exeter. We know how adults learn, not just how the tools work.',
    icon: 'tabler:school',
  },
  {
    title: 'Tailored to your people, policy and tools',
    proof:
      'Every course is built around your AI policy, Microsoft 365 and Copilot setup and data context. White-labelled courses are delivered within four weeks of receiving your policy.',
    icon: 'tabler:adjustments',
  },
  {
    title: 'Task-based, not demos',
    proof:
      'Every course opens with a real task, with role-relevant value in the first ten minutes, drawn from a bank of 290 use cases across 14 staff roles.',
    icon: 'tabler:checklist',
  },
  {
    title: 'A structured path, not a one-off session',
    proof:
      'Every course is mapped to the five-level AI Use Hierarchy, and the AI Capability Check places teams on it, so everyone sees where they are and what comes next.',
    icon: 'tabler:stairs-up',
  },
  {
    title: 'Measurable results',
    proof:
      'Every course has published learning outcomes. Every Academy course reports completion, assessment scores and confidence against them.',
    icon: 'tabler:chart-bar',
  },
  {
    title: 'Your own course, on your own LMS',
    proof:
      'White-labelled courses in your branding, built around your AI policy, delivered as SCORM or xAPI, or hosted on the WorkSmart-AI Academy.',
    icon: 'tabler:brand-stackshare',
  },
] as const;

export const WHAT_WE_DONT_DO = [
  'We don’t sell or set up learning platforms. Courses go on your LMS or our WorkSmart-AI Academy.',
  'We don’t sell or implement software or Copilot licences. We train people to use what they have.',
  'We don’t build bespoke AI systems.',
] as const;

export const FOUNDERS_PROOF =
  'Both founders are former Digital Skills Leads at the University of Exeter. David holds a Master’s in Education and has a teacher-training background.';
