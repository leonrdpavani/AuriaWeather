import { type ReactNode, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { MotiView } from "moti";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Cloud, Navigation, Star } from "lucide-react-native";
import { IconButton, SegmentedControl } from "@/ui";
import { usePreferences } from "@/lib/preferences/preferences";
import { useCities } from "@/features/weather/hooks/useCities";
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
import { fadeUpFrom, fadeUpTo, stagger } from "@/ui/tokens/motion";
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

/** Item de entrada com fade-up escalonado (ignorado se reduceMotion). */
function Section({
  index,
  animate,
  children,
}: {
  index: number;
  animate: boolean;
  children: ReactNode;
}) {
  if (!animate) return <View>{children}</View>;
  return (
    <MotiView
      from={fadeUpFrom}
      animate={fadeUpTo}
      transition={{ type: "timing", duration: 400, delay: stagger(index) }}
    >
      {children}
    </MotiView>
  );
}

/**
 * Orquestra a tela de clima: fundo reativo, busca, favoritar, herói do dia
 * selecionado, abas de detalhe e o seletor dos próximos dias. Unidade e
 * localidades vêm do estado global persistido (preferências + cidades).
 */
export function WeatherDashboard({
  data,
  refreshing = false,
}: {
  data: WeatherData;
  refreshing?: boolean;
}) {
  const { tempUnit, windUnit, reduceMotion, showAlerts, setPreference } =
    usePreferences();
  const { setActive, isSaved, toggleSaved } = useCities();
  const insets = useSafeAreaInsets();

  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Volta pro dia de hoje quando a cidade exibida muda (ajuste no render — sem
  // efeito, padrão recomendado do React para reagir a mudança de prop).
  const [shownCity, setShownCity] = useState(data.city);
  if (shownCity !== data.city) {
    setShownCity(data.city);
    setSelectedDayIndex(0);
  }

  const selectedDay = data.days[selectedDayIndex];
  const isToday = selectedDayIndex === 0;
  const favorited = isSaved(data.city);
  const anim = !reduceMotion;

  // Relógio do dispositivo lido uma vez após a montagem (impuro no render).
  const [nowMs, setNowMs] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- valor só-do-device (relógio) lido uma vez na montagem
    setNowMs(Date.now());
  }, []);

  const upcoming = useMemo(
    () =>
      buildUpcoming(data.days, nowMs ?? new Date(data.days[0].date).getTime()),
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
          opacity: refreshing ? 0.6 : 1,
        }}
      >
        {/* Top bar */}
        <Section index={0} animate={anim}>
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Cloud size={24} color={palette.brand[300]} fill={palette.brand[300]} />
                <Text className="text-lg font-semibold text-ink">{config.appName}</Text>
              </View>
              <SegmentedControl
                accessibilityLabel="Temperature unit"
                options={UNIT_OPTIONS}
                value={tempUnit}
                onChange={(u) => setPreference("tempUnit", u)}
              />
            </View>
            <View className="flex-row items-center gap-2">
              <CitySearch onSelect={setActive} className="flex-1" />
              <IconButton
                label={favorited ? "Remove from saved cities" : "Save this city"}
                accessibilityState={{ selected: favorited }}
                onPress={() => toggleSaved(data.city)}
              >
                <Star
                  size={18}
                  color={favorited ? palette.warning : palette.ink}
                  fill={favorited ? palette.warning : "transparent"}
                />
              </IconButton>
              <IconButton
                label="Use my location"
                onPress={() => setActive(config.defaultCity)}
              >
                <Navigation size={18} color={palette.ink} fill={palette.ink} />
              </IconButton>
            </View>
          </View>
        </Section>

        {/* Herói do dia selecionado */}
        <Section index={1} animate={anim}>
          <CurrentWeather
            city={data.city}
            country={data.country}
            label={dayLabel(selectedDayIndex, selectedDay.date)}
            day={selectedDay}
            unit={tempUnit}
          />
        </Section>

        {/* Próximas 24h */}
        <Section index={2} animate={anim}>
          <HourlyForecast hours={upcoming} isDay={data.days[0].isDay} unit={tempUnit} showNow />
        </Section>

        {/* Alertas (só hoje, se habilitado) */}
        {isToday && showAlerts && data.alerts.length > 0 && (
          <Section index={3} animate={anim}>
            <AlertBanner alerts={data.alerts} />
          </Section>
        )}

        {/* Abas de detalhe */}
        <Section index={4} animate={anim}>
          <DayDetailsTabs day={selectedDay} unit={tempUnit} windUnit={windUnit} />
        </Section>

        {/* Seletor de dias */}
        <Section index={5} animate={anim}>
          <DaySelector
            days={data.days}
            selectedIndex={selectedDayIndex}
            onSelect={setSelectedDayIndex}
            unit={tempUnit}
          />
        </Section>

        <Text className="text-center text-xs text-ink-subtle">
          Demo data · Built with Expo, Reanimated & Moti
        </Text>
      </ScrollView>
    </View>
  );
}
