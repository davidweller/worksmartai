// Service catalogue and "from" prices (Source of Truth, section 2).

export interface Service {
  name: string;
  href: string;
  summary: string;
  audience: string;
  /** Lowest-level price, shown as "From £X". Null means free; undefined means not priced. */
  fromPrice?: number | null;
  icon: string;
}

export const SERVICES: Service[] = [
  {
    name: 'AI Capability Check',
    href: '/health-check/',
    summary: 'A free 30-minute call and a written report placing your team on the AI Use Hierarchy, with two or three next steps.',
    audience: 'Any new organisation',
    fromPrice: null,
    icon: 'tabler:clipboard-check',
  },
  {
    name: 'Workshops and Events',
    href: '/services/talks-workshops/',
    summary: 'Face-to-face or online, from one hour to a full day: INSET, away days, leadership workshops, keynotes and talks.',
    audience: 'Staff and leaders',
    fromPrice: 250,
    icon: 'tabler:presentation',
  },
  {
    name: 'Online courses',
    href: '/services/your-own-ai-course/',
    summary: 'Self-paced, interactive courses hosted on the WorkSmart-AI Academy or white-labelled for your own LMS.',
    audience: 'All staff, all students',
    fromPrice: 4995,
    icon: 'tabler:device-laptop',
  },
  {
    name: 'Adoption coaching',
    href: '/services/adoption-coaching/',
    summary: 'One-to-one or small-group coaching for senior leaders on leading AI adoption: strategy, policy and a phased roadmap.',
    audience: 'Senior leaders',
    fromPrice: 350,
    icon: 'tabler:compass',
  },
  {
    name: 'Academic coaching',
    href: '/services/academic-coaching/',
    summary: 'Discipline and role-specific coaching for research, writing, grant work and teaching preparation.',
    audience: 'Academics and research teams',
    fromPrice: 250,
    icon: 'tabler:books',
  },
];

export const ADD_ONS = ['Monthly AI Cafe drop-ins', 'Strategic follow-up session'] as const;

export const UPSELL_LADDER = [
  { name: 'AI Capability Check', href: '/health-check/' },
  { name: 'Workshop', href: '/services/talks-workshops/' },
  { name: 'Online course', href: '/services/your-own-ai-course/' },
  { name: 'AI Cafe or coaching', href: '/services/academic-coaching/' },
] as const;

export const formatFromPrice = (price: number | null | undefined) =>
  price === null ? 'Free' : price === undefined ? 'Price on application' : `From £${price.toLocaleString('en-GB')}`;

export const priceOf = (name: Service['name']) => formatFromPrice(SERVICES.find((s) => s.name === name)?.fromPrice);
