/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 950: "#060b1a", 900: "#0a1128", 800: "#0f1a3a", 700: "#17255a", 600: "#22346f" },
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Manrope", "DM Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
