/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#fff1f0',
          100: '#ffe4e1',
          200: '#ffc9c1',
          300: '#ffa192',
          400: '#ff7b6b',
          500: '#ff4d37',
          600: '#ed3520',
          700: '#c52a18',
          800: '#9c2417',
          900: '#7e2217',
        },
      },
      keyframes: {
        typing: {
          "0%": {
            width: "0%",
            visibility: "hidden",
          },
          "100%": {
            width: "100%",
          },
        },
        blink: {
          "50%": {
            borderColor: "transparent",
          },
          "100%": {
            borderColor: "white",
          },
        },
      },
      animation: {
        typing: "typing 5s steps(50) infinite alternate, blink .7s infinite",
      },
    },
  },
  plugins: [],
};
