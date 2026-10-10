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
          darkBg: '#12141E',
          darkCard: '#1F222E',
          darkBorder: '#2E3245',
          darkText: '#E2E8F0',
          darkMuted: '#94A3B8',
          darkHover: '#2A2E3D'
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
