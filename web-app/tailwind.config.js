/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        SpecialElite: ["Special Elite", "cursive"],
        CourierPrime: ["Courier Prime", "monospace"],
        Inter: ["Inter", "sans-serif"]
      },
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
      })
    }
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
}

