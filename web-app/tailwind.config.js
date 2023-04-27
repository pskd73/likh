/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        SpecialElite: ['Special Elite', 'cursive'],
        JetBrainsMono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}

