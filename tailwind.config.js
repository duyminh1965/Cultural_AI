/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc', 
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        cultural: {
          50: '#fefdf8',
          100: '#fdf9e7',
          200: '#faf1c3',
          300: '#f6e394',
          400: '#f0d052',
          500: '#e8b932',
          600: '#d19a1a',
          700: '#b07c17',
          800: '#8f621a',
          900: '#77511a',
        },
        earth: {
          50: '#f6f7f2',
          100: '#e9ebe2',
          200: '#d5d9c6',
          300: '#b8c0a1',
          400: '#9ca57d',
          500: '#7f8859',
          600: '#656c45',
          700: '#505538',
          800: '#42462f',
          900: '#393c29',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'pulse-gentle': 'pulseGentle 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};