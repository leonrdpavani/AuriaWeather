import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "glass" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-400 shadow-glow active:scale-[0.98]",
  glass:
    "glass text-ink hover:bg-glass-strong active:scale-[0.98]",
  ghost: "text-ink-muted hover:text-ink hover:bg-glass",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2.5",
};

type ButtonProps = ComponentPropsWithRef<"button"> & {
  variant?: Variant;
  size?: Size;
};

/** Botão burro e reutilizável. Forward de props nativas + className. */
export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium",
        "transition-all duration-200 outline-none",
        "focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
