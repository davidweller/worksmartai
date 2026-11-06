// Service catalogue (Source of Truth, section 2). Prices are quoted per engagement, not published.

export interface Service {
  name: string;
  href: string;
  summary: string;
  audience: string;
  /** Free services show a "Free" badge; everything else shows a quote prompt. */
  free?: true;
  icon: string;
  /** Where the service sits in the Design your own package diagram (Source of Truth, section 2). */
  group: PackageGroup;
}

export type PackageGroup = 'start' | 'train' | 'coach' | 'build';

export const SERVICES: Service[] = [
  {
    name: 'AI Capability Check',
    href: '/health-check/',
    summary:
      'A free 30-minute call and a written report placing your team on the AI Use Hierarchy, with two or three next steps.',
    audience: 'Any public or private organisation',
    free: true,
    icon: 'tabler:clipboard-check',
    group: 'start',
  },
  {
    name: 'Workshops and Events',
    href: '/services/talks-workshops/',
    summary:
      'Face-to-face or online, from one hour to a full day: INSET, away days, leadership workshops, keynotes and talks.',
    audience: 'Staff and leaders',
    icon: 'tabler:presentation',
    group: 'train',
  },
  {
    name: 'Online courses',
    href: '/services/your-own-ai-course/',
    summary: 'Self-paced, interactive courses hosted on the WorkSmart-AI Academy or white-labelled for your own LMS.',
    audience: 'All staff, all students',
    icon: 'tabler:device-laptop',
    group: 'train',
  },
  {
    name: 'AI adoption coaching',
    href: '/services/adoption-coaching/',
    summary:
      'One-to-one or small-group coaching for senior leaders on leading AI adoption: strategy, policy and a phased roadmap.',
    audience: 'Senior leaders',
    icon: 'tabler:compass',
    group: 'coach',
  },
  {
    name: 'Academic coaching',
    href: '/services/academic-coaching/',
    summary: 'Discipline and role-specific coaching for research, writing, grant work and teaching preparation.',
    audience: 'Academics and research teams',
    icon: 'tabler:books',
    group: 'coach',
  },
  {
    name: 'Built for You',
    href: '/services/built-for-you/',
    summary:
      'Copilot agents and workflows built around your team’s critical work, with your staff trained to hand work off and collect it back.',
    audience: 'Departments and senior leaders',
    icon: 'tabler:robot',
    group: 'build',
  },
];

export const ADD_ONS = ['Monthly AI Cafe drop-ins', 'Strategic follow-up session'] as const;

export const UPSELL_LADDER = [
  { name: 'AI Capability Check', href: '/health-check/' },
  { name: 'Workshop', href: '/services/talks-workshops/' },
  { name: 'Online course', href: '/services/your-own-ai-course/' },
  { name: 'Coaching', href: '/services/academic-coaching/' },
] as const;

/** Illustrative combinations for the Design your own package section. No prices, no client names. */
export const EXAMPLE_PACKAGES = [
  {
    audience: 'Universities',
    name: 'Department launch',
    blocks: ['AI Capability Check', 'Half-day workshop', 'White-labelled staff course', 'Monthly AI Cafe drop-ins'],
  },
  {
    audience: 'Colleges',
    name: 'INSET to induction',
    blocks: ['AI Capability Check', 'INSET workshop', 'White-labelled staff course', 'Adoption coaching for leaders'],
  },
  {
    audience: 'Businesses and public sector',
    name: 'Copilot that earns its licence',
    blocks: ['AI Capability Check', 'Copilot workshop', 'A Built for You workflow', 'Strategic follow-up session'],
  },
] as const;
