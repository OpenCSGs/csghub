/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/views/**/*.{html,js,ts,jsx,tsx}",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      '2xl': {'max': '1536px'},
      'xl': {'max': '1280px'},
      'lg': {'max': '1024px'},
      'mlg': {'max': '826px'},
      'md': {'max': '768px'},
      'sm': {'max': '640px'},
    },
  },
  plugins: [],
}

