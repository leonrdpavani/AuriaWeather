"use client";

import { motion } from "framer-motion";
import { clamp, formatClock } from "@/lib/utils/format";

/** Barra de nível com gradiente e marcador na posição (0–100%). */
export function LevelBar({ pct, label }: { pct: number; label?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative h-1.5 rounded-full bg-gradient-to-r from-success via-warning to-danger">
        <motion.span
          initial={{ left: 0, opacity: 0 }}
          animate={{ left: `${clamp(pct, 2, 98)}%`, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow"
        />
      </div>
      {label && <span className="text-xs text-ink-subtle">{label}</span>}
    </div>
  );
}

/** Mini bússola do vento (a agulha aponta a direção). */
export function Compass({ deg }: { deg: number }) {
  return (
    <div className="relative mx-auto size-20 rounded-full border border-glass-border">
      <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-ink-subtle">
        N
      </span>
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: deg }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="h-9 w-1 rounded-full bg-gradient-to-t from-transparent to-accent-400" />
      </motion.div>
    </div>
  );
}

/** Arco de nascer/pôr do sol. */
export function SunArc({
  sunrise,
  sunset,
}: {
  sunrise: string;
  sunset: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <svg viewBox="0 0 100 40" className="h-12 w-full overflow-visible">
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

export function uvLabel(uv: number): string {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
}
