"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  IconDropletFilled,
  IconEyeFilled,
  IconGaugeFilled,
  IconLungsFilled,
  IconSunFilled,
  IconSunriseFilled,
  IconTemperaturePlusFilled,
  IconWindsockFilled,
} from "@tabler/icons-react";
import { MetricTile, SegmentedControl, type SegmentOption } from "@/ui";
import {
  Compass,
  LevelBar,
  SunArc,
  uvLabel,
} from "@/features/weather/components/metric-visuals";
import type { DayTab, DayWeather, Unit } from "@/features/weather/types";
import { toUnit } from "@/lib/utils/format";

const TABS: SegmentOption<DayTab>[] = [
  { value: "air", label: "Air", icon: <IconLungsFilled /> },
  { value: "atmosphere", label: "Atmosphere", icon: <IconWindsockFilled /> },
  { value: "sun", label: "Sun", icon: <IconSunFilled /> },
];

interface DayDetailsTabsProps {
  day: DayWeather;
  unit: Unit;
}

/**
 * Abas com as informações detalhadas do DIA SELECIONADO.
 * Substitui os cards espalhados: o usuário alterna o conteúdo aqui.
 */
export function DayDetailsTabs({ day, unit }: DayDetailsTabsProps) {
  const [tab, setTab] = useState<DayTab>("air");

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto no-scrollbar">
        <SegmentedControl
          aria-label="Day details"
          options={TABS}
          value={tab}
          onChange={setTab}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {tab === "air" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MetricTile
                icon={<IconLungsFilled className="size-4" />}
                label="Air Quality"
                value={`${day.airQuality.level} · ${day.airQuality.label}`}
              >
                <LevelBar pct={(day.airQuality.aqi / 300) * 100} />
              </MetricTile>
              <MetricTile
                icon={<IconSunFilled className="size-4" />}
                label="UV Index"
                value={day.uvIndex}
                footnote={uvLabel(day.uvIndex)}
              >
                <LevelBar pct={(day.uvIndex / 11) * 100} />
              </MetricTile>
            </div>
          )}

          {tab === "atmosphere" && (
            <div className="grid grid-cols-2 gap-4">
              <MetricTile
                icon={<IconWindsockFilled className="size-4" />}
                label="Wind"
                value={`${day.windKph} km/h`}
              >
                <Compass deg={day.windDir} />
              </MetricTile>
              <MetricTile
                icon={<IconDropletFilled className="size-4" />}
                label="Humidity"
                value={`${day.humidity}%`}
                footnote={`Feels ${toUnit(day.feelsLikeC, unit)}°`}
              />
              <MetricTile
                icon={<IconGaugeFilled className="size-4" />}
                label="Pressure"
                value={day.pressureHpa}
                footnote="hPa"
              />
              <MetricTile
                icon={<IconEyeFilled className="size-4" />}
                label="Visibility"
                value={`${day.visibilityKm} km`}
              />
            </div>
          )}

          {tab === "sun" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <MetricTile
                icon={<IconSunriseFilled className="size-4" />}
                label="Sunrise & Sunset"
                value={null}
              >
                <SunArc sunrise={day.sun.sunrise} sunset={day.sun.sunset} />
              </MetricTile>
              <div className="grid grid-cols-2 gap-4">
                <MetricTile
                  icon={<IconTemperaturePlusFilled className="size-4" />}
                  label="Feels Like"
                  value={`${toUnit(day.feelsLikeC, unit)}°`}
                />
                <MetricTile
                  icon={<IconDropletFilled className="size-4" />}
                  label="Rainfall"
                  value={`${day.rainfallMm} mm`}
                  footnote={`${day.precipProbability}% chance`}
                />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
