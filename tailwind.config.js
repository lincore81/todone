// eslint-disable-next-line 
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", defaultTheme.fontFamily.sans],
        digits: ['"Unica One"', "Manrope", defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
};

