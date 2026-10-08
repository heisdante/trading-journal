import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: "var(--terminal-bg)",
          panel: "var(--terminal-panel)",
          panel2: "var(--terminal-panel2)",
          line: "var(--terminal-line)",
          text: "var(--terminal-text)",
          muted: "var(--terminal-muted)",
          cyan: "var(--terminal-cyan)",
          green: "var(--terminal-green)",
          red: "var(--terminal-red)",
          amber: "var(--terminal-amber)",
        },
      },
      boxShadow: {
        glow: "0 0 24px rgba(25, 211, 255, 0.16)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
