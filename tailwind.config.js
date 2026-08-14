/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        ink: '#10233f',
        brand: { 50: '#ecfdf9', 100: '#d1faef', 500: '#14b89a', 600: '#0d9a82', 700: '#0b7c6c' },
        navy: { 800: '#142b4a', 900: '#0b1d35', 950: '#071528' },
        amber: { 400: '#f4b544', 500: '#eaa01f' }
      },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      boxShadow: {
        card: '0 8px 30px rgba(15, 35, 63, .07)',
        float: '0 18px 45px rgba(7, 21, 40, .18)'
      }
    }
  },
  plugins: []
};
