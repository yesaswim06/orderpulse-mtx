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
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
