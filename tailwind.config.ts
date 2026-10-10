import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: {
          DEFAULT: "#0A0A0A",
          card: "#101010",
          secondary: "#151515",
          hover: "#1A1A1A",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.08)",
          medium: "rgba(255, 255, 255, 0.12)",
          bright: "rgba(255, 255, 255, 0.20)",
        },
        text: {
          main: "#E5E7EB",
          secondary: "#9CA3AF",
          muted: "#737373",
        },
        brand: {
          green: "#10B981",
          red: "#F87171",
          amber: "#F59E0B",
          blue: "#60A5FA",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      borderRadius: {
        "2xl": "18px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        "card-emboss":
          "0 20px 40px -15px rgba(0,0,0,0.8), inset 0 1px 0 0 rgba(255,255,255,0.08)",
        "pill-glow":
          "0 0 25px -5px rgba(255,255,255,0.12), inset 0 1px 0 0 rgba(255,255,255,0.15)",
        "buy-glow": "0 0 20px -5px rgba(16, 185, 129, 0.25)",
        "sell-glow": "0 0 20px -5px rgba(248, 113, 113, 0.25)",
        "halt-glow": "0 0 25px -5px rgba(245, 158, 11, 0.35)",
      },
      animation: {
        "pulse-subtle": "pulse-subtle 4s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite linear",
      },
      keyframes: {
        "pulse-subtle": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
