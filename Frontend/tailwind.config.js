/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: { DEFAULT: "#0F7C8A", hover: "#0D6A75", light: "#E0F2F4" },
        secondary: { DEFAULT: "#FFA07A", hover: "#FF8C5E", light: "#FFF0E6" },
        neutral: { 50: "#F7F7F7", 200: "#D1D5DB", 500: "#707070", 800: "#1F2937", 900: "#111827" },
        status: { success: "#4CAF50", error: "#F44336", warning: "#FFC107" }
      },
      borderRadius: { 'brand': '8px' },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'gradient-x': 'gradient-x 2s ease infinite', // Lite snabbare shimmer
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
              'background-size': '200% 200%',
              'background-position': 'left center'
          },
          '50%': {
              'background-size': '200% 200%',
              'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
}