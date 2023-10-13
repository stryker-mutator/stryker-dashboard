/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/index.html', './src/**/*.ts'],
  theme: {
    extend: {
      colors: {
        background: '#242526',
        hero_background: '#22323D',
      },
    },
  },
  plugins: [],
};
