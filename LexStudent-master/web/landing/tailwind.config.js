/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#000a1e',
        navy: '#002147',
        gold: '#fed65b',
        cream: '#f5f5dc',
        sand: '#fcf9f8',
        smoke: '#1b1c1c',
        line: '#e0e0d0',
      },
      fontFamily: {
        serif: ['Newsreader', 'ui-serif', 'Georgia', 'serif'],
        sans: ['Public Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 1s ease both',
        'marquee': 'marquee 40s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'marquee': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
