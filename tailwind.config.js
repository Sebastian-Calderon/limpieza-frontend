/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#0d2952',
        'aqua-bubbles': '#3ec6e0',
        'foam': '#f0fbfd',
        'green-leaf': '#5abf72',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['DM Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}