/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        teal: {
          50: '#f0fdf4',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        navy: {
          800: '#0f172a',
          900: '#020617',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(14, 165, 233, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'card': '0 10px 30px -5px rgba(14, 165, 233, 0.05), 0 4px 12px -2px rgba(15, 23, 42, 0.03)',
        'hover': '0 20px 40px -15px rgba(14, 165, 233, 0.15), 0 8px 16px -4px rgba(15, 23, 42, 0.06)',
      }
    },
  },
  plugins: [],
}
