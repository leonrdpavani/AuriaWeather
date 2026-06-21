"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { WeatherCondition } from "@/features/weather/types";
import { WeatherFX } from "@/features/weather/components/WeatherFX";

/** Agrupa as 10 condições em 5 "humores" de céu (gradiente base). */
type SkyGroup = "clear" | "clouds" | "storm" | "snow" | "fog";

function skyGroup(condition: WeatherCondition): SkyGroup {
  if (condition === "thunderstorm") return "storm";
  if (condition === "snow") return "snow";
  if (condition === "fog") return "fog";
  if (condition === "clear" || condition === "partly-cloudy" || condition === "windy")
    return "clear";
  return "clouds"; // cloudy, overcast, drizzle, rain
}

/** Gradiente do céu por humor × dia/noite (de cima → baixo). */
const SKY: Record<string, string> = {
  "day-clear": "linear-gradient(165deg, #2b3aa0 0%, #5b53dd 48%, #8f7ef0 100%)",
  "night-clear": "linear-gradient(165deg, #06061a 0%, #141238 52%, #2c2668 100%)",
  "day-clouds": "linear-gradient(165deg, #2f3358 0%, #474c7e 50%, #73719f 100%)",
  "night-clouds": "linear-gradient(165deg, #0a0a1c 0%, #1a1838 52%, #332f57 100%)",
  "day-storm": "linear-gradient(165deg, #16182c 0%, #2a2750 50%, #46407c 100%)",
  "night-storm": "linear-gradient(165deg, #060610 0%, #181634 50%, #322c63 100%)",
  "day-snow": "linear-gradient(165deg, #3c4574 0%, #5a64a0 50%, #9aa1c8 100%)",
  "night-snow": "linear-gradient(165deg, #10122c 0%, #262d57 52%, #454d83 100%)",
  "day-fog": "linear-gradient(165deg, #3a3d54 0%, #565a78 50%, #888ba4 100%)",
  "night-fog": "linear-gradient(165deg, #111320 0%, #222536 52%, #3b3d52 100%)",
};

/** Cores dos orbes ambiente (aurora) por humor. */
const ORBS: Record<SkyGroup, [string, string]> = {
  clear: ["#a78bfa", "#38d0ff"],
  clouds: ["#8b87c9", "#6c5cf5"],
  storm: ["#6c5cf5", "#7e8bff"],
  snow: ["#9fb4ff", "#cdd6ff"],
  fog: ["#9a9db5", "#8b87c9"],
};

interface WeatherBackgroundProps {
  condition: WeatherCondition;
  isDay: boolean;
}

/**
 * Fundo imersivo e reativo ao clima: gradiente de céu + orbes ambiente +
 * camadas animadas (sol/lua, estrelas, nuvens, chuva/neve, névoa, relâmpago).
 * Cross-fade suave a cada troca de condição/cidade. Tudo atrás do conteúdo e
 * sem capturar ponteiro (não interfere na UX).
 */
export function WeatherBackground({ condition, isDay }: WeatherBackgroundProps) {
  const group = skyGroup(condition);
  const skyKey = `${isDay ? "day" : "night"}-${group}`;
  const fxKey = `${condition}-${isDay ? "d" : "n"}`;
  const [orbA, orbB] = ORBS[group];

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Céu base (cross-fade entre gradientes) */}
      <AnimatePresence>
        <motion.div
          key={skyKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
          className="absolute inset-0"
          style={{ background: SKY[skyKey] }}
        />
      </AnimatePresence>

      {/* Orbes aurora (profundidade ambiente, bem sutis) */}
      <div
        className="animate-aurora absolute -left-1/4 -top-1/4 size-[55vw] rounded-full opacity-30 blur-[120px]"
        style={{ background: orbA }}
      />
      <div
        className="animate-float-slow absolute -right-1/4 bottom-0 size-[50vw] rounded-full opacity-25 blur-[120px]"
        style={{ background: orbB }}
      />

      {/* Camadas reativas ao clima (cross-fade na troca de condição) */}
      <AnimatePresence mode="sync">
        <motion.div
          key={fxKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <WeatherFX condition={condition} isDay={isDay} />
        </motion.div>
      </AnimatePresence>

      {/* Vinheta — profundidade e legibilidade do conteúdo */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,transparent_38%,rgba(5,4,20,0.6)_100%)]" />
    </div>
  );
}
