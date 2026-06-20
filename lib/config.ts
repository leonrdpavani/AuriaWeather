/**
 * Configuração / env do app. Único lugar que lê process.env.
 * Nada de segredo no client: só exponha aqui o que tiver prefixo NEXT_PUBLIC_.
 */
export const config = {
  appName: "Auria Weather",
  /** Base da API Node (futuro). Vazio = modo mock. */
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  /** Cidade carregada por padrão quando não há geolocalização. */
  defaultCity: "Montreal",
} as const;

/** true enquanto não houver backend configurado — usamos dados mock. */
export const isMockMode = config.apiBaseUrl === "";
