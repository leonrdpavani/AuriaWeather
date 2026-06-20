"use client";

import type { ComponentPropsWithRef } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Linha horizontal rolável com snap e sem barra de scroll.
 * Genérico — a feature coloca os filhos (ex: horas da previsão).
 */
export function ScrollRow({
  className,
  children,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div
      className={cn(
        "no-scrollbar flex gap-3 overflow-x-auto scroll-smooth pb-1",
        "snap-x snap-mandatory [scrollbar-gutter:stable]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
