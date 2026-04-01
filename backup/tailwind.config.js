/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        candy: {
          pink: '#FF6B9D',
          purple: '#A855F7',
          yellow: '#FBBF24',
          blue: '#38BDF8',
          green: '#34D399',
          orange: '#FB923C',
          mint: '#86EFAC',
          lavender: '#C4B5FD',
        },
        pastel: {
          pink: '#FDE8F0',
          purple: '#F3E8FF',
          yellow: '#FEF9C3',
          blue: '#DBEAFE',
          green: '#D1FAE5',
          orange: '#FFEDD5',
        },
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
      scale: {
        '115': '1.15',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 4px 24px rgba(0,0,0,0.07)',
        'candy': '0 4px 24px rgba(168,85,247,0.3)',
        'candy-lg': '0 8px 40px rgba(168,85,247,0.4)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
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
      },
    },
  },
  plugins: [],
}
