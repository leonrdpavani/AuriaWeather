"use client";

import { motion } from "framer-motion";
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconMapPinFilled,
} from "@tabler/icons-react";
import { AnimatedNumber } from "@/ui";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import type { DayWeather, Unit } from "@/features/weather/types";
import { toUnit } from "@/lib/utils/format";
import { ease } from "@/ui/tokens/motion";

interface CurrentWeatherProps {
  city: string;
  country: string;
  /** "Today", "Tomorrow" ou o dia da semana. */
  label: string;
  day: DayWeather;
  unit: Unit;
}

/** Herói: cidade, dia, temperatura grande animada, condição e máx/mín. */
export function CurrentWeather({
  city,
  country,
  label,
  day,
  unit,
}: CurrentWeatherProps) {
  return (
    <section className="flex flex-col items-center gap-3 py-4 text-center">
      <div className="flex items-center gap-1.5 text-ink-muted">
        <IconMapPinFilled className="size-4" />
        <span className="text-sm font-medium">
          {city}, {country}
        </span>
      </div>
      <span className="text-xs font-semibold tracking-widest text-brand-300 uppercase">
        {label}
      </span>

      <motion.div
        key={`${day.date}-${day.condition}`}
        initial={{ scale: 0.8, opacity: 0, rotate: -6 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={ease.spring}
        className="animate-float"
      >
        <WeatherIcon
          condition={day.condition}
          isDay={day.isDay}
          size={140}
          className="drop-shadow-[0_12px_40px_rgba(108,92,245,0.45)]"
        />
      </motion.div>

      <AnimatedNumber
        value={toUnit(day.tempC, unit)}
        suffix="°"
        className="text-8xl font-extralight tracking-tighter text-ink tabular-nums"
      />

      <p className="text-lg font-medium text-ink">{day.summary}</p>

      <div className="flex items-center gap-4 text-sm text-ink-muted">
        <span className="inline-flex items-center gap-1">
          <IconCaretUpFilled className="size-4 text-warning" />
          H: {toUnit(day.highC, unit)}°
        </span>
        <span className="inline-flex items-center gap-1">
          <IconCaretDownFilled className="size-4 text-accent-400" />
          L: {toUnit(day.lowC, unit)}°
        </span>
      </div>
    </section>
  );
}
