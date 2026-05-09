/** @type {import('tailwindcss').Config} */
// Design tokens mirror PRD §5 (extracted from live audit of home.knitup.io).
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        knitup: {
          gray: '#393939',      // primary text, logo, primary CTA bg
          lighter: '#dedede',   // card bg, dividers
          light: '#b2b2b2',     // muted text
          mGray: '#b5b5b5',     // placeholder, disabled
          bg: '#ffffff',
          bgSoft: '#f5f5f5',    // preview frame background
          accent: '#393939',    // selection ring
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['NexaBold', 'Manrope', 'sans-serif'],
      },
      fontSize: {
        // PRD §5
        h1: ['40px', { lineHeight: '1.2', fontWeight: '700' }],
        h2: ['32px', { lineHeight: '1.25', fontWeight: '700' }],
        h3: ['24px', { lineHeight: '1.3', fontWeight: '600' }],
      },
      spacing: {
        header: '88px',         // --header-h
        sidebar: '248px',       // --sidebar-w
        round: '48px',          // --round-btn
      },
      maxWidth: {
        container: '1240px',    // --container-max
      },
      borderRadius: {
        pill: '100px',          // --radius-pill
        card: '4px',            // --radius-card
        input: '2px',           // --radius-input
      },
      transitionTimingFunction: {
        knitup: 'cubic-bezier(0.645, 0.045, 0.355, 1)', // Ant default
      },
      transitionDuration: {
        fast: '150ms',
        DEFAULT: '300ms',
        slow: '500ms',
      },
    },
  },
  plugins: [],
};
