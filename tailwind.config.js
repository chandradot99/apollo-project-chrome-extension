/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/**/*.html"],
  theme: {
    extend: {
      colors: {
        extension: {
          primary: "#3b82f6",
          secondary: "#64748b",
          accent: "#f59e0b",
        },
      },
    },
  },
  plugins: [],
};
