"use client";

import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { GlassCard, SectionHeader } from "@/ui";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import type { DailyPoint, Unit } from "@/features/weather/types";
import { formatWeekday, toUnit } from "@/lib/utils/format";
import { fadeUp, staggerContainer } from "@/ui/tokens/motion";

interface WeeklyForecastProps {
  days: DailyPoint[];
  isDay: boolean;
  unit: Unit;
}

/** Previsão semanal — lista com barra de faixa de temperatura. */
export function WeeklyForecast({ days, isDay, unit }: WeeklyForecastProps) {
  const lows = days.map((d) => d.lowC);
  const highs = days.map((d) => d.highC);
  const min = Math.min(...lows);
  const max = Math.max(...highs);
  const span = Math.max(max - min, 1);

  return (
    <GlassCard className="flex flex-col gap-4 p-5">
      <SectionHeader
        title="Weekly Forecast"
        icon={<CalendarDays className="size-4" />}
      />
      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex flex-col"
      >
        {days.map((day, i) => {
          const left = ((day.lowC - min) / span) * 100;
          const width = ((day.highC - day.lowC) / span) * 100;
          return (
            <motion.li
              key={day.date}
              variants={fadeUp}
              className="grid grid-cols-[3.5rem_2rem_1fr_2.5rem] items-center gap-3 py-2"
            >
              <span className="text-sm font-medium text-ink-muted">
                {i === 0 ? "Today" : formatWeekday(day.date)}
              </span>
              <WeatherIcon condition={day.condition} isDay={isDay} size={28} />
              <div className="flex items-center gap-2">
                <span className="w-7 text-right text-sm text-ink-subtle tabular-nums">
                  {toUnit(day.lowC, unit)}°
                </span>
                <div className="relative h-1.5 flex-1 rounded-full bg-glass">
                  <div
                    className="absolute h-full rounded-full bg-gradient-to-r from-accent-400 to-brand-400"
                    style={{ left: `${left}%`, width: `${width}%` }}
                  />
                </div>
                <span className="w-7 text-sm font-medium text-ink tabular-nums">
                  {toUnit(day.highC, unit)}°
                </span>
              </div>
            </motion.li>
          );
        })}
      </motion.ul>
    </GlassCard>
  );
}
