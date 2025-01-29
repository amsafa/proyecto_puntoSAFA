/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#1D2C4B',
        'customGreen': '#F0F4EF',
        'customTeal': '#6BBCB7',



      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

