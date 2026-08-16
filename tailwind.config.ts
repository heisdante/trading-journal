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
          bg: "#07111f",
          panel: "#0b1728",
          panel2: "#0f2035",
          line: "#1b3552",
          text: "#d5f3ff",
          muted: "#7f9bb2",
          cyan: "#19d3ff",
          green: "#35f29a",
          red: "#ff5b7c",
          amber: "#f7c948",
        },
      },
      boxShadow: {
        glow: "0 0 24px rgba(25, 211, 255, 0.16)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
