import { type ReactNode } from "react";
import { Pressable, type PressableProps } from "react-native";
import { cn } from "@/lib/utils/cn";

type IconButtonProps = Omit<PressableProps, "children"> & {
  /** Rótulo acessível obrigatório (botão só de ícone). */
  label: string;
  className?: string;
  children?: ReactNode;
};

/** Botão circular de ícone — acessível por padrão (accessibilityLabel). */
export function IconButton({
  label,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      className={cn(
        "size-11 items-center justify-center rounded-full border border-glass-border bg-glass",
        "active:scale-95 active:bg-glass-strong",
        className,
      )}
      {...props}
    >
      {children}
    </Pressable>
  );
}
