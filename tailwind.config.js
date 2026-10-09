/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mentawaiDark: '#0A1610',
        mentawaiMint: '#D4F85A',
        mentawaiSage: '#1A3626',
      },
    },
  },
  plugins: [],
}