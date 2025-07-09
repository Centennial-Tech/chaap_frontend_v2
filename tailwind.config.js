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
        gradient: {
          purple: 'hsl(257, 100%, 95%)',
          green: 'hsl(160, 100%, 96%)',
          red: 'hsl(0, 100%, 98%)',
          blue: 'hsl(204, 100%, 97%)',
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
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        typing: "typing 5s steps(50) infinite alternate, blink .7s infinite",
        "gradient-shift": "gradient-shift 15s ease infinite",
      },
    },
  },
  plugins: [],
};
