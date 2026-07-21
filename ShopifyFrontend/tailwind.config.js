/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bricolage Grotesque', 'sans-serif'],
        body: ['Hanken Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        'ecom-bg': '#0E0B16',
        'ecom-bg-2': '#141022',
        'ecom-surface': '#1A1428',
        'ecom-surface-2': '#201833',
        'ecom-violet': '#8B5CF6',
        'ecom-violet-deep': '#6D28D9',
        'ecom-violet-soft': '#C4B5FD',
        'ecom-lav': '#B9A8F0',
        'ecom-text': '#F4F1FB',
        'ecom-muted': '#9A92AE',
        'ecom-gold': '#E8B765',
      },
    },
  },
  plugins: [],
};
