// Sector evidence behind the problems we solve (Source of Truth, section 1).
// Statistics date quickly: re-check every six months and update lastChecked.

export interface Evidence {
  stat: string;
  claim: string;
  source: string;
  lastChecked: string;
}

export const EVIDENCE = {
  leadersStart: {
    stat: '71%',
    claim: 'of FE leaders name AI as their top challenge.',
    source: 'Jisc Leadership Survey 2025',
    lastChecked: 'Oct 2026',
  },
  unapprovedTools: {
    stat: '71%',
    claim: 'of UK employees have used unapproved consumer AI tools at work.',
    source: 'Microsoft/Censuswide, 2,003 UK employees, Oct 2025',
    lastChecked: 'Oct 2026',
  },
  teacherHours: {
    stat: '55%',
    claim: 'of UK teachers who use AI weekly say their hours are unchanged.',
    source: 'Bett/YouGov, Aug 2026',
    lastChecked: 'Oct 2026',
  },
  studentSkills: {
    stat: '68%',
    claim: 'of students say AI skills are essential, but only 48% feel staff are helping them develop them.',
    source: 'HEPI/Kortext Student Generative AI Survey 2026',
    lastChecked: 'Oct 2026',
  },
  staffDevelopment: {
    stat: '37%',
    claim: 'of HE institutions have delivered AI staff development (44% in FE).',
    source: 'Jisc Leadership Survey 2025',
    lastChecked: 'Oct 2026',
  },
  employerTraining: {
    stat: '39%',
    claim: 'of AI users have had AI training from their employer.',
    source: 'Microsoft Work Trend Index 2024 (global)',
    lastChecked: 'Oct 2026',
  },
} satisfies Record<string, Evidence>;
