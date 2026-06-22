/**
 * Config dinâmica por variante (Expo). Lê o `app.json` como base (`config`) e
 * troca nome + identificador conforme `APP_VARIANT` (definido por perfil no
 * eas.json). Assim dev, preview e produção podem coexistir no mesmo aparelho
 * sem um sobrescrever o outro.
 *
 *   development → "Auria Weather (Dev)"     · com.auria.weather.dev
 *   preview     → "Auria Weather (Preview)" · com.auria.weather.preview
 *   production  → "Auria Weather"           · com.auria.weather
 */
const VARIANT = process.env.APP_VARIANT ?? "production";

const IDS = {
  development: "com.auria.weather.dev",
  preview: "com.auria.weather.preview",
  production: "com.auria.weather",
};

const NAMES = {
  development: "Auria Weather (Dev)",
  preview: "Auria Weather (Preview)",
  production: "Auria Weather",
};

const id = IDS[VARIANT] ?? IDS.production;
const name = NAMES[VARIANT] ?? NAMES.production;

module.exports = ({ config }) => ({
  ...config,
  name,
  ios: { ...config.ios, bundleIdentifier: id },
  android: { ...config.android, package: id },
});
