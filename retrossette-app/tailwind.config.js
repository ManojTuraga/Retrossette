/******************************************************************************
NOTE: This file was created by configuring the npx create-react-compand with
the --template tailwindcss flag. As we are not using this file at the moment,
we give full credit to the creators of react at https://react.dev/ and the
creators of tailwind css at https://tailwindcss.com/
******************************************************************************/

// We are using neo retro ui for our nav bar
// please see https://github.com/maojindao55/neo-retro-ui
// for more information
const neoretroUI = require('neo-retro-ui')


module.exports = {
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [neoretroUI],
}
