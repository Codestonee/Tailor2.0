import typography from '@tailwindcss/typography';
import forms from '@tailwindcss/forms';

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
        primary: { 
          DEFAULT: "#0F7C8A", 
          hover: "#0D6A75", 
          light: "#E0F2F4" 
        },
        secondary: { 
          DEFAULT: "#FFA07A", 
          hover: "#FF8C5E", 
          light: "#FFF0E6" 
        },
        neutral: { 
          50: "#F7F7F7", 
          100: "#F3F4F6", 
          200: "#D1D5DB", 
          300: "#D4D4D8", 
          400: "#9CA3AF", 
          500: "#707070", 
          600: "#52525B", 
          700: "#3F3F46", 
          800: "#1F2937", 
          900: "#111827" 
        },
        status: { 
          success: "#4CAF50", 
          error: "#F44336", 
          warning: "#FFC107" 
        }
      },
      borderRadius: { 
        'brand': '8px' 
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'gradient-x': 'gradient-x 3s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower-reverse': 'float-reverse 10s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
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
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(15px)' },
        },
      },
    },
  },
  plugins: [
    typography,
    forms,
  ],
}