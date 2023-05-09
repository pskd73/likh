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
        CourierPrime: ['Courier Prime', 'monospace'],
        CutiveMono: ['Cutive Mono', 'monospace'],
        OpenSans: ['Open Sans', 'sans-serif']
      },
      colors: {
        iblack: "#121212",
        iwhite: "#ccc200",
        "primary-700": "#5C531B",
        "primary-500": "#CDC596",
        "primary-400": "#E9E3C2",
        "base": "#FFFEF8"
      },
      fontSize: {
        sm: "16px",
        base: "20px",
        lg: "24px"
      }
    }
  },
  plugins: [],
}

