/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        fondo: '#0A0A0A',
        superficie: '#1A1A1A',
        'superficie-destacada': '#262626',
        acento: '#3B77BD',
        blanco: '#F4F5F7',
        'gris-secundario': '#8C8C8C',
        'gris-borde': '#2E2E2E',
        alerta: '#C1432E',
      },
      fontFamily: {
        anton: ['Anton', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'sm': '2px',
        'md': '4px',
        'lg': '8px',
      }
    },
  },
  plugins: [],
}
