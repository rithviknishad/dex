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
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        mono: ["var(--font-roboto-mono)"],
      },
    },
    colors: {
      black: "#000",
      white: "#fff",
      brand: brandColor,
    },
    ringColor: {
      DEFAULT: brandColor[500],
    },
  },
  plugins: [],
};
