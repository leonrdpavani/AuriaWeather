import { Pressable, Text, View } from "react-native";
import { ChevronUp, ChevronDown, X } from "lucide-react-native";
import { GlassCard } from "@/ui";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import { useCityWeather } from "@/features/weather/hooks/useCityWeather";
import type { Unit } from "@/features/weather/types";
import { toUnit } from "@/lib/utils/format";
import { palette } from "@/constants/palette";

interface CityCardProps {
  city: string;
  unit: Unit;
  active: boolean;
  onOpen: (city: string) => void;
  onRemove: (city: string) => void;
}

/**
 * Cartão de uma cidade salva: busca o clima dela (mock) e mostra ícone,
 * condição e temperatura. Tocar abre a cidade na Home; o "X" remove.
 */
export function CityCard({ city, unit, active, onOpen, onRemove }: CityCardProps) {
  const { data } = useCityWeather(city);
  const day = data?.days[0];

  return (
    <Pressable onPress={() => onOpen(city)} accessibilityRole="button">
      <GlassCard
        interactive
        className={active ? "border-brand-400/50 p-4" : "p-4"}
      >
        <View className="flex-row items-center gap-3">
          {day ? (
            <WeatherIcon condition={day.condition} isDay={day.isDay} size={48} />
          ) : (
            <View className="size-12 rounded-full bg-glass" />
          )}

          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-base font-semibold text-ink" numberOfLines={1}>
                {data?.city ?? city}
              </Text>
              {active && (
                <View className="rounded-full bg-brand-500/30 px-2 py-0.5">
                  <Text className="text-[10px] font-semibold uppercase tracking-wide text-brand-200">
                    Active
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-xs text-ink-muted" numberOfLines={1}>
              {data ? `${data.country} · ${day?.summary}` : "Loading…"}
            </Text>
          </View>

          {day && (
            <View className="items-end">
              <Text className="text-2xl font-light text-ink">
                {toUnit(day.tempC, unit)}°
              </Text>
              <View className="flex-row items-center gap-2">
                <View className="flex-row items-center gap-0.5">
                  <ChevronUp size={12} color={palette.warning} />
                  <Text className="text-[11px] text-ink-subtle">
                    {toUnit(day.highC, unit)}°
                  </Text>
                </View>
                <View className="flex-row items-center gap-0.5">
                  <ChevronDown size={12} color={palette.accent[400]} />
                  <Text className="text-[11px] text-ink-subtle">
                    {toUnit(day.lowC, unit)}°
                  </Text>
                </View>
              </View>
            </View>
          )}

          <Pressable
            onPress={() => onRemove(city)}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${city}`}
            hitSlop={8}
            className="ml-1 size-8 items-center justify-center rounded-full active:bg-glass-strong"
          >
            <X size={16} color={palette.inkSubtle} />
          </Pressable>
        </View>
      </GlassCard>
    </Pressable>
  );
}
