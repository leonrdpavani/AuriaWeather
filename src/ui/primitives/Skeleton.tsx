import { MotiView } from "moti";
import { type ViewProps } from "react-native";
import { cn } from "@/lib/utils/cn";

/** Placeholder de carregamento com shimmer (pulsa a opacidade). Burro e genérico. */
export function Skeleton({ className, style, ...props }: ViewProps) {
  return (
    <MotiView
      from={{ opacity: 0.35 }}
      animate={{ opacity: 0.75 }}
      transition={{
        loop: true,
        type: "timing",
        duration: 800,
        repeatReverse: true,
      }}
      style={style}
      className={cn("rounded-2xl bg-glass-strong", className)}
      {...props}
    />
  );
}
