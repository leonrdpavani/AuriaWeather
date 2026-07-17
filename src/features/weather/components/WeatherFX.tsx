import { useEffect, useMemo } from "react";
import { useWindowDimensions, View } from "react-native";
import { MotiView } from "moti";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, RadialGradient, Stop } from "react-native-svg";
import { Precipitation, type PrecipType } from "@/features/weather/components/Precipitation";
import type { WeatherCondition } from "@/features/weather/types";

/* ============================================================================
   Cena: traduz (condição + dia/noite) nas camadas visuais a mostrar.
   Porte do WeatherFX do web — mesma lógica de composição de camadas.
   ============================================================================ */

type CloudTint = "light" | "grey" | "dark";

interface Scene {
  celestial: "sun" | "moon" | null;
  celestialDim: boolean;
  stars: number;
  clouds: number;
  cloudTint: CloudTint;
  cloudSpeed: number; // segundos-base para cruzar a tela
  precip: PrecipType;
  fog: boolean;
  lightning: boolean;
}

function resolveScene(condition: WeatherCondition, isDay: boolean): Scene {
  const body = isDay ? "sun" : "moon";
  const base: Scene = {
    celestial: null,
    celestialDim: false,
    stars: 0,
    clouds: 0,
    cloudTint: "light",
    cloudSpeed: 95,
    precip: "none",
    fog: false,
    lightning: false,
  };

  // Contagens de estrelas/nuvens enxutas para boa fluidez em celular (cada
  // estrela/nuvem é uma View animada na thread de UI).
  switch (condition) {
    case "clear":
      return { ...base, celestial: body, stars: isDay ? 0 : 40 };
    case "partly-cloudy":
      return { ...base, celestial: body, stars: isDay ? 0 : 22, clouds: 3 };
    case "cloudy":
      return { ...base, celestial: body, celestialDim: true, clouds: 4, cloudTint: "grey" };
    case "overcast":
      return { ...base, clouds: 5, cloudTint: "dark", cloudSpeed: 120 };
    case "fog":
      return { ...base, celestial: body, celestialDim: true, clouds: 2, cloudTint: "grey", fog: true };
    case "drizzle":
      return { ...base, clouds: 4, cloudTint: "grey", precip: "drizzle" };
    case "rain":
      return { ...base, clouds: 5, cloudTint: "dark", precip: "rain" };
    case "thunderstorm":
      return { ...base, clouds: 5, cloudTint: "dark", cloudSpeed: 65, precip: "heavy", lightning: true };
    case "snow":
      return { ...base, clouds: 4, cloudTint: "grey", precip: "snow", stars: isDay ? 0 : 12 };
    case "windy":
      return { ...base, celestial: body, clouds: 4, cloudSpeed: 38, stars: isDay ? 0 : 18 };
  }
}

/* PRNG determinístico (mulberry32) — porte verbatim do original. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ============================================================================
   Sol / Lua (disco + halo via gradiente radial SVG, com pulsar)
   ============================================================================ */
function Celestial({ type, dim }: { type: "sun" | "moon"; dim: boolean }) {
  const isSun = type === "sun";
  return (
    <MotiView
      className="absolute"
      style={{ right: "12%", top: "6%", opacity: dim ? 0.6 : 1 }}
      from={{ scale: 1, opacity: dim ? 0.5 : 0.85 }}
      animate={{ scale: 1.05, opacity: dim ? 0.6 : 1 }}
      transition={{ loop: true, type: "timing", duration: 3500, repeatReverse: true }}
    >
      <Svg width={240} height={240}>
        <Defs>
          <RadialGradient id="halo" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={isSun ? "#ffce78" : "#bac4ff"} stopOpacity={isSun ? 0.4 : 0.32} />
            <Stop offset="0.65" stopColor={isSun ? "#ffce78" : "#bac4ff"} stopOpacity={0} />
          </RadialGradient>
          <RadialGradient id="disc" cx="38%" cy="34%" r="70%">
            <Stop offset="0" stopColor={isSun ? "#fff6db" : "#fdfcff"} />
            <Stop offset="0.55" stopColor={isSun ? "#ffd277" : "#d8d6f0"} />
            <Stop offset="1" stopColor={isSun ? "#f6b64e" : "#b9b6da"} />
          </RadialGradient>
        </Defs>
        <Circle cx={120} cy={120} r={120} fill="url(#halo)" />
        <Circle cx={120} cy={120} r={46} fill="url(#disc)" />
      </Svg>
    </MotiView>
  );
}

/* ============================================================================
   Estrelas (piscam)
   ============================================================================ */
