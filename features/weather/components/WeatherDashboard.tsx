"use client";

import { motion } from "framer-motion";
import { CloudSun } from "lucide-react";
import { SegmentedControl } from "@/ui";
import { useWeather } from "@/features/weather/hooks/useWeather";
import { CurrentWeather } from "@/features/weather/components/CurrentWeather";
import { HourlyForecast } from "@/features/weather/components/HourlyForecast";
import { WeeklyForecast } from "@/features/weather/components/WeeklyForecast";
import { WeatherMetrics } from "@/features/weather/components/WeatherMetrics";
import { WeatherBackground } from "@/features/weather/components/WeatherBackground";
import { AlertBanner } from "@/features/weather/components/AlertBanner";
import { CitySearch } from "@/features/weather/components/CitySearch";
import type { Unit, WeatherData } from "@/features/weather/types";
import { config } from "@/lib/config";
import { fadeUp, staggerContainer } from "@/ui/tokens/motion";
import { cn } from "@/lib/utils/cn";

const UNIT_OPTIONS = [
  { value: "celsius" as Unit, label: "°C" },
  { value: "fahrenheit" as Unit, label: "°F" },
];

/**
 * Orquestra a tela de clima: fundo reativo, busca, unidade e todos os blocos.
 * Componente client da feature (interativo). A página (Server Component) só
 * busca os dados e monta este componente.
 */
export function WeatherDashboard({
  initialData,
}: {
  initialData: WeatherData;
}) {
  const { data, unit, isLoading, selectCity, setUnit } =
    useWeather(initialData);

  return (
    <>
      <WeatherBackground condition={data.current.condition} isDay={data.isDay} />

      <motion.main
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className={cn(
          "mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-10",
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
            <CloudSun className="size-6 text-brand-300" />
            <span className="text-lg font-semibold tracking-tight">
              {config.appName}
            </span>
          </div>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <CitySearch onSelect={selectCity} />
            <SegmentedControl
              aria-label="Temperature unit"
              options={UNIT_OPTIONS}
              value={unit}
              onChange={setUnit}
            />
          </div>
        </motion.header>

        {/* Hero */}
        <motion.div variants={fadeUp}>
          <CurrentWeather
            city={data.city}
            country={data.country}
            isDay={data.isDay}
            current={data.current}
            unit={unit}
          />
        </motion.div>

        {/* Alertas */}
        {data.alerts.length > 0 && (
          <motion.div variants={fadeUp}>
            <AlertBanner alerts={data.alerts} />
          </motion.div>
        )}

        {/* Hourly */}
        <motion.div variants={fadeUp}>
          <HourlyForecast
            hours={data.hourly}
            isDay={data.isDay}
            unit={unit}
          />
        </motion.div>

        {/* Métricas + semana */}
        <div className="grid gap-5 lg:grid-cols-3">
          <motion.div variants={fadeUp} className="lg:col-span-2">
            <WeatherMetrics
              current={data.current}
              airQuality={data.airQuality}
              sun={data.sun}
              unit={unit}
            />
          </motion.div>
          <motion.div variants={fadeUp}>
            <WeeklyForecast
              days={data.daily}
              isDay={data.isDay}
              unit={unit}
            />
          </motion.div>
        </div>

        <motion.footer
          variants={fadeUp}
          className="pt-4 text-center text-xs text-ink-subtle"
        >
          Demo data · Built with Next.js, Framer Motion & Iconify
        </motion.footer>
      </motion.main>
    </>
  );
}
