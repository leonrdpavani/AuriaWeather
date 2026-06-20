/**
 * Recurso de clima — contrato de dados + acesso.
 *
 * Os TIPOS de contrato vivem aqui (camada lib, a mais baixa e compartilhável):
 * tanto features/ quanto app/ podem importá-los sem quebrar a direção de
 * dependência. A feature de clima reexporta/estende estes tipos em
 * features/weather/types.ts.
 *
 * Hoje `getWeather` devolve dados MOCK (modo visual). Quando o backend existir,
 * troca-se o corpo por `apiFetch` — a assinatura permanece igual.
 */

/** Condições suportadas — alinhadas aos ícones animados (meteocons). */
export type WeatherCondition =
  | "clear"
  | "partly-cloudy"
  | "cloudy"
  | "overcast"
  | "fog"
  | "drizzle"
  | "rain"
  | "thunderstorm"
  | "snow"
  | "windy";

export type AirQualityLevel = 1 | 2 | 3 | 4 | 5;

export interface AirQuality {
  /** Índice 0–500. */
  aqi: number;
  level: AirQualityLevel;
  label: string;
}

export interface HourlyPoint {
  /** ISO timestamp. */
  time: string;
  /** Temperatura em Celsius (conversão de unidade é responsabilidade da UI). */
  tempC: number;
  condition: WeatherCondition;
  /** Probabilidade de precipitação 0–100. */
  precipProbability: number;
}

export interface DailyPoint {
  /** ISO date. */
  date: string;
  condition: WeatherCondition;
  highC: number;
  lowC: number;
  precipProbability: number;
}

export type AlertSeverity = "advisory" | "watch" | "warning";

export interface WeatherAlert {
  id: string;
  title: string;
  severity: AlertSeverity;
  description: string;
}

export interface CurrentConditions {
  tempC: number;
  feelsLikeC: number;
  highC: number;
  lowC: number;
  condition: WeatherCondition;
  /** Texto curto: "Mostly Clear". */
  summary: string;
  humidity: number;
  /** km/h e direção em graus. */
  windKph: number;
  windDir: number;
  /** mm na última hora. */
  rainfallMm: number;
  /** km. */
  visibilityKm: number;
  /** hPa. */
  pressureHpa: number;
  uvIndex: number;
}

export interface WeatherData {
  city: string;
  country: string;
  /** true = dia, false = noite (controla paleta/ícones). */
  isDay: boolean;
  current: CurrentConditions;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  airQuality: AirQuality;
  sun: { sunrise: string; sunset: string };
  alerts: WeatherAlert[];
}

/* -------------------------------------------------------------------------- */
/* Mock                                                                       */
/* -------------------------------------------------------------------------- */

interface CitySeed {
  city: string;
  country: string;
  isDay: boolean;
  baseTempC: number;
  condition: WeatherCondition;
  summary: string;
  uvIndex: number;
  aqi: number;
  windKph: number;
  rainfallMm: number;
}

const CITY_SEEDS: Record<string, CitySeed> = {
  montreal: {
    city: "Montreal",
    country: "Canada",
    isDay: false,
    baseTempC: 19,
    condition: "partly-cloudy",
    summary: "Mostly Clear",
    uvIndex: 4,
    aqi: 42,
    windKph: 9.7,
    rainfallMm: 1.8,
  },
  toronto: {
    city: "Toronto",
    country: "Canada",
    isDay: true,
    baseTempC: 20,
    condition: "windy",
    summary: "Fast Wind",
    uvIndex: 5,
    aqi: 58,
    windKph: 28,
    rainfallMm: 0,
  },
  tokyo: {
    city: "Tokyo",
    country: "Japan",
    isDay: true,
    baseTempC: 13,
    condition: "rain",
    summary: "Showers",
    uvIndex: 2,
    aqi: 74,
    windKph: 12,
    rainfallMm: 4.2,
  },
  "são paulo": {
    city: "São Paulo",
    country: "Brazil",
    isDay: true,
    baseTempC: 24,
    condition: "thunderstorm",
    summary: "Afternoon Storms",
    uvIndex: 8,
    aqi: 65,
    windKph: 15,
    rainfallMm: 6.1,
  },
  "rio de janeiro": {
    city: "Rio de Janeiro",
    country: "Brazil",
    isDay: true,
    baseTempC: 30,
    condition: "clear",
    summary: "Sunny",
    uvIndex: 11,
    aqi: 38,
    windKph: 11,
    rainfallMm: 0,
  },
  lisbon: {
    city: "Lisbon",
    country: "Portugal",
    isDay: true,
    baseTempC: 22,
    condition: "clear",
    summary: "Clear Sky",
    uvIndex: 7,
    aqi: 30,
    windKph: 14,
    rainfallMm: 0,
  },
};

