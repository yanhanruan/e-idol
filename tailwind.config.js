/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wave: {
          '0%, 100%': {
            height: '50%',
          },
          '50%': {
            height: '86%', // 最大高度 (h-6)
          },
        },
        animateGlow: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        autoLift: {
          '0%, 40%, 100%': { transform: 'translateY(0)' },
          '60%, 80%': { transform: 'translateY(-5px)' },
        },
        autoGlow: {
          '0%, 40%, 100%': { opacity: '0', transform: 'scale(1.0)' },
          '60%, 80%': { opacity: '0.8', transform: 'scale(1.15)' },
        },
        autoShine: {
          '0%, 50%, 100%': { transform: 'translateX(-150%) skewX(-30deg)' },
          '65%': { transform: 'translateX(250%) skewX(-30deg)' },
        },
      },
      animation: {
        wave: 'wave 1.2s ease-in-out infinite',
        animateGlow: 'animateGlow 10s ease infinite',
        autoLift: 'autoLift 5s ease-in-out infinite',
        autoGlow: 'autoGlow 5s ease-in-out infinite',
        autoShine: 'autoShine 5s ease-in-out infinite',
      },
      // Define the custom cubic-bezier for the shine
      ease: {
        'shine': 'cubic-bezier(0.23, 1, 0.32, 1)',
      }
    },
  },
  plugins: [],
}