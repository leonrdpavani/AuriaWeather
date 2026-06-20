"use client";

import { motion } from "framer-motion";
import { IconDropletFilled } from "@tabler/icons-react";
import { GlassCard, ScrollRow } from "@/ui";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import type { HourlyPoint, Unit } from "@/features/weather/types";
import { formatHour, toUnit } from "@/lib/utils/format";
import { fadeUp, staggerContainer } from "@/ui/tokens/motion";

interface HourlyForecastProps {
  hours: HourlyPoint[];
  isDay: boolean;
  unit: Unit;
  /** Mostra "Now" na primeira coluna (apenas para hoje). */
  showNow?: boolean;
}

/** Previsão hora a hora — linha rolável (usada no painel da aba "Hourly"). */
export function HourlyForecast({
  hours,
  isDay,
  unit,
  showNow = true,
}: HourlyForecastProps) {
  return (
    <GlassCard className="p-4">
      <motion.div variants={staggerContainer} initial="hidden" animate="show">
        <ScrollRow>
          {hours.map((hour, i) => (
            <motion.div key={hour.time} variants={fadeUp}>
              <div className="flex w-[72px] snap-start flex-col items-center gap-2 rounded-2xl px-2 py-3 transition-colors hover:bg-glass">
                <span className="text-xs font-medium text-ink-muted">
                  {showNow && i === 0 ? "Now" : formatHour(hour.time)}
                </span>
                <WeatherIcon
                  condition={hour.condition}
                  isDay={isDay}
                  size={40}
                />
                {hour.precipProbability > 20 ? (
                  <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-accent-400">
                    <IconDropletFilled className="size-3" />
                    {hour.precipProbability}%
                  </span>
                ) : (
                  <span className="h-[15px]" />
                )}
                <span className="text-sm font-semibold text-ink tabular-nums">
                  {toUnit(hour.tempC, unit)}°
                </span>
              </div>
            </motion.div>
          ))}
        </ScrollRow>
      </motion.div>
    </GlassCard>
  );
}
