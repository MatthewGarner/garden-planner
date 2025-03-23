/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            light: '#4ade80', // light green
            DEFAULT: '#16a34a', // green
            dark: '#15803d', // dark green
          },
          secondary: {
            light: '#93c5fd', // light blue
            DEFAULT: '#3b82f6', // blue
            dark: '#2563eb', // dark blue
          },
          background: {
            light: '#f9fafb', // light gray
            DEFAULT: '#f3f4f6', // gray
            dark: '#e5e7eb', // dark gray
          }
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          display: ['Montserrat', 'sans-serif'],
        },
        spacing: {
          '128': '32rem',
          '144': '36rem',
        },
        borderRadius: {
          '4xl': '2rem',
        }
      },
    },
    plugins: [],
  }