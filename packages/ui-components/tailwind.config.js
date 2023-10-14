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
        something: {
          '0%': { opacity: 0, transform: 'translateX(0px)' },
          '10%': { opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { opacity: 0, transform: `translateX(calc(100vw + 1px))` },
        },
      },
      animation: {
        flow: 'something 1s linear infinite',
      },
    },
    plugins: [],
  },
};
