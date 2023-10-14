/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/index.html', './src/**/*.ts'],
  theme: {
    extend: {
      colors: {
        background: '#242526',
        hero_background: '#22323D',
      },
      keyframes: {
        move: {
          from: { transform: 'translateX(-100px)' },
          to: { transform: 'translateX(110%)' },
        }
      },
      animation: {
        move: 'move 1s linear infinite',
      }
    },
  },
  plugins: [],
};
