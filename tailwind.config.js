/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
   darkMode: 'class', 
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
     extend: {
      fontFamily: {
        aleo: ['var(--font-aleo)', 'sans-serif'],
      },
      animation: {
        'gradient-pulse': 'gradient-pulse 5s ease-in-out infinite',
        'gradient-pulse-left': 'gradient-pulse-left 5s ease-in-out infinite',
      },
      keyframes: {
        'gradient-pulse': {
          '0%, 100%': { backgroundPosition: '50% 0%' },
          '50%': { backgroundPosition: '50% 100%' },
        },
        'gradient-pulse-left': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}