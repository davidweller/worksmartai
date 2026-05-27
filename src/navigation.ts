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

export const headerData: {
  links: NavMenuLink[];
  actions: CallToAction[];
} = {
  links: [
    { text: 'Home', href: '/' },
    {
      text: 'Services',
      links: [
        { text: 'Workforce Capability', href: '/services/staff-training/' },
        { text: 'Student Programmes', href: '/services/student-training/' },
        { text: 'Leadership Consulting', href: '/services/senior-consulting/' },
        { text: 'Academic Coaching', href: '/services/academic-coaching/' },
        { text: 'Events and Away Days', href: '/services/talks-workshops/' },
      ],
    },
    {
      text: 'Resources',
      links: [
        { text: 'AI Savings Calculator', href: '/roi-calculator/' },
        { text: 'AI Use Cases Guide', href: '/higher-education-guide/' },
      ],
    },
    { text: 'About', href: '/about-us/' },
    { text: 'News', href: '/news/' },
    { text: 'Contact', href: '/contact-us/' },
  ],
  actions: [{ text: 'Login', href: '/login/', variant: 'primary' }],
};

export const footerColumns: FooterColumn[] = [
  {
    title: 'Services',
    links: [
      { text: 'Workforce Capability', href: '/services/staff-training/' },
      { text: 'Student Programmes', href: '/services/student-training/' },
      { text: 'Leadership Consulting', href: '/services/senior-consulting/' },
      { text: 'Academic Coaching', href: '/services/academic-coaching/' },
      { text: 'Events and Away Days', href: '/services/talks-workshops/' },
      { text: 'The AI Partnership', href: '#ai-partnership' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { text: 'AI Savings Calculator', href: '/roi-calculator/' },
      { text: 'AI Use Cases Guide', href: '/higher-education-guide/' },
      { text: 'How our Calculator Works', href: '/how-our-calculator-works/' },
      { text: 'News', href: '/news/' },
    ],
  },
  {
    title: 'About',
    links: [
      { text: 'About Us', href: '/about-us/' },
      { text: 'Meet the Team', href: '/about-us/' },
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
};
