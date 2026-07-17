import { Text, View } from "react-native";
import { MotiView } from "moti";
import { Droplet } from "lucide-react-native";
import { GlassCard, ScrollRow } from "@/ui";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import type { HourlyPoint, Unit } from "@/features/weather/types";
import { formatHour, toUnit } from "@/lib/utils/format";
import { stagger } from "@/ui/tokens/motion";
import { palette } from "@/constants/palette";

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
 * Previsão hora a hora — carrossel horizontal.
 * Cada coluna empilha: temperatura, chance de chuva, ícone e a hora.
 */
export function HourlyForecast({
  hours,
  isDay,
  unit,
  showNow = true,
}: HourlyForecastProps) {
  return (
    <GlassCard className="p-4">
      <ScrollRow>
        {hours.map((hour, i) => (
          <MotiView
            key={hour.time}
            from={{ opacity: 0, translateY: 16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: "timing", duration: 400, delay: stagger(i) }}
            className="w-16 items-center gap-2 rounded-2xl px-2 py-3"
          >
            <Text className="text-sm font-semibold text-ink">
              {toUnit(hour.tempC, unit)}°
            </Text>
            <View className="flex-row items-center gap-0.5">
              <Droplet size={10} color={palette.accent[400]} fill={palette.accent[400]} />
              <Text className="text-[11px] font-medium text-accent-400">
                {hour.precipProbability}%
              </Text>
            </View>
            <WeatherIcon
              condition={hour.condition}
              isDay={showNow && i === 0 ? isDay : isDaytime(hour.time)}
              size={40}
            />
            <Text className="text-xs font-medium text-ink-muted">
              {showNow && i === 0 ? "Now" : formatHour(hour.time)}
            </Text>
          </MotiView>
        ))}
      </ScrollRow>
    </GlassCard>
  );
}
