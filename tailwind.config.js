/** @type {import('tailwindcss').Config} */
// Design tokens do Auria Weather — fonte única de cor/raio para o NativeWind.
// Portado do antigo globals.css (Tailwind v4 @theme). Cores em oklch foram
// convertidas para rgba (React Native não interpreta oklch).
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef0ff",
          100: "#e0e3ff",
          200: "#c6caff",
          300: "#a3a6ff",
          400: "#847dfd",
          500: "#6c5cf5",
          600: "#5a3fe6",
          700: "#4c30c9",
          800: "#3f2aa2",
          900: "#362a80",
          950: "#211a4d",
        },
        accent: {
          300: "#7ee7ff",
          400: "#38d0ff",
          500: "#14b5f0",
        },
        surface: {
          DEFAULT: "#0b0a1f",
          elevated: "#14122e",
        },
        glass: {
          DEFAULT: "rgba(255,255,255,0.06)",
          strong: "rgba(255,255,255,0.10)",
          border: "rgba(255,255,255,0.10)",
        },
        ink: {
          DEFAULT: "#f5f4ff",
          muted: "rgba(214,212,230,0.66)",
          subtle: "rgba(214,212,230,0.42)",
        },
        success: "#3ddc97",
        warning: "#ffc24b",
        danger: "#ff6b81",
      },
      borderRadius: {
        xl: "20px",
        "2xl": "28px",
        "3xl": "36px",
      },
    },
  },
  plugins: [],
};
