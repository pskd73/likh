/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        SpecialElite: ['Special Elite', 'cursive'],
        JetBrainsMono: ['JetBrains Mono', 'monospace']
      },
      colors: {
        iblack: "#121212",
        iwhite: "#ccc200"
      }
    }
  },
  plugins: [],
}