function Stars({ count, w, h }: { count: number; w: number; h: number }) {
  const stars = useMemo(() => {
    const r = mulberry32(count * 9 + 17);
    return Array.from({ length: count }, () => ({
      left: r() * w,
      top: r() * h * 0.56,
      size: 0.8 + r() * 2.1,
      delay: r() * 4000,
      dur: 2200 + r() * 3000,
    }));
  }, [count, w, h]);

  return (
    <>
      {stars.map((s, i) => (
        <MotiView
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
          from={{ opacity: 0.25, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            loop: true,
            type: "timing",
            duration: s.dur,
            delay: s.delay,
            repeatReverse: true,
          }}
        />
      ))}
    </>
  );
}

/* ============================================================================
   Nuvens (clusters de círculos translúcidos atravessando o céu)
   ============================================================================ */
const CLOUD_RGBA: Record<CloudTint, string> = {
  light: "rgba(244,246,255,0.18)",
  grey: "rgba(206,210,232,0.22)",
  dark: "rgba(150,156,190,0.26)",
};

function Clouds({
  count,
  tint,
  speed,
  w,
}: {
  count: number;
  tint: CloudTint;
  speed: number;
  w: number;
}) {
  const clouds = useMemo(() => {
    const r = mulberry32(count * 31 + speed + tint.length);
    return Array.from({ length: count }, () => {
      const dur = speed * 1000 * (0.7 + r() * 0.6);
      return {
        top: `${2 + r() * 46}%`,
        scale: 0.6 + r() * 1.0,
        dur,
        delay: -(r() * dur),
      };
    });
  }, [count, speed, tint]);

  const color = CLOUD_RGBA[tint];

  return (
    <>
      {clouds.map((c, i) => (
        <MotiView
          key={i}
          className="absolute"
          style={{ top: c.top as `${number}%`, transform: [{ scale: c.scale }] }}
          from={{ translateX: -180 }}
          animate={{ translateX: w + 180 }}
          transition={{
            loop: true,
            type: "timing",
            duration: c.dur,
            delay: c.delay,
            easing: Easing.linear,
            repeatReverse: false,
          }}
        >
          <View style={{ width: 180, height: 70 }}>
            <View style={{ position: "absolute", bottom: 0, left: 8, width: 80, height: 80, borderRadius: 40, backgroundColor: color }} />
            <View style={{ position: "absolute", bottom: 10, left: 56, width: 110, height: 110, borderRadius: 55, backgroundColor: color }} />
            <View style={{ position: "absolute", bottom: 0, right: 8, width: 92, height: 92, borderRadius: 46, backgroundColor: color }} />
          </View>
        </MotiView>
      ))}
    </>
  );
}

/* ============================================================================
   Névoa (bancos horizontais deslizando)
   ============================================================================ */
function Fog({ w }: { w: number }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <MotiView
          key={i}
          className="absolute bg-white/10"
          style={{ top: `${18 + i * 22}%`, height: 120, width: w * 1.6, left: -w * 0.3, borderRadius: 60 }}
          from={{ translateX: -w * 0.12 }}
          animate={{ translateX: w * 0.12 }}
          transition={{
            loop: true,
            type: "timing",
            duration: 28000 + i * 9000,
            delay: i * 1500,
            easing: Easing.inOut(Easing.ease),
            repeatReverse: true,
          }}
        />
      ))}
    </>
  );
}

/* ============================================================================
   Relâmpago (clarões rápidos sobre a tela)
   ============================================================================ */
function Lightning() {
  const o = useSharedValue(0);
  useEffect(() => {
    o.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 5100 }),
        withTiming(0.45, { duration: 80 }),
        withTiming(0.1, { duration: 90 }),
        withTiming(0.6, { duration: 70 }),
        withTiming(0, { duration: 260 }),
      ),
      -1,
      false,
    );
  }, [o]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "#dce1ff" },
        style,
      ]}
    />
  );
}

/* ============================================================================
   Orquestrador das camadas (ordem = profundidade)
   ============================================================================ */
export function WeatherFX({
  condition,
  isDay,
}: {
  condition: WeatherCondition;
  isDay: boolean;
}) {
  const { width, height } = useWindowDimensions();
  const scene = resolveScene(condition, isDay);

  return (
    <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
      {scene.fog && <Fog w={width} />}
      {scene.stars > 0 && <Stars count={scene.stars} w={width} h={height} />}
      {scene.celestial && <Celestial type={scene.celestial} dim={scene.celestialDim} />}
      {scene.clouds > 0 && (
        <Clouds count={scene.clouds} tint={scene.cloudTint} speed={scene.cloudSpeed} w={width} />
      )}
      <Precipitation type={scene.precip} />
      {scene.lightning && <Lightning />}
    </View>
  );
}
