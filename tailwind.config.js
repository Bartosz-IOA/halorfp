/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          primary: "var(--color-navy-primary)",
          mid: "var(--color-navy-mid)",
        },
        yellow: {
          DEFAULT: "var(--color-yellow)",
          dark: "var(--color-yellow-dark)",
        },
        surface: {
          white: "var(--color-surface-white)",
          grey: "var(--color-surface-grey)",
        },
        status: {
          complete: "var(--color-status-complete)",
          process: "var(--color-status-process)",
          failed: "var(--color-status-failed)",
          info: "var(--color-status-info)",
        },
        "off-white": "var(--color-off-white)",
        border: "var(--color-border)",
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          inverse: "var(--color-text-inverse)",
        }
      },
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '6': 'var(--space-6)',
        '8': 'var(--space-8)',
        '12': 'var(--space-12)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      fontSize: {
        xs: ['var(--text-xs)', '1.2'],
        sm: ['var(--text-sm)', '1.4'],
        base: ['var(--text-base)', '1.5'],
        md: ['var(--text-md)', '1.5'],
        lg: ['var(--text-lg)', '1.3'],
        xl: ['var(--text-xl)', '1.2'],
        '2xl': ['var(--text-2xl)', '1.1'],
        '3xl': ['1.875rem', '1.2'],
        '4xl': ['2.25rem', '1.1'],
        '5xl': ['3rem', '1.05'],
        '6xl': ['3.75rem', '1.05'],
        '7xl': ['4.5rem', '1.05'],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        modal: 'var(--shadow-modal)',
      },
      width: {
        sidebar: 'var(--sidebar-width)',
      },
      height: {
        topbar: 'var(--topbar-height)',
      }
    },
  },
  plugins: [],
}
