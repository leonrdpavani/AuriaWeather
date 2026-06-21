"use client";

import { type CSSProperties, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { Precipitation, type PrecipType } from "./Precipitation";
import type { WeatherCondition } from "@/features/weather/types";

/* ============================================================================
   Cena: traduz (condição + dia/noite) nas camadas visuais a mostrar.
   Compor camadas reutilizáveis cobre TODAS as combinações sem novos assets.
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

  switch (condition) {
    case "clear":
      return { ...base, celestial: body, stars: isDay ? 0 : 64 };
    case "partly-cloudy":
      return { ...base, celestial: body, stars: isDay ? 0 : 34, clouds: 3 };
    case "cloudy":
      return {
        ...base,
        celestial: body,
        celestialDim: true,
        clouds: 5,
        cloudTint: "grey",
      };
    case "overcast":
      return { ...base, clouds: 6, cloudTint: "dark", cloudSpeed: 120 };
    case "fog":
      return {
        ...base,
        celestial: body,
        celestialDim: true,
        clouds: 2,
        cloudTint: "grey",
        fog: true,
      };
    case "drizzle":
      return { ...base, clouds: 5, cloudTint: "grey", precip: "drizzle" };
    case "rain":
      return { ...base, clouds: 6, cloudTint: "dark", precip: "rain" };
    case "thunderstorm":
      return {
        ...base,
        clouds: 6,
        cloudTint: "dark",
        cloudSpeed: 65,
        precip: "heavy",
        lightning: true,
      };
    case "snow":
      return {
        ...base,
        clouds: 5,
        cloudTint: "grey",
        precip: "snow",
        stars: isDay ? 0 : 18,
      };
    case "windy":
      return {
        ...base,
        celestial: body,
        clouds: 4,
        cloudSpeed: 38,
        stars: isDay ? 0 : 24,
      };
  }
}

/* ============================================================================
   PRNG determinístico (mulberry32) — mesmas posições no servidor e no client,
   evitando mismatch de hidratação ao gerar estrelas/nuvens.
   ============================================================================ */
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
   Sol / Lua
   ============================================================================ */
function Celestial({
  type,
  dim,
  reduced,
}: {
  type: "sun" | "moon";
  dim: boolean;
  reduced: boolean;
}) {
  const isSun = type === "sun";
  const pulse: CSSProperties = reduced
    ? {}
    : { animation: "pulse-glow 7s ease-in-out infinite" };

  return (
    <div
      className="absolute right-[14%] top-[7%]"
      style={{ opacity: dim ? 0.55 : 1 }}
    >
      <div className="relative" style={pulse}>
        {/* Halo difuso */}
        <div
          className="absolute left-1/2 top-1/2 size-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            background: isSun
              ? "radial-gradient(circle, rgba(255,206,120,0.38), transparent 65%)"
              : "radial-gradient(circle, rgba(186,196,255,0.30), transparent 65%)",
          }}
        />
        {/* Disco */}
        <div
          className="relative size-24 rounded-full"
          style={{
            background: isSun
              ? "radial-gradient(circle at 35% 32%, #fff6db, #ffd277 55%, #f6b64e)"
              : "radial-gradient(circle at 38% 34%, #fdfcff, #d8d6f0 60%, #b9b6da)",
            boxShadow: isSun
              ? "0 0 70px 12px rgba(255,196,110,0.5)"
              : "0 0 52px 8px rgba(200,205,255,0.42)",
          }}
        >
          {!isSun && (
            <>
              <span className="absolute left-[26%] top-[30%] size-3 rounded-full bg-[#b4b0d4]/60" />
              <span className="absolute left-[58%] top-[52%] size-4 rounded-full bg-[#b4b0d4]/50" />
              <span className="absolute left-[40%] top-[66%] size-2 rounded-full bg-[#b4b0d4]/55" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   Estrelas
   ============================================================================ */
function Stars({ count, reduced }: { count: number; reduced: boolean }) {
  const stars = useMemo(() => {
    const r = mulberry32(count * 9 + 17);
    return Array.from({ length: count }, () => ({
      left: r() * 100,
      top: r() * 56,
      size: 0.6 + r() * 1.9,
      delay: r() * 4,
      dur: 2.2 + r() * 3,
      op: 0.45 + r() * 0.5,
    }));
  }, [count]);

  return (
    <>
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            boxShadow: `0 0 ${s.size * 2.5}px rgba(255,255,255,0.8)`,
            opacity: reduced ? s.op * 0.8 : undefined,
            animation: reduced
              ? undefined
              : `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

/* ============================================================================
   Nuvens
   ============================================================================ */
const CLOUD_RGB: Record<CloudTint, string> = {
  light: "244,246,255",
  grey: "206,210,232",
  dark: "150,156,190",
};
const CLOUD_BASE_OPACITY: Record<CloudTint, number> = {
  light: 0.16,
  grey: 0.22,
  dark: 0.26,
};

function Clouds({
  count,
  tint,
  speed,
  reduced,
}: {
  count: number;
  tint: CloudTint;
  speed: number;
  reduced: boolean;
}) {
  const clouds = useMemo(() => {
    const r = mulberry32(count * 31 + speed + tint.length);
    return Array.from({ length: count }, () => {
      const dur = speed * (0.7 + r() * 0.6);
      return {
        top: 2 + r() * 46,
        scale: 0.6 + r() * 1.0,
        depth: 0.55 + r() * 0.45,
        dur,
        delay: -(r() * dur),
        left: r() * 100, // usado no modo reduzido (estático)
      };
    });
  }, [count, speed, tint]);

  const rgb = CLOUD_RGB[tint];
  const baseOpacity = CLOUD_BASE_OPACITY[tint];

  return (
    <>
      {clouds.map((c, i) => {
        const wrapStyle: CSSProperties = reduced
          ? { top: `${c.top}%`, left: `${c.left}%` }
          : {
              top: `${c.top}%`,
              animation: `drift ${c.dur}s linear ${c.delay}s infinite`,
            };
        return (
          <div
            key={i}
            className="absolute left-0 will-change-transform"
            style={wrapStyle}
          >
            <div
              className="relative h-20 w-48"
              style={{
                transform: `scale(${c.scale})`,
                opacity: baseOpacity * c.depth,
              }}
            >
              <span
                className="absolute bottom-0 left-2 size-20 rounded-full blur-2xl"
                style={{ background: `rgba(${rgb},0.9)` }}
              />
              <span
                className="absolute bottom-3 left-16 size-28 rounded-full blur-2xl"
                style={{ background: `rgba(${rgb},0.95)` }}
              />
              <span
                className="absolute bottom-0 right-2 size-24 rounded-full blur-2xl"
                style={{ background: `rgba(${rgb},0.9)` }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

/* ============================================================================
   Névoa
   ============================================================================ */
function Fog({ reduced }: { reduced: boolean }) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute left-[-30%] h-44 w-[160%] blur-lg"
          style={{
            top: `${18 + i * 22}%`,
            background:
              "linear-gradient(90deg, transparent, rgba(222,224,238,0.12), transparent)",
            animation: reduced
              ? undefined
              : `fog-drift ${28 + i * 9}s ease-in-out ${-i * 5}s infinite alternate`,
          }}
        />
      ))}
    </>
  );
}

/* ============================================================================
   Relâmpago
   ============================================================================ */
function Lightning({ reduced }: { reduced: boolean }) {
  if (reduced) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 70% 12%, rgba(214,220,255,0.12), transparent 55%)",
        }}
      />
    );
  }
  return (
    <>
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle at 70% 8%, rgba(214,220,255,0.85), transparent 42%)",
          animation: "flash 7.5s linear infinite",
        }}
      />
      <div
        className="absolute inset-0 mix-blend-screen"
        style={{
          background: "rgba(220,225,255,0.16)",
          animation: "flash 11s linear 4s infinite",
        }}
      />
    </>
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
  const scene = resolveScene(condition, isDay);
  const reduced = useReducedMotion() ?? false;

  return (
    <div className="absolute inset-0">
      {scene.fog && <Fog reduced={reduced} />}
      {scene.stars > 0 && <Stars count={scene.stars} reduced={reduced} />}
      {scene.celestial && (
        <Celestial
          type={scene.celestial}
          dim={scene.celestialDim}
          reduced={reduced}
        />
      )}
      {scene.clouds > 0 && (
        <Clouds
          count={scene.clouds}
          tint={scene.cloudTint}
          speed={scene.cloudSpeed}
          reduced={reduced}
        />
      )}
      <Precipitation type={scene.precip} />
      {scene.lightning && <Lightning reduced={reduced} />}
    </div>
  );
}
