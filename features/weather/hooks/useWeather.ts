"use client";

import { useCallback, useState, useTransition } from "react";
import { getWeather } from "@/lib/api/weather";
import type { Unit, WeatherData } from "@/features/weather/types";

/**
 * Estado da feature de clima no client: dados, unidade e cidade selecionada.
 *
 * Recebe `initialData` já buscado no servidor (Server Component) e troca de
 * cidade chamando a camada lib/api. Quando houver backend + auth, este hook
 * passa a usar TanStack Query — a interface pública aqui não muda.
 */
export function useWeather(initialData: WeatherData) {
  const [data, setData] = useState(initialData);
  const [unit, setUnit] = useState<Unit>("celsius");
  const [isPending, startTransition] = useTransition();

  const selectCity = useCallback((city: string) => {
    startTransition(async () => {
      const next = await getWeather(city);
      setData(next);
    });
  }, []);

  const toggleUnit = useCallback(
    (next: Unit) => setUnit(next),
    [],
  );

  return { data, unit, isLoading: isPending, selectCity, setUnit: toggleUnit };
}
