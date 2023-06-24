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
        CrimsonText: ["'Crimson Text'", "serif"]
      },
      colors: {
        "primary": "#6C6327",
        "base": "#FFFEF8"
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "*": {
              color: theme("colors.primary")
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

