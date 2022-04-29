
module.exports = {
  purge: [
    ".pages/**/*.{ts,tsx}",
    "./Components/**/*.{ts,tsx}",
    "./Layout/**/*.{ts,tsx}"
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'regal-blue': '#243c5a',
        'transparent-dark': 'rgba(0, 0, 0, 0.5)',
        'grey-default': '#505050',
        'darker-grey': '#3b3b3b',
        'components-grey': '#6a6a6a',
        'select-grey': '#363636',
        'border-grey': 'rgb(46, 46, 46)'
      },
      height: {
        '44rem': '44rem',
      },
      width: {
        '34rem': '34rem',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
