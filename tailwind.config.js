/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E8449',
        primaryLight: '#E8F5E9',
        accent: '#FFC107',
      },
    },
  },
  plugins: [],
}
