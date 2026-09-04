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
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        background: "var(--background)", 
        surface: "var(--surface)",
        elevated: "var(--elevated)",
        sidebar: "var(--sidebar)",
        border: {
          DEFAULT: "var(--border)",
          active: "var(--border-active)",
          hover: "var(--border-hover)",
        },
        
        content: {
          primary: "var(--content-primary)",
          secondary: "var(--content-secondary)",
          muted: "var(--content-muted)",
          disabled: "var(--content-disabled)",
        },
        
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          muted: "var(--accent-muted)",
        },
        
        status: {
          success: "var(--status-success)",
          warning: "var(--status-warning)",
          danger: "var(--status-danger)",
          info: "var(--status-info)",
          verification: "var(--status-verification)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: ".8", transform: "scale(1.05)", filter: "brightness(1.2)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "pulse-glow": "pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
