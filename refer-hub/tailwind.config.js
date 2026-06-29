/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ocean:  { DEFAULT: '#0E2638', mid: '#0F2D45', light: '#123A5C' },
        azure:  { DEFAULT: '#2E8FE0', deep: '#155FAA' },
        sun:    '#FFC53D',
        sky:    '#F2F8FD',
        money:  '#1B7F43',
        steel:  '#8BA7C0',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['Inter', 'Lato', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
