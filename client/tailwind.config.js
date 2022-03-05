
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
        'grey-default': '#505050',
        'darker-gray': '#3b3b3b',
        'components-gray': '#6a6a6a'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
