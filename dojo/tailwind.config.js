/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  // Enable class-based dark mode
  darkMode: "class",

  theme: {
    extend: {
      colors: {
        header: {
          background: "rgb(var(--header-bg) / <alpha-value>)",
          surface: "rgb(var(--header-surface) / <alpha-value>)",
          text: "rgb(var(--header-text) / <alpha-value>)",
          muted: "rgb(var(--header-muted) / <alpha-value>)",
          border: "rgb(var(--header-border) / <alpha-value>)",
          primary: "rgb(var(--header-primary) / <alpha-value>)",
          accent: "rgb(var(--header-accent) / <alpha-value>)",
        },
        /**
         * Global semantic tokens (recommended usage in components)
         * e.g. bg-background, text-text, bg-primary, text-accent
         */
        background: "rgb(var(--bg-main) / <alpha-value>)",
        surface: "rgb(var(--bg-card) / <alpha-value>)",
        text: "rgb(var(--text-main) / <alpha-value>)",
        muted: "rgb(var(--text-muted) / <alpha-value>)",
        border: "rgb(var(--border-main) / <alpha-value>)",

        primary: "rgb(var(--brand-primary) / <alpha-value>)",
        accent: "rgb(var(--brand-accent) / <alpha-value>)",



        canvas: {
          track: "rgb(var(--canvas-track) / <alpha-value>)",
          stroke: "rgb(var(--canvas-stroke) / <alpha-value>)",
          text: "rgb(var(--canvas-text) / <alpha-value>)", 
        },

        /**
         * Backwards-compatible namespace (keep if already used)
         * e.g. bg-brand-bg, text-brand-text, etc.
         */
        brand: {
          bg: "rgb(var(--bg-main) / <alpha-value>)",
          surface: "rgb(var(--bg-card) / <alpha-value>)",
          text: "rgb(var(--text-main) / <alpha-value>)",
          muted: "rgb(var(--text-muted) / <alpha-value>)",
          border: "rgb(var(--border-main) / <alpha-value>)",
          primary: "rgb(var(--brand-primary) / <alpha-value>)",
          accent: "rgb(var(--brand-accent) / <alpha-value>)",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "confetti-fall": "confetti-fall linear forwards",
        "pulse-slow":
          "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "confetti-fall": {
          "0%": {
            transform: "translateY(-100vh) rotate(0deg)",
            opacity: "1",
          },
          "100%": {
            transform: "translateY(100vh) rotate(720deg)",
            opacity: "0",
          },
        },
      },
      boxShadow: {
        soft: "0 2px 15px 0 rgba(0, 0, 0, 0.1)",
        medium: "0 4px 25px 0 rgba(0, 0, 0, 0.1)",
        hard: "0 10px 40px 0 rgba(0, 0, 0, 0.15)",
        brand: "0 4px 15px rgba(var(--brand-primary), 0.2)", // Dynamic shadow
      },
    },
  },
  plugins: [],
};


