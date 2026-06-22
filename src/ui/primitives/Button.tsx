import { type ReactNode } from "react";
import { Pressable, type PressableProps, Text } from "react-native";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "glass" | "ghost";
type Size = "sm" | "md" | "lg";

const container: Record<Variant, string> = {
  primary: "bg-brand-500 active:bg-brand-400 active:scale-[0.98]",
  glass: "bg-glass border border-glass-border active:bg-glass-strong active:scale-[0.98]",
  ghost: "active:bg-glass",
};

const text: Record<Variant, string> = {
  primary: "text-white",
  glass: "text-ink",
  ghost: "text-ink-muted",
};

const sizeBox: Record<Size, string> = {
  sm: "h-9 px-3",
  md: "h-11 px-5",
  lg: "h-13 px-7",
};

const sizeText: Record<Size, string> = {
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
};

type ButtonProps = Omit<PressableProps, "children"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: ReactNode;
};

/** Botão burro e reutilizável. String vira <Text>; nós (ícones) passam direto. */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <Pressable
      className={cn(
        "flex-row items-center justify-center gap-2 rounded-full",
        sizeBox[size],
        container[variant],
        props.disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className={cn("font-medium", sizeText[size], text[variant])}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
