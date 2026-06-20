"use client";

import { useEffect } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  /** Sufixo fixo, ex: "°". */
  suffix?: string;
  /** Casas decimais. */
  decimals?: number;
  duration?: number;
  className?: string;
}

/**
 * Conta de um valor a outro com easing. Burro e genérico.
 * Reanima sempre que `value` muda (troca de cidade / unidade).
 */
export function AnimatedNumber({
  value,
  suffix = "",
  decimals = 0,
  duration = 0.8,
  className,
}: AnimatedNumberProps) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => `${v.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    const controls = animate(mv, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [mv, value, duration]);

  return <motion.span className={className}>{text}</motion.span>;
}
