/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{ts,tsx}'],
  // Scope every generated utility so it only applies under `.orm-root`
  // (the component already sets this class on its portals/containers).
  important: '.orm-root',
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        border: 'var(--orm-border)',
        input: 'var(--orm-input)',
        ring: 'var(--orm-ring)',
        background: 'var(--orm-background)',
        foreground: 'var(--orm-foreground)',
        primary: {
          DEFAULT: 'var(--orm-primary)',
          foreground: 'var(--orm-primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--orm-secondary)',
          foreground: 'var(--orm-secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--orm-destructive)',
          foreground: 'var(--orm-destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--orm-muted)',
          foreground: 'var(--orm-muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--orm-accent)',
          foreground: 'var(--orm-accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--orm-background)',
          foreground: 'var(--orm-foreground)',
        },
        card: {
          DEFAULT: 'var(--orm-background)',
          foreground: 'var(--orm-foreground)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [],
}


