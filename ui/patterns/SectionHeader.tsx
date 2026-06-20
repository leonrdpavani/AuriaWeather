import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface SectionHeaderProps {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

/** Cabeçalho de seção genérico: ícone + título à esquerda, ação à direita. */
export function SectionHeader({
  title,
  icon,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between px-1", className)}>
      <div className="flex items-center gap-2 text-ink-muted">
        {icon}
        <h2 className="text-sm font-semibold tracking-wide uppercase">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
