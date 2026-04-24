/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f7f7f8',
          100: '#eeeff1',
          200: '#d9dbe0',
          400: '#8a8d96',
          600: '#4a4d55',
          900: '#0b0b0f',
        },
        accent: {
          50: '#fdf6ec',
          100: '#faead2',
          200: '#f2d29a',
          300: '#e6b865',
          400: '#d4af7a',
          500: '#c9a55c',
          600: '#a88642',
          700: '#856734',
          800: '#634c27',
        },
      },
      boxShadow: {
        'soft': '0 10px 40px -15px rgba(16, 16, 24, 0.15)',
        'glow': '0 0 0 1px rgba(201, 165, 92, 0.35), 0 12px 30px -12px rgba(201, 165, 92, 0.35)',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 14s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
