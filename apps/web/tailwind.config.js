/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff9e6", 100: "#ffedb3", 200: "#ffe080",
          300: "#ffd24d", 400: "#ffc51a", 500: "#FFD700",
          600: "#cc9900", 700: "#996600", 800: "#664400", 900: "#332200"
        },
        dark: {
          50: "#1a1a1a", 100: "#141414", 200: "#0f0f0f",
          300: "#0a0a0a", 400: "#080808", 500: "#050505"
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui"],
        mono: ["var(--font-geist-mono)", "monospace"]
      }
    }
  },
  plugins: []
}
