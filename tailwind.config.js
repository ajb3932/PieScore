/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#C41E3A',
          light: '#E63946',
          dark: '#9B1B2F',
        },
        christmas: {
          red: '#C41E3A',
          green: '#165B33',
          gold: '#FFD700',
          darkGreen: '#0F3D23',
          lightGreen: '#2D7A4F',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-in': 'slideIn 0.3s ease-out',
        'fall': 'fall linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fall: {
          'to': { transform: 'translateY(100vh)' },
        }
      }
    },
  },
  plugins: [],
}
