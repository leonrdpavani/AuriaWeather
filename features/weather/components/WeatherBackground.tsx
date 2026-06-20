"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { WeatherCondition, WeatherTheme } from "@/features/weather/types";

/** Deriva o tema visual a partir da condição e de dia/noite. */
function resolveTheme(condition: WeatherCondition, isDay: boolean): WeatherTheme {
  if (condition === "thunderstorm") return "storm";
  if (!isDay) return "night";
  if (condition === "clear" || condition === "partly-cloudy") return "day-clear";
  return "day-cloudy";
}

/** Gradientes base por tema (de cima → baixo). */
const GRADIENTS: Record<WeatherTheme, string> = {
  "day-clear":
    "linear-gradient(160deg, #3a2f8f 0%, #5b4bd6 45%, #8b6fe0 100%)",
  "day-cloudy":
    "linear-gradient(160deg, #2b2b54 0%, #41416f 50%, #6d6aa3 100%)",
  night: "linear-gradient(160deg, #0b0a1f 0%, #1d1a44 55%, #3a2f7a 100%)",
  storm: "linear-gradient(160deg, #0a0a16 0%, #241f4a 50%, #4a3b86 100%)",
};

/** Cores dos orbes (aurora) por tema. */
const ORBS: Record<WeatherTheme, [string, string]> = {
  "day-clear": ["#a78bfa", "#38d0ff"],
  "day-cloudy": ["#8b87c9", "#6c5cf5"],
  night: ["#5a3fe6", "#14b5f0"],
  storm: ["#6c5cf5", "#ff6b81"],
};

interface WeatherBackgroundProps {
  condition: WeatherCondition;
  isDay: boolean;
}

/**
 * Fundo imersivo: gradiente que muda com o clima + dois orbes que flutuam.
 * Cross-fade suave quando o tema muda (troca de cidade).
 */
export function WeatherBackground({ condition, isDay }: WeatherBackgroundProps) {
  const theme = resolveTheme(condition, isDay);
  const [orbA, orbB] = ORBS[theme];

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={theme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
          style={{ background: GRADIENTS[theme] }}
        />
      </AnimatePresence>

      {/* Orbes aurora */}
      <div
        className="animate-aurora absolute -top-1/4 -left-1/4 size-[60vw] rounded-full opacity-50 blur-[120px]"
        style={{ background: orbA }}
      />
      <div
        className="animate-float-slow absolute -right-1/4 bottom-0 size-[55vw] rounded-full opacity-40 blur-[120px]"
        style={{ background: orbB }}
      />

      {/* Vinheta para dar profundidade e legibilidade ao conteúdo */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_40%,rgba(5,4,20,0.55)_100%)]" />
    </div>
  );
}
