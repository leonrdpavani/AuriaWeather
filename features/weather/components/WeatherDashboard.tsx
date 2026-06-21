"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  IconCloudFilled,
  IconCurrentLocationFilled,
} from "@tabler/icons-react";
import { IconButton, SegmentedControl } from "@/ui";
import { useWeather } from "@/features/weather/hooks/useWeather";
import { CurrentWeather } from "@/features/weather/components/CurrentWeather";
import { DayDetailsTabs } from "@/features/weather/components/DayDetailsTabs";
import { DaySelector } from "@/features/weather/components/DaySelector";
import { HourlyForecast } from "@/features/weather/components/HourlyForecast";
import { WeatherBackground } from "@/features/weather/components/WeatherBackground";
import { AlertBanner } from "@/features/weather/components/AlertBanner";
import { CitySearch } from "@/features/weather/components/CitySearch";
import type { HourlyPoint, Unit, WeatherData } from "@/features/weather/types";
import { config } from "@/lib/config";
import { formatWeekday } from "@/lib/utils/format";
import { fadeUp, staggerContainer } from "@/ui/tokens/motion";
import { cn } from "@/lib/utils/cn";

const UNIT_OPTIONS = [
  { value: "celsius" as Unit, label: "°C" },
  { value: "fahrenheit" as Unit, label: "°F" },
];

function dayLabel(index: number, iso: string): string {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return formatWeekday(iso);
}

/**
 * Próximas 24h a partir da hora atual, em passos de 2h (12 pontos).
 * Atravessa para o dia seguinte quando necessário.
 */
function buildUpcoming(days: WeatherData["days"], nowMs: number): HourlyPoint[] {
  const points = [...days[0].hourly, ...(days[1]?.hourly ?? [])];
  const dayStart = new Date(days[0].date).getTime();
  const startIdx = Math.max(0, Math.floor((nowMs - dayStart) / 3_600_000));
  const out: HourlyPoint[] = [];
  for (let i = startIdx; i < points.length && out.length < 12; i += 2) {
    out.push(points[i]);
  }
  return out;
}

/**
 * Orquestra a tela de clima: fundo reativo, busca, unidade, herói do dia
 * selecionado, abas de detalhe e o seletor dos próximos dias.
 * Componente client da feature. A página (Server Component) só busca os dados.
 */
export function WeatherDashboard({
  initialData,
}: {
  initialData: WeatherData;
}) {
  const {
    data,
    unit,
    setUnit,
    selectedDayIndex,
    selectDay,
    isLoading,
    selectCity,
  } = useWeather(initialData);

  const selectedDay = data.days[selectedDayIndex];
  const isToday = selectedDayIndex === 0;

  // "now" só no client (evita mismatch de hidratação por timezone/hora):
  // lê o relógio do browser uma vez, depois da montagem. É justamente o caso
  // legítimo de sincronizar um valor só-do-browser após montar.
  const [nowMs, setNowMs] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- valor só-do-client lido uma vez na montagem
    setNowMs(Date.now());
  }, []);
  const upcoming = useMemo(
    () => buildUpcoming(data.days, nowMs ?? new Date(data.days[0].date).getTime()),
    [data.days, nowMs],
  );

  return (
    <>
      <WeatherBackground
        condition={selectedDay.condition}
        isDay={selectedDay.isDay}
      />

      <motion.main
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className={cn(
          "mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 pt-6 pb-28 sm:px-6 sm:pt-10",
          "transition-opacity duration-300",
          isLoading && "opacity-60",
        )}
      >
        {/* Top bar */}
        <motion.header
          variants={fadeUp}
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between"
        >
          <div className="flex items-center gap-2 text-ink">
            <IconCloudFilled className="size-6 text-brand-300" />
            <span className="text-lg font-semibold tracking-tight">
              {config.appName}
            </span>
          </div>
          <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto sm:flex-nowrap">
            <CitySearch
              onSelect={selectCity}
              className="min-w-0 flex-1 sm:w-64 sm:flex-none"
            />
            <IconButton
              label="Use my location"
              onClick={() => selectCity(config.defaultCity)}
              className="shrink-0"
            >
              <IconCurrentLocationFilled className="size-5" />
            </IconButton>
            <SegmentedControl
              aria-label="Temperature unit"
              options={UNIT_OPTIONS}
              value={unit}
              onChange={setUnit}
              className="shrink-0"
            />
          </div>
        </motion.header>

        {/* Herói do dia selecionado */}
        <motion.div variants={fadeUp}>
          <CurrentWeather
            city={data.city}
            country={data.country}
            label={dayLabel(selectedDayIndex, selectedDay.date)}
            day={selectedDay}
            unit={unit}
          />
        </motion.div>

        {/* Carrossel das próximas 24h (passos de 2h, a partir de agora) */}
        <motion.div variants={fadeUp}>
          <HourlyForecast
            hours={upcoming}
            isDay={data.days[0].isDay}
            unit={unit}
            showNow
          />
        </motion.div>

        {/* Alertas (apenas no dia de hoje) */}
        {isToday && data.alerts.length > 0 && (
          <motion.div variants={fadeUp}>
            <AlertBanner alerts={data.alerts} />
          </motion.div>
        )}

        {/* Abas de detalhe + seletor de dias */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <motion.div variants={fadeUp} className="min-w-0 lg:col-span-2">
            <DayDetailsTabs day={selectedDay} unit={unit} />
          </motion.div>
          <motion.div variants={fadeUp}>
            <DaySelector
              days={data.days}
              selectedIndex={selectedDayIndex}
              onSelect={selectDay}
              unit={unit}
            />
          </motion.div>
        </div>

        <motion.footer
          variants={fadeUp}
          className="text-center text-xs text-ink-subtle"
        >
          Demo data · Built with Next.js, Framer Motion & Iconify
        </motion.footer>
      </motion.main>
    </>
  );
}
