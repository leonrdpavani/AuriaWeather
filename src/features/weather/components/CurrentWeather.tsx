import { Text, View } from "react-native";
import { MotiView } from "moti";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react-native";
import { AnimatedNumber } from "@/ui";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import type { DayWeather, Unit } from "@/features/weather/types";
import { toUnit } from "@/lib/utils/format";
import { palette } from "@/constants/palette";

interface CurrentWeatherProps {
  city: string;
  country: string;
  /** "Today", "Tomorrow" ou o dia da semana. */
  label: string;
  day: DayWeather;
  unit: Unit;
}

/** Herói: cidade, dia, temperatura grande animada, condição e máx/mín. */
export function CurrentWeather({
  city,
  country,
  label,
  day,
  unit,
}: CurrentWeatherProps) {
  return (
    <View className="items-center gap-3 py-4">
      <View className="flex-row items-center gap-1.5">
        <MapPin size={16} color={palette.inkMuted} fill={palette.inkMuted} />
        <Text className="text-sm font-medium text-ink-muted">
          {city}, {country}
        </Text>
      </View>
      <Text className="text-xs font-semibold uppercase tracking-[3px] text-brand-300">
        {label}
      </Text>

      <MotiView
        key={`${day.date}-${day.condition}`}
        from={{ scale: 0.8, opacity: 0, rotate: "-6deg" }}
        animate={{ scale: 1, opacity: 1, rotate: "0deg" }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
      >
        <WeatherIcon condition={day.condition} isDay={day.isDay} size={140} />
      </MotiView>

      <AnimatedNumber
        value={toUnit(day.tempC, unit)}
        suffix="°"
        className="text-ink"
        style={{
          fontSize: 110,
          fontWeight: "200",
          lineHeight: 124,
          letterSpacing: -4,
          textAlign: "center",
        }}
      />

      <Text className="text-lg font-medium text-ink">{day.summary}</Text>

      <View className="flex-row items-center gap-4">
        <View className="flex-row items-center gap-1">
          <ChevronUp size={16} color={palette.warning} />
          <Text className="text-sm text-ink-muted">
            H: {toUnit(day.highC, unit)}°
          </Text>
        </View>
        <View className="flex-row items-center gap-1">
          <ChevronDown size={16} color={palette.accent[400]} />
          <Text className="text-sm text-ink-muted">
            L: {toUnit(day.lowC, unit)}°
          </Text>
        </View>
      </View>
    </View>
  );
}
