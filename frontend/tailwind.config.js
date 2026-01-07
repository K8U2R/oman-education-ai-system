/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50, #eff6ff)',
          100: 'var(--color-primary-100, #dbeafe)',
          200: 'var(--color-primary-200, #bfdbfe)',
          300: 'var(--color-primary-300, #93c5fd)',
          400: 'var(--color-primary-400, #60a5fa)',
          500: 'var(--color-primary-500, #3b82f6)',
          600: 'var(--color-primary-600, #2563eb)',
          700: 'var(--color-primary-700, #1d4ed8)',
          800: 'var(--color-primary-800, #1e40af)',
          900: 'var(--color-primary-900, #1e3a8a)',
        },
        oman: {
          red: '#D62828',
          green: '#2E7D32',
          white: '#FFFFFF',
        },
        // Theme-aware colors
        bg: {
          primary: 'var(--color-bg-primary, #ffffff)',
          secondary: 'var(--color-bg-secondary, #f9fafb)',
          tertiary: 'var(--color-bg-tertiary, #f3f4f6)',
        },
        text: {
          primary: 'var(--color-text-primary, #111827)',
          secondary: 'var(--color-text-secondary, #4b5563)',
          tertiary: 'var(--color-text-tertiary, #6b7280)',
          inverse: 'var(--color-text-inverse, #ffffff)',
        },
        border: {
          primary: 'var(--color-border-primary, #e5e7eb)',
          secondary: 'var(--color-border-secondary, #d1d5db)',
          focus: 'var(--color-border-focus, #3b82f6)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

