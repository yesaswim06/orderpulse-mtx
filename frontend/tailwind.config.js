/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        grow: {
          primary: '#00B386',
          positive: '#00B386',
          negative: '#EB5B3C',
          text: '#44475B',
          muted: '#7C7E8C',
          border: '#E8E8E8',
          hover: '#F8F8F8',
          orange: '#F5A623',
          darkBg: '#0B0E14',
          darkCard: '#131824',
          darkBorder: '#222B3D',
          darkText: '#E5E7EB',
          darkMuted: '#8B93A7',
          darkHover: '#1A2234'
        },
        trading: {
          bg: '#0a0e17',
          card: '#111827',
          surface: '#1a2234',
          border: '#243048',
          accent: '#38bdf8',
          buy: '#10b981',
          buySoft: '#064e3b',
          sell: '#f43f5e',
          sellSoft: '#881337',
          halt: '#ef4444',
          warn: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
