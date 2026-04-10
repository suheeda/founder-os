/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        ink: {
          50:  "#f5f4f0",
          100: "#e8e6de",
          200: "#d0cdc0",
          300: "#b0ab99",
          400: "#8e8873",
          500: "#6e6855",
          600: "#565144",
          700: "#403d33",
          800: "#2a2822",
          900: "#161512",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
        }
      }
    },
  },
  plugins: [],
};
