import { Icon } from "@iconify/react";
import type { WeatherCondition } from "@/features/weather/types";
import { cn } from "@/lib/utils/cn";

/** Condição do domínio → nome do ícone meteocons (colorido/3D). */
function iconName(condition: WeatherCondition, isDay: boolean): string {
  const suffix = isDay ? "day" : "night";
  const map: Record<WeatherCondition, string> = {
    clear: `meteocons:clear-${suffix}`,
    "partly-cloudy": `meteocons:partly-cloudy-${suffix}`,
    cloudy: "meteocons:cloudy",
    overcast: `meteocons:overcast-${suffix}`,
    fog: `meteocons:fog-${suffix}`,
    drizzle: "meteocons:drizzle",
    rain: "meteocons:rain",
    thunderstorm: "meteocons:thunderstorms-rain",
    snow: "meteocons:snow",
    windy: "meteocons:wind",
  };
  return map[condition];
}

interface WeatherIconProps {
  condition: WeatherCondition;
  isDay?: boolean;
  /** Tamanho em px. */
  size?: number;
  className?: string;
}

/** Ícone de condição climática (Iconify meteocons). Conhece o domínio → feature. */
export function WeatherIcon({
  condition,
  isDay = true,
  size = 48,
  className,
}: WeatherIconProps) {
  return (
    <Icon
      icon={iconName(condition, isDay)}
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      aria-hidden
    />
  );
}
