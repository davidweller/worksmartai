import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';
import typographyPlugin from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--aw-color-primary)',
        secondary: 'var(--aw-color-secondary)',
        accent: 'var(--aw-color-accent)',
        'accent-hover': 'var(--aw-color-accent-hover)',
        heading: 'var(--aw-color-text-heading)',
        default: 'var(--aw-color-text-default)',
        muted: 'var(--aw-color-text-muted)',
        page: 'var(--aw-color-bg-page)',
        section: 'var(--aw-color-bg-section)',
        card: 'var(--aw-color-bg-card)',
        elevated: 'var(--aw-color-bg-card-elevated)',
        brand: 'var(--aw-color-bg-brand)',
        border: 'var(--aw-color-border)',
        'border-strong': 'var(--aw-color-border-strong)',
        link: 'var(--aw-color-link)',
        'link-hover': 'var(--aw-color-link-hover)',
        focus: 'var(--aw-color-focus)',
      },
      fontFamily: {
        sans: ['var(--aw-font-sans, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
        serif: ['var(--aw-font-serif, ui-serif)', ...defaultTheme.fontFamily.serif],
        heading: ['var(--aw-font-heading, ui-sans-serif)', ...defaultTheme.fontFamily.sans],
      },

      animation: {
        fade: 'fadeInUp 0.65s cubic-bezier(0.22, 1, 0.36, 1) both',
      },

      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(0.5rem)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    typographyPlugin,
    plugin(({ addVariant }) => {
      addVariant('intersect', '&:not([no-intersect])');
    }),
  ],
  darkMode: 'class',
};
