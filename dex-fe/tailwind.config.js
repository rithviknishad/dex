/** @type {import('tailwindcss').Config} */

const brandColor = {
  DEFAULT: "#EEFF41",
  50: "#FEFFF9",
  100: "#FDFFE4",
  200: "#F9FFBB",
  300: "#F5FF93",
  400: "#F2FF6A",
  500: "#EEFF41",
  600: "#E9FF09",
  700: "#BDD000",
  800: "#8A9800",
  900: "#576000",
};

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter"],
        mono: ["Roboto Mono"],
        display: ["Comfortaa"],
      },
      colors: {
        brand: brandColor,
      },
    },
    outlineColor: {
      DEFAULT: brandColor[500],
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@headlessui/tailwindcss")({ prefix: "ui" }),
  ],
};
