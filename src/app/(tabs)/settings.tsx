import { ScrollView, Switch, Text, View } from "react-native";
import Constants from "expo-constants";
import {
  Bell,
  Sparkles,
  Thermometer,
  Wind as WindIcon,
} from "lucide-react-native";
import { GlassCard, SegmentedControl, SettingRow, type SegmentOption } from "@/ui";
import { ScreenBackground } from "@/components/ScreenBackground";
import { usePreferences } from "@/lib/preferences/preferences";
import type { Unit, WindUnit } from "@/lib/utils/format";
import { config } from "@/lib/config";
import { palette } from "@/constants/palette";

const ICON = palette.inkMuted;

const TEMP_OPTIONS: SegmentOption<Unit>[] = [
  { value: "celsius", label: "°C" },
  { value: "fahrenheit", label: "°F" },
];

const WIND_OPTIONS: SegmentOption<WindUnit>[] = [
  { value: "kmh", label: "km/h" },
  { value: "mph", label: "mph" },
];

/** Cor da trilha do Switch ligado/desligado. */
const TRACK = { false: "rgba(255,255,255,0.12)", true: palette.brand[500] };

/** Cabeçalho de grupo de configurações. */
function GroupLabel({ children }: { children: string }) {
  return (
    <Text className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-ink-subtle">
      {children}
    </Text>
  );
}

/**
 * Tela de ajustes. Unidades, movimento e alertas — tudo ligado às preferências
 * globais persistidas (mudou aqui, reflete no app e sobrevive ao fechamento).
 */
export default function SettingsScreen() {
  const {
    tempUnit,
    windUnit,
    reduceMotion,
    showAlerts,
    setPreference,
  } = usePreferences();

  const version = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, gap: 20 }}
      >
        <View className="gap-1 px-1">
          <Text className="text-3xl font-semibold text-ink">Settings</Text>
          <Text className="text-sm text-ink-muted">
            Preferences are saved on this device.
          </Text>
        </View>

        {/* Unidades */}
        <View>
          <GroupLabel>Units</GroupLabel>
          <GlassCard>
            <SettingRow
              icon={<Thermometer size={16} color={ICON} />}
              title="Temperature"
              description="Used across all screens"
              trailing={
                <SegmentedControl
                  accessibilityLabel="Temperature unit"
                  options={TEMP_OPTIONS}
                  value={tempUnit}
                  onChange={(v) => setPreference("tempUnit", v)}
                />
              }
            />
            <SettingRow
              divided
              icon={<WindIcon size={16} color={ICON} />}
              title="Wind speed"
              trailing={
                <SegmentedControl
                  accessibilityLabel="Wind speed unit"
                  options={WIND_OPTIONS}
                  value={windUnit}
                  onChange={(v) => setPreference("windUnit", v)}
                />
              }
            />
          </GlassCard>
        </View>

        {/* Experiência */}
        <View>
          <GroupLabel>Experience</GroupLabel>
          <GlassCard>
            <SettingRow
              icon={<Sparkles size={16} color={ICON} />}
              title="Reduce motion"
              description="Turn off entrance and radar animations"
              trailing={
                <Switch
                  value={reduceMotion}
                  onValueChange={(v) => setPreference("reduceMotion", v)}
                  trackColor={TRACK}
                  thumbColor={palette.white}
                  ios_backgroundColor={TRACK.false}
                />
              }
            />
            <SettingRow
              divided
              icon={<Bell size={16} color={ICON} />}
              title="Severe weather alerts"
              description="Show the alert banner on the home screen"
              trailing={
                <Switch
                  value={showAlerts}
                  onValueChange={(v) => setPreference("showAlerts", v)}
                  trackColor={TRACK}
                  thumbColor={palette.white}
                  ios_backgroundColor={TRACK.false}
                />
              }
            />
          </GlassCard>
        </View>

        {/* Sobre */}
        <View>
          <GroupLabel>About</GroupLabel>
          <GlassCard className="gap-1 p-4">
            <Text className="text-base font-semibold text-ink">
              {config.appName}
            </Text>
            <Text className="text-xs text-ink-muted">
              Version {version} · Demo data (mock). Built with Expo, Reanimated & Moti.
            </Text>
          </GlassCard>
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}
