import type { CallToAction } from './types';

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

const heServiceLinks: NavLink[] = [
  { text: 'Staff Training', href: '/services/staff-training/' },
  { text: 'Student Programmes', href: '/services/student-training/' },
  { text: 'Your Own AI Course', href: '/services/your-own-ai-course/' },
  { text: 'Leadership Consulting', href: '/services/senior-consulting/' },
  { text: 'Academic Coaching', href: '/services/academic-coaching/' },
  { text: 'Events and Away Days', href: '/services/talks-workshops/' },
];

const universitiesLinks: NavLink[] = [{ text: 'Overview', href: '/higher-education/' }, ...heServiceLinks];

const resourceLinks: NavLink[] = [
  { text: 'AI Calculator', href: '/roi-calculator/' },
  { text: 'AI Capability Check', href: '/health-check/' },
  { text: 'AI Use Cases Guide', href: '/higher-education-guide/' },
  { text: 'Copilot Licensing', href: '/copilot-licensing/' },
  { text: 'Copilot Glossary', href: '/copilot-glossary/' },
];

const audienceLinks: NavLink[] = [
  { text: 'Universities', href: '/higher-education/' },
  { text: 'Colleges', href: '/colleges/' },
  { text: 'Schools', href: '/schools/' },
  { text: 'Businesses', href: '/business/' },
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
    links: [...audienceLinks, { text: 'Schools packages', href: '/schools/#packages' }],
  },
  {
    title: 'Universities',
    links: universitiesLinks,
  },
  {
    title: 'Resources',
    links: [
      ...resourceLinks,
      { text: 'How our Calculator Works', href: '/how-our-calculator-works/' },
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
  schoolsContactHref: '/contact-us/',
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
