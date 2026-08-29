import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      colors: {
        background: "var(--background)", 
        surface: "var(--surface)",
        elevated: "var(--elevated)",
        border: "var(--border)",
        "border-hover": "var(--border-hover)",
        
        content: {
          primary: "var(--content-primary)",
          secondary: "var(--content-secondary)",
          muted: "var(--content-muted)",
        },
        
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          muted: "var(--accent-muted)",
        },
        
        status: {
          verification: "var(--status-verification)",
          warning: "var(--status-warning)",
          critical: "var(--status-critical)",
          ai: "var(--status-ai)",
          blockchain: "var(--status-blockchain)"
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
