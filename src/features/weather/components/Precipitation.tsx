import { useEffect, useMemo } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export type PrecipType = "none" | "drizzle" | "rain" | "heavy" | "snow";

/**
 * Precipitação — porte do <canvas> original para React Native.
 * Em vez de um canvas + requestAnimationFrame, cada gota/floco é uma View
 * animada pelo Reanimated na thread de UI (sem re-render). As contagens são
 * menores que no web (que ia a 260) para manter 60fps no mobile, mas cobrem
 * a tela inteira para o mesmo efeito.
 */

interface Spec {
  count: number;
  snow: boolean;
  minDur: number;
  maxDur: number;
  drift: number;
  color: string;
}

function specFor(type: Exclude<PrecipType, "none">): Spec {
  switch (type) {
    case "snow":
      return { count: 55, snow: true, minDur: 5000, maxDur: 9000, drift: 24, color: "#ffffff" };
    case "drizzle":
      return { count: 45, snow: false, minDur: 1600, maxDur: 2400, drift: 26, color: "rgba(196,226,255,0.5)" };
    case "rain":
      return { count: 75, snow: false, minDur: 900, maxDur: 1500, drift: 40, color: "rgba(196,226,255,0.55)" };
    case "heavy":
      return { count: 110, snow: false, minDur: 600, maxDur: 1000, drift: 70, color: "rgba(210,232,255,0.6)" };
  }
}

interface ParticleProps {
  spec: Spec;
  w: number;
  h: number;
  seed: number;
}

function Particle({ spec, w, h, seed }: ParticleProps) {
  const rand = (min: number, max: number, k = 1) =>
    min + ((Math.sin(seed * 99.7 * k) * 0.5 + 0.5) * (max - min));

  const startX = rand(0, w, 1);
  const dur = rand(spec.minDur, spec.maxDur, 2);
  const delay = rand(0, dur, 3);
  const size = spec.snow ? rand(2.4, 6, 4) : 0;
  const len = spec.snow ? size : rand(10, spec.drift > 50 ? 26 : 17, 4);
  const opacity = spec.snow ? rand(0.4, 0.9, 5) : rand(0.25, 0.6, 5);
  const drift = (rand(-1, 1, 6)) * spec.drift;
  const angle = spec.snow ? 0 : (Math.atan2(drift, h) * 180) / Math.PI;

  const t = useSharedValue(0);
  useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: dur, easing: Easing.linear }),
        -1,
        false,
      ),
    );
  }, [t, dur, delay]);

  const style = useAnimatedStyle(() => {
    const y = -len + t.value * (h + len * 2);
    const x = startX + t.value * drift;
    return {
      transform: [
        { translateX: x },
        { translateY: y },
        { rotate: `${angle}deg` },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          width: spec.snow ? size : 1.4,
          height: spec.snow ? size : len,
          borderRadius: spec.snow ? size : 1,
          backgroundColor: spec.color,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function Precipitation({ type }: { type: PrecipType }) {
  const { width, height } = useWindowDimensions();

  const particles = useMemo(() => {
    if (type === "none") return [];
    const spec = specFor(type);
    return Array.from({ length: spec.count }, (_, i) => ({
      key: `${type}-${i}`,
      seed: i + 1,
      spec,
    }));
  }, [type]);

  if (type === "none") return null;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
      }}
    >
      {particles.map((p) => (
        <Particle key={p.key} spec={p.spec} w={width} h={height} seed={p.seed} />
      ))}
    </View>
  );
}
