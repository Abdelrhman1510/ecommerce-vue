/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#667eea',
        secondary: '#764ba2',
      },
      backgroundImage: {
        'gradient-auth': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }
    },
  },
  plugins: [],
}
