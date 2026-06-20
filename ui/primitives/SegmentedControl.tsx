"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { ease } from "@/ui/tokens/motion";
import { cn } from "@/lib/utils/cn";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  "aria-label"?: string;
}

/**
 * Toggle de segmentos genérico com pílula animada (layoutId).
 * Sem domínio: serve para unidade, abas etc. Acessível via role=tablist.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  const groupId = useId();

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn("glass inline-flex rounded-full p-1", className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              "outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
              active ? "text-white" : "text-ink-muted hover:text-ink",
            )}
          >
            {active && (
              <motion.span
                layoutId={`segmented-${groupId}`}
                transition={ease.spring}
                className="absolute inset-0 rounded-full bg-brand-500 shadow-glow"
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
