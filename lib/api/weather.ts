/**
 * Recurso de clima — contrato de dados + acesso.
 *
 * Os TIPOS de contrato vivem aqui (camada lib, a mais baixa e compartilhável):
 * tanto features/ quanto app/ podem importá-los sem quebrar a direção de
 * dependência. A feature de clima reexporta/estende estes tipos em
 * features/weather/types.ts.
 *
 * Hoje `getWeather` devolve dados MOCK (modo visual) — agora com DETALHE por
 * dia, para que selecionar um dia troque herói + abas. Quando o backend
 * existir, troca-se o corpo por `apiFetch`; a assinatura permanece igual.
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

export type AlertSeverity = "advisory" | "watch" | "warning";

export interface WeatherAlert {
  id: string;
  title: string;
  severity: AlertSeverity;
  description: string;
}

/** Clima completo de um único dia (hoje ou futuro). */
export interface DayWeather {
  /** ISO date. */
  date: string;
  /** true = paleta/ícones de dia. */
  isDay: boolean;
  condition: WeatherCondition;
  /** Texto curto: "Mostly Clear". */
  summary: string;
  /** Temperatura representativa (hoje = agora; futuro = meio-dia). */
  tempC: number;
  feelsLikeC: number;
  highC: number;
  lowC: number;
  humidity: number;
  /** km/h e direção em graus. */
  windKph: number;
  windDir: number;
  /** mm na última hora (hoje) / acumulado previsto (futuro). */
  rainfallMm: number;
  /** km. */
  visibilityKm: number;
  /** hPa. */
  pressureHpa: number;
  uvIndex: number;
  /** Probabilidade de precipitação do dia 0–100. */
  precipProbability: number;
  airQuality: AirQuality;
  sun: { sunrise: string; sunset: string };
  hourly: HourlyPoint[];
}

export interface WeatherData {
  city: string;
  country: string;
  /** 7 dias; days[0] é hoje. */
  days: DayWeather[];
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

const FORECAST_CONDITIONS: WeatherCondition[] = [
  "clear",
  "partly-cloudy",
  "cloudy",
  "drizzle",
  "rain",
];

const SUMMARIES: Record<WeatherCondition, string> = {
  clear: "Clear Sky",
  "partly-cloudy": "Partly Cloudy",
  cloudy: "Cloudy",
  overcast: "Overcast",
  fog: "Foggy",
  drizzle: "Light Drizzle",
  rain: "Rain Showers",
  thunderstorm: "Thunderstorms",
  snow: "Snow",
  windy: "Windy",
};

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

function buildHourly(
  dayStart: Date,
  baseTempC: number,
  dayCondition: WeatherCondition,
  isToday: boolean,
  rnd: () => number,
): HourlyPoint[] {
  return Array.from({ length: 24 }, (_, i) => {
    const time = new Date(dayStart.getTime() + i * 3600_000);
    const swing = Math.sin((i / 24) * Math.PI * 2 - Math.PI / 2) * 5;
    return {
      time: time.toISOString(),
      tempC: Math.round(baseTempC + swing + (rnd() - 0.5) * 2),
      condition:
        isToday && i === 0
          ? dayCondition
          : FORECAST_CONDITIONS[
              Math.floor(rnd() * FORECAST_CONDITIONS.length)
            ],
      precipProbability: Math.round(rnd() * 70),
    };
  });
}

function buildSun(dayStart: Date) {
  const sunrise = new Date(dayStart);
  sunrise.setHours(5, 28, 0, 0);
  const sunset = new Date(dayStart);
  sunset.setHours(19, 25, 0, 0);
  return { sunrise: sunrise.toISOString(), sunset: sunset.toISOString() };
}

function buildDay(seed: CitySeed, i: number, rnd: () => number): DayWeather {
  const isToday = i === 0;
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  const dayStart = new Date(midnight.getTime() + i * 86_400_000);

  const condition = isToday
    ? seed.condition
    : FORECAST_CONDITIONS[Math.floor(rnd() * FORECAST_CONDITIONS.length)];

  const baseTempC = seed.baseTempC + Math.round((rnd() - 0.5) * 6);
  const hourly = buildHourly(dayStart, baseTempC, condition, isToday, rnd);

  const temps = hourly.map((h) => h.tempC);
  const highC = Math.max(...temps);
  const lowC = Math.min(...temps);
  const tempC = isToday ? seed.baseTempC : hourly[13].tempC;
  const aqi = Math.round(clampNum(seed.aqi + (rnd() - 0.5) * 40, 10, 280));

  return {
    date: dayStart.toISOString(),
    isDay: isToday ? seed.isDay : true,
    condition,
    summary: isToday ? seed.summary : SUMMARIES[condition],
    tempC,
    feelsLikeC: tempC - 1 - Math.round(rnd() * 2),
    highC,
    lowC,
    humidity: 40 + Math.round(rnd() * 45),
    windKph: isToday ? seed.windKph : Math.round(8 + rnd() * 22),
    windDir: Math.round(rnd() * 360),
    rainfallMm: isToday
      ? seed.rainfallMm
      : Math.round(rnd() * 80) / 10,
    visibilityKm: 8 + Math.round(rnd() * 6),
    pressureHpa: 1008 + Math.round(rnd() * 14),
    uvIndex: isToday ? seed.uvIndex : Math.round(rnd() * 11),
    precipProbability: Math.max(...hourly.map((h) => h.precipProbability)),
    airQuality: aqiToLevel(aqi),
    sun: buildSun(dayStart),
    hourly,
  };
}

function clampNum(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

function buildData(seed: CitySeed): WeatherData {
  const rnd = seeded(
    seed.city.split("").reduce((a, c) => a + c.charCodeAt(0), 0),
  );
  const days = Array.from({ length: 7 }, (_, i) => buildDay(seed, i, rnd));

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

  return { city: seed.city, country: seed.country, days, alerts };
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
