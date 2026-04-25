import { getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    { text: 'Home', href: '/' },
    { text: 'Training', href: '/training/' },
    { text: 'About Us', href: '/about-us/' },
    { text: 'News', href: '/news/' },
    { text: 'Contact Us', href: '/contact-us/' },
  ],
  actions: [{ text: 'Book a Call', href: '/book-a-call/', variant: 'primary' }],
};

export const footerData = {
  links: [
    {
      title: 'WorkSmart-AI',
      links: [
        { text: 'Home', href: '/' },
        { text: 'Training', href: '/training/' },
        { text: 'About Us', href: '/about-us/' },
        { text: 'News', href: '/news/' },
        { text: 'Contact Us', href: '/contact-us/' },
        { text: 'Book a Call', href: '/book-a-call/' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'How our Calculator Works', href: '/how-our-calculator-works/' },
        { text: 'ROI Calculator', href: '/#roi-calculator-home' },
      ],
    },
    {
      title: 'Legal & Compliance',
      links: [
        { text: 'Privacy Policy', href: '/privacy-policy/' },
        { text: 'Cookie Policy', href: '/cookie-policy/' },
        { text: 'Terms of Service', href: '/terms-of-service/' },
        { text: 'Accessibility Statement', href: '/accessibility-statement/' },
      ],
    },
    {
      title: 'Policies',
      links: [
        { text: 'Modern Slavery Statement', href: '/modern-slavery/' },
        { text: 'Equality, Diversity, Inclusion', href: '/equality-diversity-inclusion/' },
        { text: 'Sustainability Policy', href: '/sustainability/' },
        { text: 'Insurance Statement', href: '/insurance-statement/' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms of Service', href: '/terms-of-service/' },
    { text: 'Privacy Policy', href: '/privacy-policy/' },
  ],
  socialLinks: [{ ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') }],
  footNote: '(c) WorkSmart-AI. All rights reserved.',
};
