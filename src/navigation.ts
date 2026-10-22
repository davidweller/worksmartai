import type { CallToAction } from './types';
import { CTAS } from './data/brand/ctas';
import { RESOURCES } from './data/brand/resources';
import { SERVICES } from './data/brand/services';

interface NavLink {
  text: string;
  href: string;
}

interface NavMenuLink {
  text: string;
  href?: string;
  links?: NavLink[];
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
    },
    {
      text: 'Resources',
      links: resourceLinks,
    },
    { text: 'News', href: '/news/' },
    { text: 'About', href: '/about-us/' },
    { text: 'Contact', href: '/contact-us/' },
  ],
  actions: [{ text: 'Login', href: '/login/', variant: 'primary', id: 'site-login-button' }],
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
