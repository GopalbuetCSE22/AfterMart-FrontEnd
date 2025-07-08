// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        // Custom animation for subtle floating particles
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0.6' },
          '25%': { transform: 'translateY(-5px) translateX(5px)', opacity: '0.7' },
          '50%': { transform: 'translateY(0) translateX(-5px)', opacity: '0.5' },
          '75%': { transform: 'translateY(5px) translateX(5px)', opacity: '0.8' },
        },
        // Tailwind's default pulse animation (included for clarity, often built-in)
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        }
      },
      animation: {
        float: 'float 6s ease-in-out infinite', // Apply the float keyframes
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Apply the pulse keyframes
      }
    },
  },
  plugins: [],
}
