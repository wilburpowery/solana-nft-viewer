const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  mode: 'jit',
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'dark-primary': '#08041A',
        'dark-secondary': '#10142a',
        'dark-tertiary': '#12182E',
        'dark-lightest': '#22283E',
        'solana-purple': {
          DEFAULT: '#9945ff',
        },
        'solana-green': {
          DEFAULT: '#14f195',
        },
        'solana-black': {
          DEFAULT: '#232323',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
