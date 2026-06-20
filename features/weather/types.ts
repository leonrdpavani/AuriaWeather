/**
 * Tipos da feature de clima.
 *
 * O CONTRATO de dados vem da camada lib (lib/api/weather) — reexportado aqui
 * para a feature ter um ponto único de import. Tipos puramente de UI
 * (que não existem no backend) são definidos abaixo.
 */
export type {
  WeatherData,
  DayWeather,
  HourlyPoint,
  AirQuality,
  AirQualityLevel,
  WeatherAlert,
  AlertSeverity,
  WeatherCondition,
} from "@/lib/api/weather";

export type { Unit } from "@/lib/utils/format";

/** Tema visual derivado da condição + dia/noite (usado pelo background). */
export type WeatherTheme = "day-clear" | "day-cloudy" | "night" | "storm";

/** Abas de detalhe do dia selecionado. */
export type DayTab = "hourly" | "air" | "atmosphere" | "sun";
