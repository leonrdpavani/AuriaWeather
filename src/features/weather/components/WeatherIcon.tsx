import { type ReactNode } from "react";
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from "react-native-svg";
import type { WeatherCondition } from "@/features/weather/types";

/**
 * Ícone de condição climática desenhado em SVG (substitui os meteocons do
 * Iconify, que não existem no React Native). Conhece o domínio → vive na feature.
 * Composição de formas reutilizáveis (sol, lua, nuvem, gotas...) cobre todas as
 * 10 condições × dia/noite com gradientes para um visual rico.
 */

interface WeatherIconProps {
  condition: WeatherCondition;
  isDay?: boolean;
  /** Tamanho em px. */
  size?: number;
}

function Sun({ dim = false }: { dim?: boolean }) {
  const rays = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
  return (
    <G opacity={dim ? 0.85 : 1}>
      {rays.map((a, i) => {
        const cx = 50 + Math.cos(a) * 30;
        const cy = 50 + Math.sin(a) * 30;
        const ex = 50 + Math.cos(a) * 40;
        const ey = 50 + Math.sin(a) * 40;
        return (
          <Line
            key={i}
            x1={cx}
            y1={cy}
            x2={ex}
            y2={ey}
            stroke="#ffd277"
            strokeWidth={5}
            strokeLinecap="round"
          />
        );
      })}
      <Circle cx={50} cy={50} r={20} fill="url(#sunGrad)" />
    </G>
  );
}

function Moon() {
  return (
    <Path
      d="M62 26 a26 26 0 1 0 18 44 a22 22 0 1 1 -18 -44 Z"
      fill="url(#moonGrad)"
    />
  );
}

function Cloud({
  x = 0,
  y = 0,
  scale = 1,
  fill = "url(#cloudLight)",
}: {
  x?: number;
  y?: number;
  scale?: number;
  fill?: string;
}) {
  return (
    <G translateX={x} translateY={y} scale={scale}>
      <Path
        d="M30 70 a18 18 0 0 1 2 -35 a24 24 0 0 1 44 -4 a16 16 0 0 1 4 39 Z"
        fill={fill}
      />
    </G>
  );
}

function Drops({ color = "#38d0ff", n = 3 }: { color?: string; n?: number }) {
  const xs = n === 3 ? [38, 52, 66] : n === 2 ? [44, 60] : [52];
  return (
    <G>
      {xs.map((x, i) => (
        <Line
          key={i}
          x1={x}
          y1={74}
          x2={x - 4}
          y2={88}
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
        />
      ))}
    </G>
  );
}

function Flakes() {
  const xs = [40, 54, 68];
  return (
    <G>
      {xs.map((x, i) => (
        <Circle key={i} cx={x} cy={80 + (i % 2) * 6} r={3.5} fill="#e7ecff" />
      ))}
    </G>
  );
}

function Bolt() {
  return <Path d="M52 70 L42 86 L52 86 L46 100 L66 80 L56 80 L62 70 Z" fill="#ffd277" />;
}

function FogLines() {
  return (
    <G>
      {[64, 74, 84].map((y, i) => (
        <Line
          key={i}
          x1={26}
          y1={y}
          x2={74}
          y2={y}
          stroke="#cdd6ee"
          strokeWidth={5}
          strokeLinecap="round"
          opacity={0.8 - i * 0.15}
        />
      ))}
    </G>
  );
}

function WindLines() {
  return (
    <G>
      <Path
        d="M22 42 h44 a8 8 0 1 0 -8 -8"
        stroke="#cdd6ee"
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M22 58 h30 a7 7 0 1 1 -7 7"
        stroke="#a9b4d8"
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
    </G>
  );
}

function scene(condition: WeatherCondition, isDay: boolean): ReactNode {
  const body = isDay ? <Sun /> : <Moon />;
  const bodySmall = isDay ? (
    <G translateX={-14} translateY={-14} scale={0.55}>
      <Sun />
    </G>
  ) : (
    <G translateX={-10} translateY={-12} scale={0.5}>
      <Moon />
    </G>
  );

  switch (condition) {
    case "clear":
      return body;
    case "partly-cloudy":
      return (
        <>
          {bodySmall}
          <Cloud x={6} y={14} scale={0.85} />
        </>
      );
    case "cloudy":
      return (
        <>
          {bodySmall}
          <Cloud y={6} fill="url(#cloudGrey)" />
        </>
      );
    case "overcast":
      return (
        <>
          <Cloud x={-6} y={-4} scale={0.8} fill="url(#cloudGrey)" />
          <Cloud x={8} y={8} fill="url(#cloudDark)" />
        </>
      );
    case "fog":
      return (
        <>
          <Cloud y={-6} fill="url(#cloudGrey)" />
          <FogLines />
        </>
      );
    case "drizzle":
      return (
        <>
          <Cloud y={-4} fill="url(#cloudGrey)" />
          <Drops n={2} />
        </>
      );
    case "rain":
      return (
        <>
          <Cloud y={-4} fill="url(#cloudDark)" />
          <Drops n={3} />
        </>
      );
    case "thunderstorm":
      return (
        <>
          <Cloud y={-6} fill="url(#cloudDark)" />
          <Bolt />
        </>
      );
    case "snow":
      return (
        <>
          <Cloud y={-6} fill="url(#cloudGrey)" />
          <Flakes />
        </>
      );
    case "windy":
      return <WindLines />;
  }
}

export function WeatherIcon({
  condition,
  isDay = true,
  size = 48,
}: WeatherIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <RadialGradient id="sunGrad" cx="40%" cy="38%" r="65%">
          <Stop offset="0" stopColor="#fff6db" />
          <Stop offset="0.55" stopColor="#ffd277" />
          <Stop offset="1" stopColor="#f6b64e" />
        </RadialGradient>
        <RadialGradient id="moonGrad" cx="40%" cy="36%" r="70%">
          <Stop offset="0" stopColor="#fdfcff" />
          <Stop offset="0.6" stopColor="#d8d6f0" />
          <Stop offset="1" stopColor="#b9b6da" />
        </RadialGradient>
        <LinearGradient id="cloudLight" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#ffffff" />
          <Stop offset="1" stopColor="#dfe3f5" />
        </LinearGradient>
        <LinearGradient id="cloudGrey" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#e2e6f2" />
          <Stop offset="1" stopColor="#b4bad2" />
        </LinearGradient>
        <LinearGradient id="cloudDark" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#aab0c8" />
          <Stop offset="1" stopColor="#7c83a0" />
        </LinearGradient>
      </Defs>
      {scene(condition, isDay)}
    </Svg>
  );
}
