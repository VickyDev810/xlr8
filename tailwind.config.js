/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to right, var(--tw-gradient-stops))',
      },
      colors: {
        dark: {
          bg: '#1a1a1a',
          text: '#ffffff',
          secondary: '#2d2d2d'
        }
      }
    },
  },
  plugins: [],
} 