/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        Martel: ['Martel', 'serif'],
        Playfair: ['Playfair Display', 'serif'],
        Sumana: ['Sumana', 'serif'],
        SpecialElite: ['Special Elite', 'cursive']
      }
    },
  },
  plugins: [],
}

