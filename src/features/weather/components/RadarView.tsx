import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";
import type { HourlyPoint } from "@/features/weather/types";
import { palette } from "@/constants/palette";

interface RadarViewProps {
  /** Pontos horários da cidade ativa — viram as células de precipitação. */
  hourly: HourlyPoint[];
  size: number;
  /** Anima a varredura (desligado quando reduceMotion). */
  animate?: boolean;
}

/** Cor da célula por intensidade de precipitação. */
function blipColor(p: number): string {
  if (p >= 66) return palette.danger;
  if (p >= 33) return palette.warning;
  return palette.accent[400];
}

/**
 * Radar de precipitação estilizado (dados simulados). Anéis de alcance +
 * cruzeta + células derivadas da probabilidade de chuva por hora, com uma
 * varredura contínua por cima (Reanimated). Sem tiles de mapa externos.
 */
export function RadarView({ hourly, size, animate = true }: RadarViewProps) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 6;
  const sweep = useSharedValue(0);

  useEffect(() => {
    if (!animate) return;
    sweep.value = withRepeat(
      withTiming(360, { duration: 4200, easing: Easing.linear }),
      -1,
    );
    return () => {
      sweep.value = 0;
    };
  }, [animate, sweep]);

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sweep.value}deg` }],
  }));

  // Espalha as células pelo disco com o ângulo áureo (distribuição estável).
  const blips = hourly.slice(0, 12).map((h, i) => {
    const angle = (i * 137.5 * Math.PI) / 180;
    const r = maxR * (0.22 + ((i % 4) / 4) * 0.72);
    return {
      key: h.time,
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      radius: 4 + (h.precipProbability / 100) * 16,
      color: blipColor(h.precipProbability),
      opacity: 0.25 + (h.precipProbability / 100) * 0.5,
    };
  });

  return (
    <View style={{ width: size, height: size }}>
      {/* Base estática: disco, anéis, cruzeta, células */}
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="radarDisc" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#171a35" />
            <Stop offset="1" stopColor="#0c0d22" />
          </LinearGradient>
        </Defs>

        <Circle cx={cx} cy={cy} r={maxR} fill="url(#radarDisc)" />

        {[0.33, 0.66, 1].map((f) => (
          <Circle
            key={f}
            cx={cx}
            cy={cy}
            r={maxR * f}
            fill="none"
            stroke={palette.glassBorder}
            strokeWidth={1}
          />
        ))}

        <Line x1={cx} y1={cy - maxR} x2={cx} y2={cy + maxR} stroke={palette.glassBorder} strokeWidth={1} />
        <Line x1={cx - maxR} y1={cy} x2={cx + maxR} y2={cy} stroke={palette.glassBorder} strokeWidth={1} />

        {blips.map((b) => (
          <Circle
            key={b.key}
            cx={b.x}
            cy={b.y}
            r={b.radius}
            fill={b.color}
            opacity={b.opacity}
          />
        ))}

        <Circle cx={cx} cy={cy} r={3} fill={palette.brand[300]} />
      </Svg>

      {/* Varredura giratória por cima */}
      <Animated.View
        style={[StyleSheet.absoluteFill, sweepStyle]}
        pointerEvents="none"
      >
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="sweepFade" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={palette.accent[400]} stopOpacity={0.45} />
              <Stop offset="1" stopColor={palette.accent[400]} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <G>
            {/* Setor de varredura (~55°) + raio-guia luminoso */}
            <Path
              d={`M${cx} ${cy} L${cx + maxR} ${cy} A${maxR} ${maxR} 0 0 0 ${
                cx + maxR * Math.cos(-0.96)
              } ${cy + maxR * Math.sin(-0.96)} Z`}
              fill="url(#sweepFade)"
            />
            <Line
              x1={cx}
              y1={cy}
              x2={cx + maxR}
              y2={cy}
              stroke={palette.accent[300]}
              strokeWidth={2}
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}
