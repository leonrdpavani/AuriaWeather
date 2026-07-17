/**
 * Babel — Expo SDK 56 + NativeWind v4.
 *
 * `babel-preset-expo` já configura automaticamente o plugin do Reanimated 4
 * (via react-native-worklets), então NÃO o adicionamos manualmente.
 * `jsxImportSource: "nativewind"` + o preset "nativewind/babel" habilitam o
 * `className` nos componentes React Native.
 */
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
