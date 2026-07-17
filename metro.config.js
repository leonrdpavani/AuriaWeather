// Metro — config padrão do Expo embrulhada pelo NativeWind (lê o global.css).
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Web-only: libs (vaul/radix/framer-motion) importam `tslib.default`, mas o
// build ESM do tslib não tem export `default` → "Cannot destructure '__extends'".
// Força o `tslib` pro CJS (que expõe `default` via interop). Não afeta nativo.
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "tslib") {
    return {
      type: "sourceFile",
      filePath: require.resolve("tslib/tslib.js"),
    };
  }
  const resolve = defaultResolveRequest ?? context.resolveRequest;
  return resolve(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./src/global.css" });
