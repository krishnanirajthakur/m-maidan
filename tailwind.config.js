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
        primary: '#050A18',
        'day-bg': '#F8FAFC',
        accent: '#00FF88',
        alert: '#FF5F1F',
      },
      boxShadow: {
        neumorphic: '10px 10px 20px #d1d9e6, -10px -10px 20px #ffffff',
        'glass-glow': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
