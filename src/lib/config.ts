/**
 * Configuração / env do app. Único lugar que lê process.env.
 * No Expo, variáveis expostas ao bundle usam o prefixo EXPO_PUBLIC_.
 */
export const config = {
  appName: "Auria Weather",
  /** Base da API (futuro). Vazio = modo mock. */
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "",
  /** Cidade carregada por padrão quando não há geolocalização. */
  defaultCity: "Montreal",
} as const;

/** true enquanto não houver backend configurado — usamos dados mock. */
export const isMockMode = config.apiBaseUrl === "";
