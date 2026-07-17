/**
 * Paleta em valores crus (hex/rgba) para uso IMPERATIVO — ícones (lucide/SVG),
 * gradientes (expo-linear-gradient) e desenho com react-native-svg, que não
 * leem `className` do NativeWind. Espelha os tokens de tailwind.config.js.
 */
export const palette = {
  brand: {
    300: "#a3a6ff",
    400: "#847dfd",
    500: "#6c5cf5",
  },
  accent: {
    300: "#7ee7ff",
    400: "#38d0ff",
    500: "#14b5f0",
  },
  surface: "#0b0a1f",
  surfaceElevated: "#14122e",
  glass: "rgba(255,255,255,0.06)",
  glassStrong: "rgba(255,255,255,0.10)",
  glassBorder: "rgba(255,255,255,0.10)",
  ink: "#f5f4ff",
  inkMuted: "rgba(214,212,230,0.66)",
  inkSubtle: "rgba(214,212,230,0.42)",
  success: "#3ddc97",
  warning: "#ffc24b",
  danger: "#ff6b81",
  white: "#ffffff",
} as const;
