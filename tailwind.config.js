/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      animation: {
        growFromBottom: 'growFromBottom 0.4s ease-out',
      },
      keyframes: {
        growFromBottom: {
          '0%': { transform: 'scaleY(0)', opacity: 0, transformOrigin: 'bottom' },
          '100%': { transform: 'scaleY(1)', opacity: 1, transformOrigin: 'bottom' },
        },
      },
    },
  },
  plugins: [],
}