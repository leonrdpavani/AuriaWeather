import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { CalendarDays, Droplet } from "lucide-react-native";
import { GlassCard, SectionHeader } from "@/ui";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import type { DayWeather, Unit } from "@/features/weather/types";
import { formatWeekday, toUnit } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import { palette } from "@/constants/palette";

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
    <GlassCard className="gap-3 p-5">
      <SectionHeader
        title="Next 7 Days"
        icon={<CalendarDays size={15} color={palette.inkMuted} />}
      />
      <View className="gap-1">
        {days.map((day, i) => {
          const active = i === selectedIndex;
          const left = ((day.lowC - min) / span) * 100;
          const width = ((day.highC - day.lowC) / span) * 100;
          return (
            <Pressable
              key={day.date}
              onPress={() => onSelect(i)}
              accessibilityState={{ selected: active }}
              className={cn(
                "flex-row items-center gap-3 rounded-2xl px-3 py-2.5",
                active && "border border-brand-400/40 bg-glass-strong",
              )}
            >
              <Text
                className={cn(
                  "w-14 text-sm font-medium",
                  active ? "text-ink" : "text-ink-muted",
                )}
              >
                {dayLabel(i, day.date)}
              </Text>
              <WeatherIcon condition={day.condition} isDay={day.isDay} size={26} />
              <View className="flex-1 flex-row items-center gap-2">
                {day.precipProbability > 20 && (
                  <View className="w-9 flex-row items-center gap-0.5">
                    <Droplet size={11} color={palette.accent[400]} fill={palette.accent[400]} />
                    <Text className="text-[11px] font-medium text-accent-400">
                      {day.precipProbability}%
                    </Text>
                  </View>
                )}
                <Text className="ml-auto w-7 text-right text-sm text-ink-subtle">
                  {toUnit(day.lowC, unit)}°
                </Text>
                <View className="h-1.5 min-w-8 flex-1 justify-center rounded-full bg-glass">
                  <LinearGradient
                    colors={[palette.accent[400], palette.brand[400]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      position: "absolute",
                      height: "100%",
                      borderRadius: 999,
                      left: `${left}%`,
                      width: `${Math.max(width, 6)}%`,
                    }}
                  />
                </View>
                <Text className="w-7 text-sm font-medium text-ink">
                  {toUnit(day.highC, unit)}°
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </GlassCard>
  );
}
