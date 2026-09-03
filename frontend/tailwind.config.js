/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "pacific": ["Pacifico", "sans-serif"],
        "poppins": ["Poppins", "sans-serif"],
        "inter": ["Inter", "sans-serif"],
        "playfair": ["Playfair Display", "serif"]
      },
      colors: {
        "primary": "#06B6D4",
        "primary-dark": "#0891B2",
        "secondary": "#1E293B",
        "accent": "#F97316",
        "light-bg": "#F8FAFC",
        "card-bg": "#FFFFFF"
      },
      boxShadow: {
        "soft": "0 4px 6px rgba(0, 0, 0, 0.07)",
        "medium": "0 10px 15px rgba(0, 0, 0, 0.1)",
        "lg": "0 20px 25px rgba(0, 0, 0, 0.15)"
      }
    },
  },
  plugins: [],
}