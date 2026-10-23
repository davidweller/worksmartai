import type { CallToAction } from './types';
import { CTAS } from './data/brand/ctas';
import { RESOURCES } from './data/brand/resources';
import { SERVICES, formatFromPrice } from './data/brand/services';

interface NavLink {
  text: string;
  href: string;
}

export interface NavPanelLink extends NavLink {
  /** Second line under the link, e.g. who it's for and the "from" price. */
  meta?: string;
  badge?: string;
}

export interface NavGroup {
  heading: string;
  links: NavPanelLink[];
}

interface NavMenuLink {
  text: string;
  href?: string;
  links?: NavLink[];
  /** Grouped panel; when set, the dropdown renders these columns instead of `links`. */
  groups?: NavGroup[];
  footer?: NavLink;
}

export interface FooterLink {
  text: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export type SiteSector = 'neutral' | 'he' | 'schools';

const serviceLinks: NavLink[] = [
  { text: 'All services', href: '/services/' },
  ...SERVICES.map((s) => ({ text: s.name, href: s.href })),
  { text: 'Staff courses', href: '/services/staff-training/' },
  { text: 'Student courses', href: '/services/student-training/' },
];

const serviceGroups: NavGroup[] = [
  {
    heading: 'How we work',
    links: SERVICES.map((s) => ({
      text: s.name,
      href: s.href,
      // The free check carries a badge instead of a price.
      ...(s.fromPrice === null
        ? { meta: s.audience, badge: formatFromPrice(s.fromPrice) }
        : { meta: `${s.audience} · ${formatFromPrice(s.fromPrice)}` }),
    })),
  },
  {
    heading: 'Courses',
    links: [
      { text: 'Staff courses', href: '/services/staff-training/' },
      { text: 'Student courses', href: '/services/student-training/' },
      { text: 'Your own AI course', href: '/services/your-own-ai-course/' },
    ],
  },
];

const resourceLinks: NavLink[] = Object.values(RESOURCES)
  .filter((r) => r.href !== CTAS.primary.href)
  .map((r) => ({ text: r.name, href: r.href }));

const audienceLinks: NavLink[] = [
  { text: 'Universities', href: '/higher-education/' },
  { text: 'Colleges', href: '/colleges/' },
  { text: 'Schools and trusts', href: '/schools/' },
  { text: 'Businesses and public sector', href: '/business/' },
];

export const headerData: {
  links: NavMenuLink[];
  actions: CallToAction[];
} = {
  links: [
    {
      text: 'Who we work with',
      links: audienceLinks,
    },
    {
      text: 'Services',
      // The overview page stays in the footer and the service-page back links, not the dropdown.
      links: serviceLinks.filter((l) => l.href !== '/services/'),
      groups: serviceGroups,
      footer: { text: 'Not sure? Start with the free AI Capability Check.', href: CTAS.primary.href },
    },
    {
      text: 'Resources',
      links: resourceLinks,
    },
    { text: 'News', href: '/news/' },
    { text: 'About', href: '/about-us/' },
    { text: 'Contact', href: '/contact-us/' },
  ],
  // Orange is reserved for the Capability Check; Login is a plain text link at the far right.
  actions: [
    { text: 'Free AI Capability Check', href: CTAS.primary.href, variant: 'primary' },
    { text: 'Login', href: '/login/', variant: 'link', id: 'site-login-button' },
  ],
};

export const footerColumns: FooterColumn[] = [
  {
    title: 'Who we work with',
    links: audienceLinks,
  },
  {
    title: 'Services',
    links: serviceLinks,
  },
  {
    title: 'Resources',
    links: [
      { text: CTAS.primary.text.replace('Book your free ', ''), href: CTAS.primary.href },
      ...resourceLinks,
      { text: 'How the AI Savings Calculator works', href: '/how-our-calculator-works/' },
      { text: 'News', href: '/news/' },
    ],
  },
  {
    title: 'About',
    links: [
      { text: 'About Us', href: '/about-us/' },
      { text: 'Contact', href: '/contact-us/' },
      { text: 'Login', href: '/login/' },
    ],
  },
];

export const footerLegalLinks: FooterLink[] = [
  { text: 'Privacy Policy', href: '/privacy-policy/' },
  { text: 'Cookie Policy', href: '/cookie-policy/' },
  { text: 'Cookie Settings', href: '#cookie-settings' },
  { text: 'Terms of Service', href: '/terms-of-service/' },
  { text: 'Accessibility Statement', href: '/accessibility-statement/' },
  { text: 'Modern Slavery', href: '/modern-slavery/' },
  { text: 'EDI', href: '/equality-diversity-inclusion/' },
  { text: 'Sustainability', href: '/sustainability/' },
  { text: 'Insurance', href: '/insurance-statement/' },
];

export const footerData = {
  columns: footerColumns,
  legalLinks: footerLegalLinks,
  contactEmail: 'hello@worksmart-ai.co.uk',
  linkedInUrl: 'https://www.linkedin.com/company/worksmart-ai-ltd',
  healthCheckHref: '/health-check/',
};

/** Infer sector from URL path for layout defaults. */
export function inferSectorFromPath(pathname: string): SiteSector {
  const path = pathname.replace(/\/$/, '') || '/';
  if (path === '/' || path === '') return 'neutral';
  if (path.startsWith('/schools')) return 'schools';
  if (
    path.startsWith('/higher-education') ||
    path.startsWith('/services') ||
    path.startsWith('/health-check') ||
    path.startsWith('/higher-education-guide') ||
    path.startsWith('/roi-calculator') ||
    path.startsWith('/copilot-licensing') ||
    path.startsWith('/copilot-glossary')
  ) {
    return 'he';
  }
  return 'neutral';
}
