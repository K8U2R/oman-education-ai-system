/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme colors (slate-based)
        'ide-bg': '#020617', // slate-950
        'ide-surface': '#0f172a', // slate-900
        'ide-border': '#1e293b', // slate-800
        'ide-text': '#f8fafc', // slate-100
        'ide-text-secondary': '#cbd5e1', // slate-300
        'ide-accent': '#3b82f6', // blue-500
        'ide-accent-hover': '#2563eb', // blue-600
      },
      fontFamily: {
        sans: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      spacing: {
        'header': '3rem', // 48px
        'sidebar': '4rem', // 64px
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

