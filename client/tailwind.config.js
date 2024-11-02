/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        glow: {
          '0%, 100%': {
            textShadow: '0 0 4px rgb(59, 130, 246), 0 0 11px rgb(59, 130, 246), 0 0 19px rgb(59, 130, 246)',
          },
          '50%': {
            textShadow: '0 0 8px rgb(59, 130, 246), 0 0 20px rgb(59, 130, 246), 0 0 30px rgb(59, 130, 246)',
          },
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [
    // Common plugins can be added here
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
}

