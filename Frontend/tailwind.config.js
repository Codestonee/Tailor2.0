/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Enligt Brand Kit: Inter för brödtext, Poppins för rubriker
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      colors: {
        // Primär Palett (Brand Kit)
        primary: {
          DEFAULT: "#0F7C8A", // Tailor Teal
          hover: "#0D6A75",   // Något mörkare för hover
          light: "#E0F2F4",   // Ljus bakgrunds-teal
          foreground: "#FFFFFF"
        },
        secondary: {
          DEFAULT: "#FFA07A", // Warm Peach
          hover: "#FF8C5E",
          light: "#FFF0E6",
        },
        // Sekundär & Neutral
        accent: {
          gold: "#E8C587",    // Soft Gold
          rose: "#D4AFB9",    // Dusty Rose
        },
        neutral: {
          50: "#F7F7F7",      // Off-White Background (Brand Kit)
          100: "#F0F0F0",
          200: "#E6E6E6",     // Light Grey borders
          300: "#B0B0B0",
          500: "#707070",     // Medium Grey text
          800: "#3F474F",     // Slate Grey
          900: "#333333",     // Dark Grey (Main text)
        },
        // Status
        status: {
          success: "#4CAF50",
          error: "#F44336",
          warning: "#FFC107"
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 124, 138, 0.08)', // Teal-tonad skugga
        'card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 0 1px rgba(0,0,0,0.1)',
        'hover': '0 10px 25px -5px rgba(15, 124, 138, 0.15)', // Teal glow vid hover
      },
      backgroundImage: {
        // Subtil gradient för hero-sektionen
        'hero-glow': 'radial-gradient(circle at 50% 0%, rgba(15, 124, 138, 0.08) 0%, rgba(255, 160, 122, 0.05) 40%, transparent 80%)',
      },
      borderRadius: {
        'brand': '8px', // Enligt Brand Kit
        'xl': '12px',
        '2xl': '16px'
      }
    },
  },
  plugins: [],
}