/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'grid' : 'url(./src/assets/svgs/grid.svg)'
      }
    },
    fontFamily: {
      lufga : ['Lufga'],
      lufgam : ['Lufga-Medium']
    }
  },
  plugins: [],
}

