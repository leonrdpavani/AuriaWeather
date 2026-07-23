import { ScrollView, Text, useWindowDimensions, View } from "react-native";
import { MapPin } from "lucide-react-native";
import { GlassCard } from "@/ui";
import { ScreenBackground } from "@/components/ScreenBackground";
import { RadarView } from "@/features/weather/components/RadarView";
import { WeatherIcon } from "@/features/weather/components/WeatherIcon";
import { useCities } from "@/features/weather/hooks/useCities";
import { useCityWeather } from "@/features/weather/hooks/useCityWeather";
import { usePreferences } from "@/lib/preferences/preferences";
import { palette } from "@/constants/palette";

const LEGEND = [
  { label: "Light", color: palette.accent[400] },
  { label: "Moderate", color: palette.warning },
  { label: "Heavy", color: palette.danger },
];

/**
 * Tela de radar — mostra a precipitação simulada da cidade ativa num radar
 * animado. Sem tiles de mapa externos; os dados vêm do mock (probabilidade de
 * chuva por hora).
 */
export default function RadarScreen() {
  const { width } = useWindowDimensions();
  const { active } = useCities();
  const { data } = useCityWeather(active);
  const { reduceMotion } = usePreferences();

  const today = data?.days[0];
  const radarSize = Math.min(width - 64, 340);

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, gap: 16 }}
      >
        <View className="gap-1 px-1">
          <Text className="text-3xl font-semibold text-ink">Radar</Text>
          <View className="flex-row items-center gap-1.5">
            <MapPin size={14} color={palette.inkMuted} fill={palette.inkMuted} />
            <Text className="text-sm text-ink-muted">
              {data ? `${data.city}, ${data.country}` : "Loading…"}
            </Text>
          </View>
        </View>

        <GlassCard className="items-center gap-5 p-6">
          <View className="flex-row items-center gap-3 self-start">
            {today && (
              <WeatherIcon condition={today.condition} isDay={today.isDay} size={40} />
            )}
            <View>
              <Text className="text-base font-semibold text-ink">
                {today?.summary ?? "—"}
              </Text>
              <Text className="text-xs text-ink-muted">
                {today ? `${today.precipProbability}% chance of precipitation` : ""}
              </Text>
            </View>
          </View>

          {today && (
            <RadarView
              hourly={today.hourly}
              size={radarSize}
              animate={!reduceMotion}
            />
          )}

          <View className="flex-row items-center gap-5 self-center">
            {LEGEND.map((l) => (
              <View key={l.label} className="flex-row items-center gap-1.5">
                <View
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: l.color }}
                />
                <Text className="text-xs text-ink-muted">{l.label}</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        <Text className="px-2 text-center text-xs text-ink-subtle">
          Simulated radar · precipitation cells derived from the mock forecast
        </Text>
      </ScrollView>
    </ScreenBackground>
  );
}
