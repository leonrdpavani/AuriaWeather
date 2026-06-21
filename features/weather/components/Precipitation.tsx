"use client";

import { useEffect, useRef } from "react";

export type PrecipType = "none" | "drizzle" | "rain" | "heavy" | "snow";

interface Particle {
  x: number;
  y: number;
  len: number;
  speed: number;
  drift: number;
  r: number;
  o: number;
  sway: number;
  phase: number;
}

/**
 * Precipitação em <canvas> — chuva (3 intensidades) ou neve.
 * Leve e auto-suficiente: um único requestAnimationFrame, ciente de DPR,
 * resize, visibilidade da aba e prefers-reduced-motion. Sem libs externas.
 */
export function Precipitation({ type }: { type: PrecipType }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (type === "none") return;
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    // aliases não-nulos: preservam o narrowing dentro das closures abaixo
    const cv = canvas;
    const c = ctx;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const isSnow = type === "snow";
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const baseCount = isSnow
      ? 70
      : type === "heavy"
        ? 260
        : type === "rain"
          ? 170
          : 90;
    const count = Math.round(baseCount * (reduce ? 0.35 : 1));
    const speedScale = reduce ? 0.55 : 1;

    let w = 0;
    let h = 0;
    let parts: Particle[] = [];

    function spawn(initial: boolean): Particle {
      if (isSnow) {
        return {
          x: rand(0, w),
          y: initial ? rand(0, h) : rand(-20, 0),
          len: 0,
          speed: rand(20, 55) * speedScale,
          drift: rand(-12, 12),
          r: rand(1.2, 3.4),
          o: rand(0.4, 0.9),
          sway: rand(8, 26),
          phase: rand(0, Math.PI * 2),
        };
      }
      const fast = type === "heavy";
      return {
        x: rand(0, w),
        y: initial ? rand(0, h) : rand(-h * 0.3, 0),
        len: rand(fast ? 14 : 9, fast ? 26 : 17),
        speed: rand(fast ? 720 : 520, fast ? 1120 : 800) * speedScale,
        drift: (fast ? 190 : 130) * speedScale,
        r: 0,
        o: rand(0.18, 0.5),
        sway: 0,
        phase: 0,
      };
    }

    function resize() {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = Array.from({ length: count }, () => spawn(true));
    }
    resize();

    let raf = 0;
    let last = performance.now();
    let running = true;

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      c.clearRect(0, 0, w, h);

      if (isSnow) {
        for (const p of parts) {
          p.phase += dt * 1.5;
          p.y += p.speed * dt;
          p.x += (p.drift + Math.sin(p.phase) * p.sway) * dt;
          if (p.y > h + 6) Object.assign(p, spawn(false));
          if (p.x < -10) p.x = w + 10;
          else if (p.x > w + 10) p.x = -10;
          c.beginPath();
          c.fillStyle = `rgba(255,255,255,${p.o})`;
          c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          c.fill();
        }
      } else {
        c.lineCap = "round";
        c.lineWidth = type === "heavy" ? 1.3 : 1.05;
        for (const p of parts) {
          p.y += p.speed * dt;
          p.x += p.drift * dt;
          if (p.y > h + 24) Object.assign(p, spawn(false));
          const inv = p.len / Math.hypot(p.drift, p.speed);
          c.beginPath();
          c.strokeStyle = `rgba(196,226,255,${p.o})`;
          c.moveTo(p.x, p.y);
          c.lineTo(p.x - p.drift * inv, p.y - p.speed * inv);
          c.stroke();
        }
      }

      if (running) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resize);
    };
  }, [type]);

  if (type === "none") return null;
  return <canvas ref={ref} aria-hidden className="absolute inset-0 size-full" />;
}
