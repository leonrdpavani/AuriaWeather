import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils/cn";

/** Placeholder de carregamento com shimmer. Burro e genérico. */
export function Skeleton({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-glass",
        "bg-[linear-gradient(110deg,transparent_30%,var(--color-glass-strong)_50%,transparent_70%)]",
        "bg-[length:200%_100%] animate-shimmer",
        className,
      )}
      {...props}
    />
  );
}
