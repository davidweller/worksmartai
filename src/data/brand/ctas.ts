// Calls to action, matched to how ready the reader is to buy (Source of Truth, section 3).

/** Outlook Bookings page for the AI Capability Check. */
export const BOOKING_URL =
  'https://outlook.office.com/book/BookaMSTeamscallwithus@worksmart-ai.co.uk/?ismsaljsauthenabled';

export const CAPABILITY_CHECK_HREF = '/health-check/';

export const CTAS = {
  primary: { text: 'Book your free AI Capability Check', href: CAPABILITY_CHECK_HREF },
  calculator: { text: 'Try the AI Savings Calculator', href: '/roi-calculator/' },
  guide: { text: 'Download the Higher Education Use Case Guide', href: '/higher-education-guide/' },
  courses: { text: 'Explore the courses', href: '/services/staff-training/' },
  events: { text: 'Get in touch about a keynote or away day', href: '/contact-us/' },
} as const;
