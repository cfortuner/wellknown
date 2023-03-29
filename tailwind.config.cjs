/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    prefix: "daisy-",
  },
  plugins: [require("daisyui")],
};

module.exports = config;
