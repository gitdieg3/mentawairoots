/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warna Mentawai Hantage (Web Depan)
        mentawaiDark: '#0B2B20',
        mentawaiSage: '#3D7A5A',
        mentawaiMint: '#59C394',
        mentawaiGold: '#E5A93C',
        mentawaiBone: '#FAF8F5',
        // Warna CMS Admin (TqmTravel)
        tqmNavy: '#142c54',
        tqmYellow: '#f2c318',
      }
    },
  },
  plugins: [],
}