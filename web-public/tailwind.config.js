/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "primary-700": "#6C6327",
        "primary-500": "#CDC596",
        "primary-400": "#E9E3C2",
        "base": "#FFFEF8"
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "*": {
              color: theme("colors.primary-700")
            },
          }
        }
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
}
