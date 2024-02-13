/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },
      // Define custom gradient backgrounds
      transitionTimingFunction: {
        "custom-bezier": "cubic-bezier(.81,.04,.41,1.27)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      },
      backgroundImage: {
        "gradient-male": "linear-gradient(315deg, #219be1 0%, #223a52 74%)",
        "gradient-female": "linear-gradient(315deg, #c75773 0%, #972239 74%)",
        "gradient-female-btn":
          "linear-gradient(to left top, #506526 50%, #578549 50%)",
        "gradient-male-btn":
          "linear-gradient(to left top, #005d46 50%, #007940 50%)",
      },
      colors: {
        "female-dark": "#523C2F",
        "female-light": "#b78060",
        "male-dark": "#223a52",
        "male-light": "#1f90ce",
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
