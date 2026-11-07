/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        tint: 'var(--tint)',
        brand: {
          DEFAULT: 'var(--brand)',
          hover: 'var(--brand-hover)',
        },
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
        },
        'on-accent': 'var(--on-accent)',
        danger: 'var(--danger)',
        border: 'var(--border)',

        // Backwards compatibility mappings mapped directly to palette variables (no blues, no greens outside palette)
        medical: {
          50: 'var(--tint)',
          100: 'var(--tint)',
          200: 'var(--border)',
          300: 'var(--border)',
          400: 'var(--muted)',
          500: 'var(--brand)',
          600: 'var(--brand)',
          700: 'var(--brand-hover)',
          800: 'var(--brand-hover)',
          900: 'var(--text)',
          950: 'var(--text)',
        },
        teal: {
          50: 'var(--tint)',
          100: 'var(--tint)',
          200: 'var(--border)',
          500: 'var(--brand)',
          600: 'var(--brand)',
          700: 'var(--brand-hover)',
          800: 'var(--brand-hover)',
        },
        slate: {
          50: 'var(--bg)',
          100: 'var(--tint)',
          200: 'var(--border)',
          300: 'var(--border)',
          400: 'var(--muted)',
          500: 'var(--muted)',
          600: 'var(--muted)',
          700: 'var(--text)',
          800: 'var(--text)',
          900: 'var(--text)',
          950: 'var(--brand)',
        },
        navy: {
          800: 'var(--brand)',
          900: 'var(--brand-hover)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(18, 48, 58, 0.06)',
        'card': '0 2px 6px -1px rgba(18, 48, 58, 0.08)',
        'hover': '0 4px 12px -2px rgba(18, 48, 58, 0.1)',
      }
    },
  },
  plugins: [],
}
