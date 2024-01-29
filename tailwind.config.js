/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        "6/24": "18%",
        "5/48": "10.4%",
      },
      colors: {
        "light-custom-blue": "#0354b4",
        "#3d3d3d": "#3d3d3d",
        "#212121": "#212121",
        "#181818": "#181818",
      },
    },
  },
  plugins: [],
};
