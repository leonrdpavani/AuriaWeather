import type { ReactNode } from "react";
import { GlassCard } from "@/ui/primitives/GlassCard";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Estado vazio genérico (centralizado): ícone, título, descrição e ação. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[70vh] flex-col items-center justify-center px-6 text-center",
        className,
      )}
    >
      <GlassCard className="flex max-w-md flex-col items-center gap-4 p-10">
        {icon && (
          <div className="flex size-16 items-center justify-center rounded-2xl bg-glass text-brand-300 [&>svg]:size-8">
            {icon}
          </div>
        )}
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        {description && (
          <p className="text-sm leading-relaxed text-ink-muted">{description}</p>
        )}
        {action}
      </GlassCard>
    </div>
  );
}
