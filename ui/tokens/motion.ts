import type { Transition, Variants } from "framer-motion";

/**
 * Tokens de movimento — fonte única de durações, easings e variants.
 * Mantém as animações consistentes em todo o app (e fáceis de ajustar num lugar só).
 */

export const duration = {
  fast: 0.2,
  base: 0.4,
  slow: 0.7,
} as const;

/** Easings nomeados (curvas bezier) usados pelo Framer Motion. */
type Bezier = [number, number, number, number];

export const ease = {
  out: [0.22, 1, 0.36, 1] as Bezier,
  inOut: [0.65, 0, 0.35, 1] as Bezier,
  spring: { type: "spring", stiffness: 220, damping: 26 } as Transition,
  springSoft: { type: "spring", stiffness: 140, damping: 20 } as Transition,
};

/** Container com stagger — embala a entrada dos filhos. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

/** Item que sobe e aparece (combina com staggerContainer). */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: ease.out },
  },
};

/** Aparece com leve escala — bom para cards/ícones. */
export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: ease.spring,
  },
};
