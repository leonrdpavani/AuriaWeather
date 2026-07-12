import { Easing } from "react-native-reanimated";
import type { MotiTransition } from "moti";

/**
 * Tokens de movimento — fonte única de durações, easings e springs.
 * Consumidos por Moti e Reanimated em todo o app.
 */

/** Durações em milissegundos (Moti/Reanimated usam ms). */
export const duration = {
  fast: 200,
  base: 400,
  slow: 700,
} as const;

/** Curva de saída suave (equivale ao ease.out bezier do original). */
export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Springs nomeados (para transições do Moti). */
export const spring: MotiTransition = {
  type: "spring",
  stiffness: 220,
  damping: 26,
};

export const springSoft: MotiTransition = {
  type: "spring",
  stiffness: 140,
  damping: 20,
};

/** Atraso de entrada escalonado por índice (substitui staggerChildren). */
export function stagger(index: number, step = 70, base = 50): number {
  return base + index * step;
}

/** Entrada padrão "sobe e aparece" (combina com stagger). */
export const fadeUpFrom = { opacity: 0, translateY: 16 } as const;
export const fadeUpTo = { opacity: 1, translateY: 0 } as const;
