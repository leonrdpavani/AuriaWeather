// ESLint (flat config) — preset oficial do Expo.
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "dist-check/*", ".expo/*"],
  },
]);
