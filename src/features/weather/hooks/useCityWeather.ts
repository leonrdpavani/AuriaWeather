import { useEffect, useState } from "react";
import { getWeather } from "@/lib/api/weather";
import type { WeatherData } from "@/features/weather/types";

/**
 * Carrega o clima de uma cidade e refaz o fetch quando a cidade muda.
 * Mantém o dado anterior enquanto o novo carrega (sem flicker ao trocar de
 * cidade). `isLoading` é DERIVADO (a cidade carregada ainda não bate com a
 * pedida) — evita setState síncrono dentro do efeito. Hoje bate no mock;
 * quando houver backend vira TanStack Query sem mudar a interface pública.
 */
export function useCityWeather(city: string) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loadedCity, setLoadedCity] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    getWeather(city).then((next) => {
      if (!alive) return;
      setData(next);
      setLoadedCity(city);
    });
    return () => {
      alive = false;
    };
  }, [city]);

  return { data, isLoading: loadedCity !== city };
}
