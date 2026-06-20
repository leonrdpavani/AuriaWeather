"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, MapPin } from "lucide-react";
import { AnimatedNumber } from "@/ui";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import type { CurrentConditions, Unit } from "@/features/weather/types";
import { toUnit } from "@/lib/utils/format";
import { ease } from "@/ui/tokens/motion";

interface CurrentWeatherProps {
  city: string;
  country: string;
  isDay: boolean;
  current: CurrentConditions;
  unit: Unit;
}

/** Herói: cidade, temperatura grande animada, condição e máx/mín. */
export function CurrentWeather({
  city,
  country,
  isDay,
  current,
  unit,
}: CurrentWeatherProps) {
  return (
    <section className="flex flex-col items-center gap-4 py-6 text-center">
      <div className="flex items-center gap-1.5 text-ink-muted">
        <MapPin className="size-4" />
        <span className="text-sm font-medium">
          {city}, {country}
        </span>
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotate: -6 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={ease.spring}
        className="animate-float"
      >
        <WeatherIcon
          condition={current.condition}
          isDay={isDay}
          size={140}
          className="drop-shadow-[0_12px_40px_rgba(108,92,245,0.45)]"
        />
      </motion.div>

      <div className="flex items-start">
        <AnimatedNumber
          value={toUnit(current.tempC, unit)}
          suffix="°"
          className="text-8xl font-extralight tracking-tighter text-ink tabular-nums"
        />
      </div>

      <p className="text-lg font-medium text-ink">{current.summary}</p>

      <div className="flex items-center gap-4 text-sm text-ink-muted">
        <span className="inline-flex items-center gap-1">
          <ArrowUp className="size-4 text-warning" />
          H: {toUnit(current.highC, unit)}°
        </span>
        <span className="inline-flex items-center gap-1">
          <ArrowDown className="size-4 text-accent-400" />
          L: {toUnit(current.lowC, unit)}°
        </span>
      </div>
    </section>
  );
}
