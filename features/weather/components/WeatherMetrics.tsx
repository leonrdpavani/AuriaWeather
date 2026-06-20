"use client";

import { motion } from "framer-motion";
import { Droplets, Eye, Gauge, Sunrise, Thermometer, Wind } from "lucide-react";
import { IconLungs, IconSunHigh } from "@tabler/icons-react";
import { MetricTile } from "@/ui";
import type {
  AirQuality,
  CurrentConditions,
  Unit,
} from "@/features/weather/types";
import { clamp, formatClock, toUnit } from "@/lib/utils/format";
import { fadeUp, staggerContainer } from "@/ui/tokens/motion";

interface WeatherMetricsProps {
  current: CurrentConditions;
  airQuality: AirQuality;
  sun: { sunrise: string; sunset: string };
  unit: Unit;
}

/** Barra de nível com gradiente e marcador na posição (0–100%). */
function LevelBar({ pct, label }: { pct: number; label?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative h-1.5 rounded-full bg-gradient-to-r from-success via-warning to-danger">
        <motion.span
          initial={{ left: 0, opacity: 0 }}
          animate={{ left: `${clamp(pct, 2, 98)}%`, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow"
        />
      </div>
      {label && <span className="text-xs text-ink-subtle">{label}</span>}
    </div>
  );
}

/** Mini bússola do vento. */
function Compass({ deg }: { deg: number }) {
  return (
    <div className="relative mx-auto size-16 rounded-full border border-glass-border">
      <span className="absolute left-1/2 top-1 -translate-x-1/2 text-[9px] text-ink-subtle">
        N
      </span>
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: deg }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="h-7 w-1 rounded-full bg-gradient-to-t from-transparent to-accent-400" />
      </motion.div>
    </div>
  );
}

/** Arco de nascer/pôr do sol. */
function SunArc({ sunrise, sunset }: { sunrise: string; sunset: string }) {
  return (
    <div className="flex flex-col gap-1">
      <svg viewBox="0 0 100 40" className="h-10 w-full overflow-visible">
        <path
          d="M5 38 A45 45 0 0 1 95 38"
          fill="none"
          stroke="var(--color-glass-border)"
          strokeWidth="2"
          strokeDasharray="3 3"
        />
        <motion.circle
          cx="50"
          cy="-7"
          r="4"
          fill="var(--color-warning)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />
      </svg>
      <div className="flex justify-between text-xs text-ink-subtle">
        <span>↑ {formatClock(sunrise)}</span>
        <span>↓ {formatClock(sunset)}</span>
      </div>
    </div>
  );
}

/** Grade de métricas detalhadas do clima atual. */
export function WeatherMetrics({
  current,
  airQuality,
  sun,
  unit,
}: WeatherMetricsProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4 lg:grid-cols-3"
    >
      <motion.div variants={fadeUp} className="col-span-2 lg:col-span-1">
        <MetricTile
          icon={<IconLungs className="size-4" />}
          label="Air Quality"
          value={`${airQuality.level} · ${airQuality.label}`}
        >
          <LevelBar pct={(airQuality.aqi / 300) * 100} />
        </MetricTile>
      </motion.div>

      <motion.div variants={fadeUp}>
        <MetricTile
          icon={<IconSunHigh className="size-4" />}
          label="UV Index"
          value={current.uvIndex}
          footnote={uvLabel(current.uvIndex)}
        >
          <LevelBar pct={(current.uvIndex / 11) * 100} />
        </MetricTile>
      </motion.div>

      <motion.div variants={fadeUp}>
        <MetricTile
          icon={<Sunrise className="size-4" />}
          label="Sunrise"
          value={formatClock(sun.sunrise)}
        >
          <SunArc sunrise={sun.sunrise} sunset={sun.sunset} />
        </MetricTile>
      </motion.div>

      <motion.div variants={fadeUp}>
        <MetricTile
          icon={<Wind className="size-4" />}
          label="Wind"
          value={`${current.windKph} km/h`}
        >
          <Compass deg={current.windDir} />
        </MetricTile>
      </motion.div>

      <motion.div variants={fadeUp}>
        <MetricTile
          icon={<Droplets className="size-4" />}
          label="Rainfall"
          value={`${current.rainfallMm} mm`}
          footnote="in last hour"
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <MetricTile
          icon={<Thermometer className="size-4" />}
          label="Feels Like"
          value={`${toUnit(current.feelsLikeC, unit)}°`}
          footnote={`Humidity ${current.humidity}%`}
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <MetricTile
          icon={<Eye className="size-4" />}
          label="Visibility"
          value={`${current.visibilityKm} km`}
        />
      </motion.div>

      <motion.div variants={fadeUp}>
        <MetricTile
          icon={<Gauge className="size-4" />}
          label="Pressure"
          value={`${current.pressureHpa}`}
          footnote="hPa"
        />
      </motion.div>
    </motion.div>
  );
}

function uvLabel(uv: number): string {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
}
