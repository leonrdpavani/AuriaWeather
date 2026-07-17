import { Text, View } from "react-native";
import { MotiView } from "moti";
import { AlertTriangle } from "lucide-react-native";
import type { WeatherAlert } from "@/features/weather/types";
import { cn } from "@/lib/utils/cn";
import { palette } from "@/constants/palette";

const SEVERITY_BOX: Record<WeatherAlert["severity"], string> = {
  advisory: "border-accent-400/40 bg-accent-400/10",
  watch: "border-warning/40 bg-warning/10",
  warning: "border-danger/40 bg-danger/10",
};

const SEVERITY_COLOR: Record<WeatherAlert["severity"], string> = {
  advisory: palette.accent[300],
  watch: palette.warning,
  warning: palette.danger,
};

/** Faixa de alertas meteorológicos (some quando não há alertas). */
export function AlertBanner({ alerts }: { alerts: WeatherAlert[] }) {
  return (
    <View className="gap-3">
      {alerts.map((alert, i) => (
        <MotiView
          key={alert.id}
          from={{ opacity: 0, translateY: -8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 400, delay: i * 80 }}
          className={cn(
            "flex-row items-start gap-3 rounded-2xl border p-4",
            SEVERITY_BOX[alert.severity],
          )}
        >
          <AlertTriangle
            size={20}
            color={SEVERITY_COLOR[alert.severity]}
            style={{ marginTop: 2 }}
          />
          <View className="flex-1 gap-0.5">
            <Text
              className="text-sm font-semibold"
              style={{ color: SEVERITY_COLOR[alert.severity] }}
            >
              {alert.title}
            </Text>
            <Text className="text-xs text-ink-muted">{alert.description}</Text>
          </View>
        </MotiView>
      ))}
    </View>
  );
}
