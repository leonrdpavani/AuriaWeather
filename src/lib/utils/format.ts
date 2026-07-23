/**
 * Formatação genérica (sem domínio): temperatura, hora, dia da semana.
 */

export type Unit = "celsius" | "fahrenheit";
export type WindUnit = "kmh" | "mph";

/** Converte uma temperatura em Celsius para a unidade pedida e arredonda. */
export function toUnit(celsius: number, unit: Unit): number {
  const value = unit === "fahrenheit" ? celsius * (9 / 5) + 32 : celsius;
  return Math.round(value);
}

/** "15 km/h" / "9 mph" — velocidade de vento formatada a partir de km/h. */
export function formatWind(kph: number, unit: WindUnit = "kmh"): string {
  if (unit === "mph") return `${Math.round(kph * 0.621371)} mph`;
  return `${Math.round(kph)} km/h`;
}

/** "19°" — temperatura formatada com o símbolo de grau. */
export function formatTemp(celsius: number, unit: Unit = "celsius"): string {
  return `${toUnit(celsius, unit)}°`;
}

/** Hora curta a partir de um ISO string: "9 PM", "Now" tratado fora. */
export function formatHour(iso: string): string {
  return `${String(new Date(iso).getHours()).padStart(2, "0")}h`;
}

/** Hora cheia: "5:28 AM". */
export function formatClock(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Dia da semana abreviado: "Mon", "Tue". */
export function formatWeekday(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    new Date(iso),
  );
}

/** Clampa um número num intervalo. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
