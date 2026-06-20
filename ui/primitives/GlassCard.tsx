import type { ComponentPropsWithRef, ElementType } from "react";
import { cn } from "@/lib/utils/cn";

type GlassCardProps<T extends ElementType> = {
  as?: T;
  /** Adiciona hover lift + brilho (para cards clicáveis). */
  interactive?: boolean;
} & ComponentPropsWithRef<T>;

/**
 * Cartão de vidro — tijolo base de quase toda a UI.
 * Burro: sem domínio, sem estado, sem fetch. Aceita className e props nativas.
 */
export function GlassCard<T extends ElementType = "div">({
  as,
  interactive = false,
  className,
  ...props
}: GlassCardProps<T>) {
  const Tag = as ?? "div";
  return (
    <Tag
      className={cn(
        "glass rounded-3xl shadow-glass",
        interactive &&
          "transition-all duration-300 hover:-translate-y-0.5 hover:bg-glass-strong hover:shadow-glow",
        className,
      )}
      {...props}
    />
  );
}
