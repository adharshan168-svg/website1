/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        espresso: '#2B1D17',
        cream: '#F7F1E8',
        caramel: '#B87945',
        sage: '#87917A',
      },
    },
  },
  plugins: [],
}