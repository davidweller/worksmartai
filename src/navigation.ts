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
  { text: 'Workforce Capability', href: '/services/staff-training/' },
  { text: 'Student Programmes', href: '/services/student-training/' },
  { text: 'Leadership Consulting', href: '/services/senior-consulting/' },
  { text: 'Academic Coaching', href: '/services/academic-coaching/' },
  { text: 'Events and Away Days', href: '/services/talks-workshops/' },
  { text: 'AI Capability Check', href: '/health-check/' },
  { text: 'AI Use Cases Guide', href: '/higher-education-guide/' },
];

const schoolsLinks: NavLink[] = [
  { text: 'What staff gain', href: '/schools/#outcomes' },
  { text: 'Trust and safety', href: '/schools/#trust-safety' },
  { text: 'Packages', href: '/schools/#packages' },
  { text: 'Contact', href: '/contact-us/' },
];

export const headerData: {
  links: NavMenuLink[];
  actions: CallToAction[];
} = {
  links: [
    {
      text: 'Higher Education',
      href: '/higher-education/',
      links: heServiceLinks,
    },
    {
      text: 'Schools',
      href: '/schools/',
      links: schoolsLinks,
    },
    { text: 'About', href: '/about-us/' },
    { text: 'Contact', href: '/contact-us/' },
  ],
  actions: [{ text: 'Login', href: '/login/', variant: 'primary' }],
};

export const footerColumns: FooterColumn[] = [
  {
    title: 'Higher Education',
    links: [
      { text: 'HE overview', href: '/higher-education/' },
      ...heServiceLinks.slice(0, 5),
      { text: 'AI Savings Calculator', href: '/roi-calculator/' },
    ],
  },
  {
    title: 'Schools',
    links: [
      { text: 'Schools overview', href: '/schools/' },
      { text: 'Packages', href: '/schools/#packages' },
      { text: 'Trust and safety', href: '/schools/#trust-safety' },
      { text: 'Book a call', href: '/contact-us/' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { text: 'News', href: '/news/' },
      { text: 'How our Calculator Works', href: '/how-our-calculator-works/' },
      { text: 'About Us', href: '/about-us/' },
    ],
  },
  {
    title: 'About',
    links: [
      { text: 'Contact', href: '/contact-us/' },
      { text: 'Login', href: '/login/' },
    ],
  },
];

export const footerLegalLinks: FooterLink[] = [
  { text: 'Privacy Policy', href: '/privacy-policy/' },
  { text: 'Cookie Policy', href: '/cookie-policy/' },
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
    path.startsWith('/roi-calculator')
  ) {
    return 'he';
  }
  return 'neutral';
}
