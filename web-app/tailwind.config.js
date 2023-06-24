/** @type {import("tailwindcss").Config} */
const { createThemes } = require("tw-colors");

module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        CourierPrime: ["Courier Prime", "monospace"],
        Inter: ["Inter", "sans-serif"],
        CrimsonText: ["'Crimson Text'", "serif"],
      },
      colors: {},
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "*": {
              color: theme("colors.primary"),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    createThemes({
      base: {
        primary: "#6C6327",
        base: "#FFFEF8",
      },
      dark: {
        primary: "#FFFFFA",
        base: "#0A1128",
      },
    }),
  ],
};