const HOURLY_CONDITIONS: WeatherCondition[] = [
  "clear",
  "partly-cloudy",
  "cloudy",
  "drizzle",
  "rain",
];

function aqiToLevel(aqi: number): AirQuality {
  if (aqi <= 50) return { aqi, level: 1, label: "Low Health Risk" };
  if (aqi <= 100) return { aqi, level: 2, label: "Moderate" };
  if (aqi <= 150) return { aqi, level: 3, label: "Unhealthy (Sensitive)" };
  if (aqi <= 200) return { aqi, level: 4, label: "Unhealthy" };
  return { aqi, level: 5, label: "Hazardous" };
}

/** Pseudo-aleatório determinístico (estável entre server/client → sem mismatch). */
function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function buildHourly(seed: CitySeed, rnd: () => number): HourlyPoint[] {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  return Array.from({ length: 24 }, (_, i) => {
    const time = new Date(start.getTime() + i * 3600_000);
    const swing = Math.sin((i / 24) * Math.PI * 2) * 4;
    return {
      time: time.toISOString(),
      tempC: Math.round(seed.baseTempC + swing + (rnd() - 0.5) * 2),
      condition:
        i === 0
          ? seed.condition
          : HOURLY_CONDITIONS[Math.floor(rnd() * HOURLY_CONDITIONS.length)],
      precipProbability: Math.round(rnd() * 60),
    };
  });
}

function buildDaily(seed: CitySeed, rnd: () => number): DailyPoint[] {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(start.getTime() + i * 86_400_000);
    const high = Math.round(seed.baseTempC + 4 + (rnd() - 0.5) * 3);
    return {
      date: date.toISOString(),
      condition:
        i === 0
          ? seed.condition
          : HOURLY_CONDITIONS[Math.floor(rnd() * HOURLY_CONDITIONS.length)],
      highC: high,
      lowC: high - Math.round(4 + rnd() * 4),
      precipProbability: Math.round(rnd() * 80),
    };
  });
}

function buildSun(isDay: boolean) {
  const base = new Date();
  const sunrise = new Date(base);
  sunrise.setHours(5, 28, 0, 0);
  const sunset = new Date(base);
  sunset.setHours(19, 25, 0, 0);
  return { sunrise: sunrise.toISOString(), sunset: sunset.toISOString(), isDay };
}

function buildData(seed: CitySeed): WeatherData {
  const rnd = seeded(
    seed.city.split("").reduce((a, c) => a + c.charCodeAt(0), 0),
  );
  const hourly = buildHourly(seed, rnd);
  const daily = buildDaily(seed, rnd);
  const sun = buildSun(seed.isDay);

  const alerts: WeatherAlert[] =
    seed.condition === "thunderstorm"
      ? [
          {
            id: "storm-1",
            title: "Severe Thunderstorm Watch",
            severity: "watch",
            description:
              "Conditions are favorable for severe storms with heavy rain and lightning through the evening.",
          },
        ]
      : [];

  return {
    city: seed.city,
    country: seed.country,
    isDay: seed.isDay,
    current: {
      tempC: seed.baseTempC,
      feelsLikeC: seed.baseTempC - 1,
      highC: daily[0].highC,
      lowC: daily[0].lowC,
      condition: seed.condition,
      summary: seed.summary,
      humidity: 40 + Math.round(rnd() * 45),
      windKph: seed.windKph,
      windDir: Math.round(rnd() * 360),
      rainfallMm: seed.rainfallMm,
      visibilityKm: 8 + Math.round(rnd() * 6),
      pressureHpa: 1008 + Math.round(rnd() * 14),
      uvIndex: seed.uvIndex,
    },
    hourly,
    daily,
    airQuality: aqiToLevel(seed.aqi),
    sun: { sunrise: sun.sunrise, sunset: sun.sunset },
    alerts,
  };
}

/** Cidades disponíveis no mock (para a busca). */
export function listCities(): { city: string; country: string }[] {
  return Object.values(CITY_SEEDS).map(({ city, country }) => ({
    city,
    country,
  }));
}

/**
 * Busca o clima de uma cidade. Modo mock por enquanto.
 * Mantém assinatura async para virar `apiFetch` sem mudar os callers.
 */
export async function getWeather(city: string): Promise<WeatherData> {
  const seed = CITY_SEEDS[city.trim().toLowerCase()] ?? CITY_SEEDS.montreal;
  return buildData(seed);
}
