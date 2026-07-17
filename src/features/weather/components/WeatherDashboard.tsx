import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { MotiView } from "moti";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Cloud, Navigation } from "lucide-react-native";
import { IconButton, SegmentedControl } from "@/ui";
import { useWeather } from "@/features/weather/hooks/useWeather";
import { CurrentWeather } from "@/features/weather/components/CurrentWeather";
import { DayDetailsTabs } from "@/features/weather/components/DayDetailsTabs";
import { DaySelector } from "@/features/weather/components/DaySelector";
import { HourlyForecast } from "@/features/weather/components/HourlyForecast";
import { WeatherBackground } from "@/features/weather/components/WeatherBackground";
import { AlertBanner } from "@/features/weather/components/AlertBanner";
import { CitySearch } from "@/features/weather/components/CitySearch";
import type { HourlyPoint, Unit, WeatherData } from "@/features/weather/types";
import { config } from "@/lib/config";
import { formatWeekday } from "@/lib/utils/format";
import { stagger } from "@/ui/tokens/motion";
import { palette } from "@/constants/palette";

const UNIT_OPTIONS = [
  { value: "celsius" as Unit, label: "°C" },
  { value: "fahrenheit" as Unit, label: "°F" },
];

function dayLabel(index: number, iso: string): string {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return formatWeekday(iso);
}

/** Próximas 24h a partir de agora, em passos de 2h (até 12 pontos). */
function buildUpcoming(days: WeatherData["days"], nowMs: number): HourlyPoint[] {
  const points = [...days[0].hourly, ...(days[1]?.hourly ?? [])];
  const dayStart = new Date(days[0].date).getTime();
  const startIdx = Math.max(0, Math.floor((nowMs - dayStart) / 3_600_000));
  const out: HourlyPoint[] = [];
  for (let i = startIdx; i < points.length && out.length < 12; i += 2) {
    out.push(points[i]);
  }
  return out;
}

/** Item de entrada com fade-up escalonado. */
function Section({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400, delay: stagger(index) }}
    >
      {children}
    </MotiView>
  );
}

/**
 * Orquestra a tela de clima: fundo reativo, busca, unidade, herói do dia
 * selecionado, abas de detalhe e o seletor dos próximos dias.
 */
export function WeatherDashboard({ initialData }: { initialData: WeatherData }) {
  const {
    data,
    unit,
    setUnit,
    selectedDayIndex,
    selectDay,
    isLoading,
    selectCity,
  } = useWeather(initialData);
  const insets = useSafeAreaInsets();

  const selectedDay = data.days[selectedDayIndex];
  const isToday = selectedDayIndex === 0;

  // Lê o relógio do dispositivo uma vez, após a montagem (Date.now() é impuro
  // e não pode ser chamado durante o render). Antes disso, usa o início do dia.
  const [nowMs, setNowMs] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- valor só-do-device (relógio) lido uma vez na montagem
    setNowMs(Date.now());
  }, []);

  const upcoming = useMemo(
    () =>
      buildUpcoming(
        data.days,
        nowMs ?? new Date(data.days[0].date).getTime(),
      ),
    [data.days, nowMs],
  );

  return (
    <View className="flex-1">
      <WeatherBackground condition={selectedDay.condition} isDay={selectedDay.isDay} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        // zIndex explícito: no web (CSS) o fundo absoluto pintaria por cima do
        // conteúdo estático; no nativo a ordem já resolve. Mantém consistente.
        style={{ zIndex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 16,
          paddingBottom: 120,
          gap: 20,
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {/* Top bar */}
        <Section index={0}>
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Cloud size={24} color={palette.brand[300]} fill={palette.brand[300]} />
                <Text className="text-lg font-semibold text-ink">{config.appName}</Text>
              </View>
              <SegmentedControl
                accessibilityLabel="Temperature unit"
                options={UNIT_OPTIONS}
                value={unit}
                onChange={setUnit}
              />
            </View>
            <View className="flex-row items-center gap-2">
              <CitySearch onSelect={selectCity} className="flex-1" />
              <IconButton
                label="Use my location"
                onPress={() => selectCity(config.defaultCity)}
              >
                <Navigation size={18} color={palette.ink} fill={palette.ink} />
              </IconButton>
            </View>
          </View>
        </Section>

        {/* Herói do dia selecionado */}
        <Section index={1}>
          <CurrentWeather
            city={data.city}
            country={data.country}
            label={dayLabel(selectedDayIndex, selectedDay.date)}
            day={selectedDay}
            unit={unit}
          />
        </Section>

        {/* Próximas 24h */}
        <Section index={2}>
          <HourlyForecast hours={upcoming} isDay={data.days[0].isDay} unit={unit} showNow />
        </Section>

        {/* Alertas (só hoje) */}
        {isToday && data.alerts.length > 0 && (
          <Section index={3}>
            <AlertBanner alerts={data.alerts} />
          </Section>
        )}

        {/* Abas de detalhe */}
        <Section index={4}>
          <DayDetailsTabs day={selectedDay} unit={unit} />
        </Section>

        {/* Seletor de dias */}
        <Section index={5}>
          <DaySelector
            days={data.days}
            selectedIndex={selectedDayIndex}
            onSelect={selectDay}
            unit={unit}
          />
        </Section>

        <Text className="text-center text-xs text-ink-subtle">
          Demo data · Built with Expo, Reanimated & Moti
        </Text>
      </ScrollView>
    </View>
  );
}
