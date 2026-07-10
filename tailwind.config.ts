import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Near-black neutrals: Linear precision, warmed only by the product accent.
        ink: {
          950: "#09090b",
          925: "#0c0c0f",
          900: "#111113",
          850: "#161618",
          800: "#202024",
          700: "#2c2c31",
          600: "#3f3f46",
          500: "#71717a",
          400: "#8b8b95",
          300: "#a1a1aa",
          200: "#d4d4d8",
          100: "#f4f4f5",
        },
        // Cursor warmth, reserved for primary actions and meaningful signals.
        forktty: {
          DEFAULT: "#f28c52",
          soft: "#ffa56f",
          deep: "#d97038",
        },
        // ANSI semantic set — used for real status meaning, not decoration
        signal: {
          green: "#a9b665",
          aqua: "#89b482",
          cyan: "#7daea3",
          yellow: "#d8a657",
          orange: "#e78a4e",
          red: "#ea6962",
          magenta: "#d3869b",
        },
      },
      fontFamily: {
        // Product hierarchy follows a precise modern grotesque.
        display: ['var(--font-inter)', "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        // The literal terminal voice: code, chrome, statusline, chips.
        mono: ['var(--font-plex-mono)', '"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        sans: ['var(--font-inter)', "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(242,140,82,0.20), 0 12px 44px -20px rgba(242,140,82,0.42)",
        panel: "0 0 0 1px rgba(255,255,255,0.025) inset, 0 24px 80px -40px rgba(0,0,0,0.95)",
        focus: "0 0 0 1px rgba(242,140,82,0.48), 0 0 36px -14px rgba(242,140,82,0.38)",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        reveal: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        blink: "blink 1.1s step-end infinite",
        reveal: "reveal 0.72s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
