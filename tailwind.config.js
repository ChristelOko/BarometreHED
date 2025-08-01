/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'rgb(var(--color-primary))',
          light: 'rgb(var(--color-primary-light))',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary))',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent))',
        },
        neutral: {
          DEFAULT: 'rgb(var(--color-neutral))',
          dark: 'rgb(var(--color-neutral-dark))',
        },
        success: {
          DEFAULT: 'rgb(var(--color-success))',
        },
        warning: {
          DEFAULT: 'rgb(var(--color-warning))',
        },
        error: {
          DEFAULT: 'rgb(var(--color-error))',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'texture': "url('https://images.pexels.com/photos/7130560/pexels-photo-7130560.jpeg?auto=compress&cs=tinysrgb&w=1600')",
      },
    },
  },
  plugins: [],
};