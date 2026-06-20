import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils/cn";

type IconButtonProps = ComponentPropsWithRef<"button"> & {
  /** Rótulo acessível obrigatório (botão só de ícone). */
  label: string;
};

/** Botão circular de ícone — acessível por padrão (aria-label). */
export function IconButton({
  label,
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "glass inline-flex size-11 items-center justify-center rounded-full text-ink",
        "transition-all duration-200 hover:bg-glass-strong active:scale-95",
        "outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
