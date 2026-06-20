"use client";

import { motion } from "framer-motion";
import { IconCalendarWeekFilled, IconDropletFilled } from "@tabler/icons-react";
import { GlassCard, SectionHeader } from "@/ui";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import type { DayWeather, Unit } from "@/features/weather/types";
import { formatWeekday, toUnit } from "@/lib/utils/format";
import { ease, fadeUp, staggerContainer } from "@/ui/tokens/motion";
import { cn } from "@/lib/utils/cn";

interface DaySelectorProps {
  days: DayWeather[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  unit: Unit;
}

function dayLabel(index: number, iso: string): string {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return formatWeekday(iso);
}

/**
 * Card dos próximos dias. Selecionar um dia troca o conteúdo do herói e das
 * abas (controla `selectedIndex`). Cada linha mostra a faixa de temperatura.
 */
export function DaySelector({
  days,
  selectedIndex,
  onSelect,
  unit,
}: DaySelectorProps) {
  const min = Math.min(...days.map((d) => d.lowC));
  const max = Math.max(...days.map((d) => d.highC));
  const span = Math.max(max - min, 1);

  return (
    <GlassCard className="flex h-full flex-col gap-3 p-5">
      <SectionHeader
        title="Next 7 Days"
        icon={<IconCalendarWeekFilled className="size-4" />}
      />
      <motion.ul
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-1"
      >
        {days.map((day, i) => {
          const active = i === selectedIndex;
          const left = ((day.lowC - min) / span) * 100;
          const width = ((day.highC - day.lowC) / span) * 100;
          return (
            <motion.li key={day.date} variants={fadeUp}>
              <button
                onClick={() => onSelect(i)}
                aria-pressed={active}
                className={cn(
                  "relative grid w-full grid-cols-[3.5rem_1.75rem_1fr] items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors",
                  !active && "hover:bg-glass",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="day-selected"
                    transition={ease.spring}
                    className="absolute inset-0 rounded-2xl bg-glass-strong ring-1 ring-brand-400/40"
                  />
                )}
                <span
                  className={cn(
                    "relative z-10 text-sm font-medium",
                    active ? "text-ink" : "text-ink-muted",
                  )}
                >
                  {dayLabel(i, day.date)}
                </span>
                <span className="relative z-10">
                  <WeatherIcon
                    condition={day.condition}
                    isDay={day.isDay}
                    size={26}
                  />
                </span>
                <span className="relative z-10 flex min-w-0 items-center gap-2">
                  {day.precipProbability > 20 && (
                    <span className="hidden w-9 shrink-0 items-center gap-0.5 text-[11px] font-medium text-accent-400 min-[420px]:inline-flex">
                      <IconDropletFilled className="size-3" />
                      {day.precipProbability}%
                    </span>
                  )}
                  <span className="ml-auto w-7 shrink-0 text-right text-sm text-ink-subtle tabular-nums">
                    {toUnit(day.lowC, unit)}°
                  </span>
                  <span className="relative h-1.5 min-w-8 flex-1 rounded-full bg-glass">
                    <span
                      className="absolute h-full rounded-full bg-gradient-to-r from-accent-400 to-brand-400"
                      style={{ left: `${left}%`, width: `${width}%` }}
                    />
                  </span>
                  <span className="w-7 shrink-0 text-sm font-medium text-ink tabular-nums">
                    {toUnit(day.highC, unit)}°
                  </span>
                </span>
              </button>
            </motion.li>
          );
        })}
      </motion.ul>
    </GlassCard>
  );
}
