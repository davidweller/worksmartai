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
    'WorkSmart-AI helps organisations become more productive with AI, through practical skills training, coaching and consultancy.',
} as const;

export const SUMMARY_25 =
  'WorkSmart-AI’s practical AI skills training makes staff more productive. Built by education specialists, every course is tailored to your people, policy and tools.';

export const CORE_MESSAGE =
  'AI tools only make organisations more productive when people can use them well. We teach practical AI skills on real tasks, built around your policy and tools, and track progress against published outcomes.';

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
    title: 'AI specialists working across education for over 20 years',
    proof:
      'Both founders are former Digital Skills Leads at the University of Exeter. We know how adults learn, not just how the tools work.',
    icon: 'tabler:school',
  },
  {
    title: 'All work tailored to your people, policy and tools',
    proof:
      'Every course and workshop is built around your AI policy, your Microsoft 365 and Copilot setup and your data context, for staff and for students.',
    icon: 'tabler:adjustments',
  },
  {
    title: 'Role-specific tasks from 290 use cases',
    proof:
      'Every course opens with a real task, drawn from a bank of 290 use cases across 14 staff roles, so people see value in the first ten minutes.',
    icon: 'tabler:checklist',
  },
  {
    title: 'Personalised learning objectives agreed from the outset',
    proof: 'We agree the learning objectives with you before we start, so everyone knows what the training is for.',
    icon: 'tabler:target-arrow',
  },
  {
    title: 'All work mapped to make sure outcomes are achieved',
    proof:
      'Every course is mapped to the five-level AI Use Hierarchy. Academy courses report completion, assessment scores and confidence against the outcomes.',
    icon: 'tabler:chart-bar',
  },
  {
    title: 'White-labelled courses personalised to your policies',
    proof:
      'Courses in your branding, built around your AI policy, delivered as SCORM or xAPI, or hosted on the WorkSmart-AI Academy.',
    icon: 'tabler:brand-stackshare',
  },
] as const;

export const WHAT_WE_DONT_DO = [
  'We don’t sell or set up learning platforms. Courses go on your LMS or our WorkSmart-AI Academy.',
  'We don’t sell or implement software or Copilot licences. We train people to use what they have.',
  'We don’t build bespoke AI systems. Through Built for You, we build Copilot agents and workflows for specific team use cases, and train staff to use them.',
] as const;

export const FOUNDERS_PROOF =
  'Both founders are former Digital Skills Leads at the University of Exeter. David holds a Master’s in Education and has a teacher-training background.';
