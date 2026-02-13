/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          // Legacy scale mapping (Flat or Opacity based could be added here if needed)
          50: "hsl(var(--primary) / 0.1)",
          100: "hsl(var(--primary) / 0.2)",
          200: "hsl(var(--primary) / 0.3)",
          300: "hsl(var(--primary) / 0.4)",
          400: "hsl(var(--primary) / 0.5)",
          500: "hsl(var(--primary) / <alpha-value>)",
          600: "hsl(var(--primary) / 0.9)",
          700: "hsl(var(--primary) / 0.8)",
          800: "hsl(var(--primary) / 0.7)",
          900: "hsl(var(--primary) / 0.6)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        // Oman Identity
        oman: {
          red: '#D62828',
          green: '#2E7D32',
          white: '#FFFFFF',
        },
        // Legacy theme-aware colors (mapped to standard vars)
        bg: {
          primary: 'hsl(var(--background))',
          secondary: 'hsl(var(--muted))',
          surface: 'hsl(var(--card))',
          app: 'hsl(var(--background))',
        },
        text: {
          primary: 'hsl(var(--foreground))',
          secondary: 'hsl(var(--muted-foreground))',
          inverse: 'hsl(var(--primary-foreground))',
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

