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

/** Dia/noite por hora (≈06h–19h é dia) para o ícone refletir o horário. */
function isDaytime(iso: string): boolean {
  const h = new Date(iso).getHours();
  return h >= 6 && h < 19;
}

/**
 * Previsão hora a hora — carrossel horizontal (aba "Hourly").
 * Cada coluna empilha, de cima p/ baixo: temperatura, chance de chuva,
 * ícone do clima e a hora.
 */
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
              <div className="flex w-16 snap-start flex-col items-center gap-2 rounded-2xl px-2 py-3 transition-colors hover:bg-glass">
                <span className="text-sm font-semibold text-ink tabular-nums">
                  {toUnit(hour.tempC, unit)}°
                </span>
                <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-accent-400 tabular-nums">
                  <IconDropletFilled className="size-2.5" />
                  {hour.precipProbability}%
                </span>
                <WeatherIcon
                  condition={hour.condition}
                  isDay={showNow && i === 0 ? isDay : isDaytime(hour.time)}
                  size={40}
                />
                <span className="text-xs font-medium text-ink-muted tabular-nums">
                  {showNow && i === 0 ? "Now" : formatHour(hour.time)}
                </span>
              </div>
            </motion.div>
          ))}
        </ScrollRow>
      </motion.div>
    </GlassCard>
  );
}
