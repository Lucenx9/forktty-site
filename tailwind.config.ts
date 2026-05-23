import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#08090b",
          900: "#0c0e12",
          850: "#101318",
          800: "#151921",
          700: "#1d222c",
          600: "#262c39",
          500: "#3a4252",
          400: "#5b6478",
          300: "#8a93a6",
          200: "#b9c0cf",
          100: "#e3e7ef",
        },
        ember: {
          DEFAULT: "#ff7a2a",
          soft: "#ffb27a",
          deep: "#c54a00",
        },
        signal: {
          green: "#7fe3a3",
          cyan: "#5fc7d9",
          violet: "#b48cff",
          yellow: "#f3c969",
        },
      },
      fontFamily: {
        display: ['"JetBrains Mono"', '"Fira Code"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        sans: ['"Inter Tight"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(255,122,42,0.18), 0 8px 32px -12px rgba(255,122,42,0.35)",
        panel: "0 1px 0 rgba(255,255,255,0.04) inset, 0 24px 48px -32px rgba(0,0,0,0.7)",
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
        "radial-ember":
          "radial-gradient(60% 50% at 50% 0%, rgba(255,122,42,0.18) 0%, rgba(255,122,42,0) 70%)",
      },
    },
  },
  plugins: [],
};

export default config;
