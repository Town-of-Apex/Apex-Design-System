/** @type {import('tailwindcss').Config} */
export default {
  // darkMode uses the "class" strategy — we add/remove `dark` class on <html>
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // -----------------------------------------------------------------------
      // APEX MODERN DESIGN TOKENS
      // These mirror the CSS custom properties in apex-modern.css so that
      // Tailwind utility classes stay in sync with the design system.
      // -----------------------------------------------------------------------
      colors: {
        // Brand palette
        "brand-primary": "var(--brand-primary)",
        "brand-accent": "var(--brand-accent)",

        // Official Town colors
        "town-forest-green":  "#3f873f",
        "town-hunter-green":  "#40683c",
        "town-cinnabar":      "#d75742",
        "town-baltic-blue":   "#00586f",
        "town-sunflower-gold":"#f3bd48",
        "town-grey-olive":    "#968c83",
        "town-dim-grey":      "#796e65",

        // Semantic
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error:   "var(--color-error)",
        info:    "var(--color-info)",

        // Surfaces — these use CSS vars so they respond to dark mode
        canvas:  "var(--bg-canvas)",
        surface: "var(--bg-surface)",
        inner:   "var(--bg-inner)",

        // Text
        "text-main":  "var(--text-main)",
        "text-muted": "var(--text-muted)",

        // Borders
        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",
      },

      fontFamily: {
        display: ["DM Serif Display", "serif"],
        ui:      ["Montserrat", "sans-serif"],
        body:    ["Inter", "sans-serif"],
      },

      borderRadius: {
        btn:   "6px",
        card:  "12px",
        modal: "16px",
      },

      // Spacing scale mirrors the --space-N tokens
      spacing: {
        "space-1":  "0.25rem",
        "space-2":  "0.5rem",
        "space-3":  "0.75rem",
        "space-4":  "1rem",
        "space-5":  "1.25rem",
        "space-6":  "1.5rem",
        "space-7":  "1.75rem",
        "space-8":  "2rem",
        "space-9":  "2.5rem",
        "space-10": "3rem",
        "space-11": "4rem",
        "space-12": "5rem",
      },

      maxWidth: {
        container: "1152px",
      },

      height: {
        header: "72px",
      },

      transitionDuration: {
        fast:   "100ms",
        medium: "200ms",
      },

      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
}
