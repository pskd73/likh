/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        CourierPrime: ["Courier Prime", "monospace"],
        Inter: ["Inter", "sans-serif"],
        Cormorant: ["'Cormorant Garamond'", "serif"]
      },
      colors: {
        "primary-700": "#6C6327",
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

