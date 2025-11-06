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
            height: '100%', // 最大高度 (h-6)
          },
        },
      },
      animation: {
        wave: 'wave 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}