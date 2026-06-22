import { Text, View } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Path } from "react-native-svg";
import { clamp, formatClock } from "@/lib/utils/format";
import { palette } from "@/constants/palette";

/** Barra de nível com gradiente e marcador na posição (0–100%). */
export function LevelBar({ pct, label }: { pct: number; label?: string }) {
  return (
    <View className="gap-1.5">
      <View className="h-1.5 justify-center rounded-full overflow-hidden">
        <LinearGradient
          colors={[palette.success, palette.warning, palette.danger]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
        />
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", duration: 600, delay: 150 }}
          className="absolute size-3 rounded-full border-2 border-white bg-white"
          style={{ left: `${clamp(pct, 2, 98)}%`, marginLeft: -6 }}
        />
      </View>
      {label && <Text className="text-xs text-ink-subtle">{label}</Text>}
    </View>
  );
}

/** Mini bússola do vento (a agulha aponta a direção). */
export function Compass({ deg }: { deg: number }) {
  return (
    <View className="size-20 self-center rounded-full border border-glass-border">
      <Text className="absolute left-0 right-0 top-1 text-center text-[9px] text-ink-subtle">
        N
      </Text>
      <MotiView
        className="absolute inset-0 items-center justify-center"
        from={{ rotate: "0deg" }}
        animate={{ rotate: `${deg}deg` }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        <LinearGradient
          colors={["transparent", palette.accent[400]]}
          style={{ height: 36, width: 4, borderRadius: 2 }}
        />
      </MotiView>
    </View>
  );
}

/** Arco de nascer/pôr do sol. */
export function SunArc({
  sunrise,
  sunset,
}: {
  sunrise: string;
  sunset: string;
}) {
  return (
    <View className="gap-1">
      <Svg viewBox="0 0 100 44" width="100%" height={48}>
        <Path
          d="M5 40 A45 45 0 0 1 95 40"
          fill="none"
          stroke={palette.glassBorder}
          strokeWidth={2}
          strokeDasharray="3 3"
        />
        <Circle cx={50} cy={4} r={4} fill={palette.warning} />
      </Svg>
      <View className="flex-row justify-between">
        <Text className="text-xs text-ink-subtle">↑ {formatClock(sunrise)}</Text>
        <Text className="text-xs text-ink-subtle">↓ {formatClock(sunset)}</Text>
      </View>
    </View>
  );
}

export function uvLabel(uv: number): string {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
}
