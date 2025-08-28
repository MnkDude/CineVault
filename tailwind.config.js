/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.7s ease both',
        'modal-fade-in': 'fadeIn 0.4s cubic-bezier(.4,0,.2,1) both',
        'modal-scale-in': 'scaleIn 0.5s cubic-bezier(.4,0,.2,1) both',
        'slide-fade-in': 'slideFadeIn 0.5s cubic-bezier(.4,0,.2,1) both',
        'section-fade-in': 'fadeIn 1s cubic-bezier(.4,0,.2,1) both',
        'parallax-stars': 'parallaxStars 60s linear infinite',
        'light-sweep': 'lightSweep 2s linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        slideFadeIn: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        parallaxStars: {
          '0%': { backgroundPosition: '0 0, 0 0, 0 0' },
          '100%': { backgroundPosition: '1000px 0, 800px 0, 600px 0' },
        },
        lightSweep: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
