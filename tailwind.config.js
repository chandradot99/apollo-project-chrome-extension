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
        // Apollo Color System
        blueberry: {
          50: "#EBEFF7",
          100: "#CDC5EB",
          200: "#AB9FDF",
          300: "#8978D3",
          400: "#6E5CC9",
          500: "#5141CD", // Primary
          600: "#473CB9",
          700: "#3634B0",
          800: "#262FA8",
          900: "#00249A",
        },
        neutral: {
          0: "#FFFFFF",
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD",
          500: "#9E9E9E",
          600: "#757575",
          700: "#616161",
          800: "#424242",
          900: "#212121",
          1000: "#0A0A0A",
        },
        success: {
          50: "#EAFBE6",
          100: "#CBF4C1",
          200: "#A6EC98",
          300: "#7CE36A",
          400: "#52DC43",
          500: "#00D504",
          600: "#00C400",
          700: "#00A300",
          800: "#008500",
          900: "#006100",
        },
        error: {
          50: "#FFEDEC",
          100: "#FFC8CC",
          200: "#FF918E",
          300: "#FF6462",
          400: "#FF3A39",
          500: "#FFC1B13",
          600: "#ED0017",
          700: "#DC0011",
          800: "#C40107",
          900: "#A30000",
        },
        warning: {
          50: "#FFF4E2",
          100: "#FFE0B2",
          200: "#FFCD81",
          300: "#FFEB84E",
          400: "#FFA827",
          500: "#FF9F29",
          600: "#ED0017",
          700: "#D66F03",
          800: "#B55E22",
          900: "#8D3811",
        },
      },
      fontFamily: {
        "open-sans": ["Open Sans", "sans-serif"],
        sans: ["Open Sans", "system-ui", "sans-serif"],
      },
      fontSize: {
        "heading-3": [
          "20px",
          { lineHeight: "1.4", letterSpacing: "0.15px", fontWeight: "500" },
        ],
        subtitle: [
          "18px",
          { lineHeight: "1.4", letterSpacing: "0.15px", fontWeight: "700" },
        ],
        body: [
          "16px",
          { lineHeight: "1.5", letterSpacing: "0.5px", fontWeight: "400" },
        ],
        "body-bold": [
          "16px",
          { lineHeight: "1.5", letterSpacing: "0.25px", fontWeight: "700" },
        ],
        button: [
          "14px",
          { lineHeight: "1.4", letterSpacing: "1.25px", fontWeight: "600" },
        ],
        overline: [
          "10px",
          { lineHeight: "1.6", letterSpacing: "1.5px", fontWeight: "400" },
        ],
      },
      boxShadow: {
        button: "0 2px 4px rgba(0, 0, 0, 0.1)",
        "button-hover": "0 4px 8px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};
