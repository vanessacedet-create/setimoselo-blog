/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Bordô principal
        bordo: {
          DEFAULT: '#7a221e',
          dark:    '#621510',
          light:   '#9b3530',
        },
        // Dourado metálico
        ouro: {
          DEFAULT: '#d0ab58',
          dark:    '#aa8737',
          light:   '#e8c97a',
          pale:    '#feeb9c',
        },
        // Neutros
        cream:    '#fdf8f0',
        parchment:'#f5ede0',
        ink:      '#121212',
      },
      fontFamily: {
        display: ['Cormorant', 'Cormorant Garamond', 'Georgia', 'serif'],
        serif:   ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:    ['Lato', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grad-bordo': 'linear-gradient(135deg, #7a221e 0%, #621510 100%)',
        'grad-ouro':  'linear-gradient(135deg, #d0ab58 0%, #aa8737 100%)',
      },
    },
  },
  plugins: [],
}
