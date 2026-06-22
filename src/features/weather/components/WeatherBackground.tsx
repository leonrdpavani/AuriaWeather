import { useWindowDimensions, View } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";
import { WeatherFX } from "@/features/weather/components/WeatherFX";
import type { WeatherCondition } from "@/features/weather/types";

/** Agrupa as 10 condições em 5 "humores" de céu (gradiente base). */
type SkyGroup = "clear" | "clouds" | "storm" | "snow" | "fog";

function skyGroup(condition: WeatherCondition): SkyGroup {
  if (condition === "thunderstorm") return "storm";
  if (condition === "snow") return "snow";
  if (condition === "fog") return "fog";
  if (condition === "clear" || condition === "partly-cloudy" || condition === "windy")
    return "clear";
  return "clouds"; // cloudy, overcast, drizzle, rain
}

/** Gradiente do céu por humor × dia/noite (de cima → baixo). */
const SKY: Record<string, [string, string, string]> = {
  "day-clear": ["#2b3aa0", "#5b53dd", "#8f7ef0"],
  "night-clear": ["#06061a", "#141238", "#2c2668"],
  "day-clouds": ["#2f3358", "#474c7e", "#73719f"],
  "night-clouds": ["#0a0a1c", "#1a1838", "#332f57"],
  "day-storm": ["#16182c", "#2a2750", "#46407c"],
  "night-storm": ["#060610", "#181634", "#322c63"],
  "day-snow": ["#3c4574", "#5a64a0", "#9aa1c8"],
  "night-snow": ["#10122c", "#262d57", "#454d83"],
  "day-fog": ["#3a3d54", "#565a78", "#888ba4"],
  "night-fog": ["#111320", "#222536", "#3b3d52"],
};

/** Cores dos orbes ambiente (aurora) por humor. */
const ORBS: Record<SkyGroup, [string, string]> = {
  clear: ["#a78bfa", "#38d0ff"],
  clouds: ["#8b87c9", "#6c5cf5"],
  storm: ["#6c5cf5", "#7e8bff"],
  snow: ["#9fb4ff", "#cdd6ff"],
  fog: ["#9a9db5", "#8b87c9"],
};

interface WeatherBackgroundProps {
  condition: WeatherCondition;
  isDay: boolean;
}

/**
 * Fundo imersivo e reativo ao clima — porte do WeatherBackground para RN:
 * gradiente de céu (cross-fade) + orbes ambiente + camadas animadas (WeatherFX)
 * + vinheta. Tudo atrás do conteúdo e sem capturar toques.
 */
export function WeatherBackground({ condition, isDay }: WeatherBackgroundProps) {
  const { width, height } = useWindowDimensions();
  const group = skyGroup(condition);
  const skyKey = `${isDay ? "day" : "night"}-${group}`;
  const [orbA, orbB] = ORBS[group];
  const orb = Math.min(width, height) * 1.1;

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden" }}
    >
      {/* Céu base (cross-fade ao trocar de condição) */}
      <MotiView
        key={skyKey}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: 1100 }}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <LinearGradient
          colors={SKY[skyKey]}
          locations={[0, 0.5, 1]}
          start={{ x: 0.1, y: 0 }}
          end={{ x: 0.4, y: 1 }}
          style={{ flex: 1 }}
        />
      </MotiView>

      {/* Orbes aurora (profundidade ambiente, bem sutis) */}
      <MotiView
        from={{ translateX: 0, translateY: 0, scale: 1 }}
        animate={{ translateX: orb * 0.06, translateY: -orb * 0.08, scale: 1.1 }}
        transition={{ loop: true, type: "timing", duration: 18000, repeatReverse: true }}
        style={{
          position: "absolute",
          left: -orb * 0.25,
          top: -orb * 0.25,
          width: orb,
          height: orb,
          borderRadius: orb / 2,
          backgroundColor: orbA,
          opacity: 0.28,
        }}
      />
      <MotiView
        from={{ translateY: 0 }}
        animate={{ translateY: -orb * 0.06 }}
        transition={{ loop: true, type: "timing", duration: 9000, repeatReverse: true }}
        style={{
          position: "absolute",
          right: -orb * 0.25,
          bottom: -orb * 0.1,
          width: orb * 0.9,
          height: orb * 0.9,
          borderRadius: orb / 2,
          backgroundColor: orbB,
          opacity: 0.22,
        }}
      />

      {/* Camadas reativas ao clima */}
      <WeatherFX key={`${condition}-${isDay ? "d" : "n"}`} condition={condition} isDay={isDay} />

      {/* Vinheta — profundidade e legibilidade do conteúdo */}
      <Svg
        width={width}
        height={height}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <Defs>
          <RadialGradient id="vignette" cx="50%" cy="0%" r="120%">
            <Stop offset="0.38" stopColor="#050414" stopOpacity={0} />
            <Stop offset="1" stopColor="#050414" stopOpacity={0.6} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill="url(#vignette)" />
      </Svg>
    </View>
  );
}
