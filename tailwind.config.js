/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f8f4',
          100: '#e1f0e6',
          200: '#c4e2cf',
          300: '#98cdae',
          400: '#66b087',
          500: '#439466',
          600: '#327750',
          700: '#295f41',
          800: '#244c36',
          900: '#1f3f2e',
          950: '#0e2319',
        },
        sepia: {
          50: '#faf8f5',
          100: '#f3efe6',
          200: '#e6ded0',
          300: '#d4c5b0',
          400: '#bfa78d',
          500: '#ad8d6f',
          600: '#9b765b',
          700: '#7e5e49',
          800: '#674d3d',
          900: '#544034',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 12px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
