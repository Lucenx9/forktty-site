import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // warm, gruvbox-material-flavoured neutrals — never blue-slate
        ink: {
          950: "#15140f",
          925: "#181712",
          900: "#1b1a15",
          850: "#211f19",
          800: "#28251e",
          700: "#363127",
          600: "#4a4336",
          500: "#8c8068",
          400: "#9c8f76",
          300: "#a89984",
          200: "#cabfa6",
          100: "#ece3d4",
        },
        // primary accent: terminal orange, not the old violet
        forktty: {
          DEFAULT: "#e78a4e",
          soft: "#f0a868",
          deep: "#c2703a",
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
        // Engineered display voice — Martian Mono — for the big moments.
        display: ['var(--font-martian)', '"IBM Plex Mono"', "ui-monospace", "monospace"],
        // The literal terminal voice: code, chrome, statusline, chips.
        mono: ['var(--font-plex-mono)', '"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        // Plex Sans carries long-form prose — readable body.
        sans: ['var(--font-plex-sans)', '"IBM Plex Sans"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(231,138,78,0.25), 0 10px 40px -16px rgba(231,138,78,0.35)",
        panel: "0 1px 0 rgba(255,255,255,0.03) inset, 0 24px 48px -32px rgba(0,0,0,0.8)",
        focus: "0 0 0 1px rgba(231,138,78,0.45), 0 0 38px -10px rgba(231,138,78,0.32), inset 0 0 0 1px rgba(231,138,78,0.10)",
      },
      keyframes: {
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        reveal: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(-50%,0,0) scale(1)" },
          "50%": { transform: "translate3d(-46%, -3%, 0) scale(1.08)" },
        },
      },
      animation: {
        blink: "blink 1.1s step-end infinite",
        reveal: "reveal 0.72s cubic-bezier(0.22, 1, 0.36, 1) both",
        drift: "drift 24s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
