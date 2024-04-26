/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      animation: {
        fade: "2s ease-in",
      },
    },
  },
  plugins: [require("daisyui")],
};
