import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Core Palette
        background: "#07090D",
        surface: "#0D1118",
        elevated: "#121821",
        
        // Text
        content: {
          primary: "#F5F7FA",
          secondary: "#8D98A8",
          muted: "#5E6878",
        },
        
        // Borders
        border: "rgba(255, 255, 255, 0.08)",
        "border-hover": "rgba(255, 255, 255, 0.15)",
        
        // Accents
        accent: {
          DEFAULT: "#4D7CFE", // Electric blue
          hover: "#638DFE",
          muted: "rgba(77, 124, 254, 0.1)",
        },
        
        // Semantic
        status: {
          verification: "#22C55E",
          warning: "#F59E0B",
          critical: "#EF4444",
          ai: "#8B5CF6", // Violet/Indigo
          blockchain: "#06B6D4", // Cyan
        }
      },
      backgroundImage: {
        'ambient-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
        'ambient-glow': 'radial-gradient(circle at 50% 0%, rgba(77, 124, 254, 0.05) 0%, transparent 50%)',
      },
      backgroundSize: {
        'ambient-grid': '40px 40px',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
