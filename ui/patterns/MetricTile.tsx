import type { ReactNode } from "react";
import { GlassCard } from "@/ui/primitives/GlassCard";
import { cn } from "@/lib/utils/cn";

interface MetricTileProps {
  /** Ícone pequeno do cabeçalho. */
  icon?: ReactNode;
  /** Rótulo curto em maiúsculas: "UV INDEX". */
  label: string;
  /** Valor principal grande. */
  value: ReactNode;
  /** Linha de apoio abaixo do valor. */
  footnote?: ReactNode;
  /** Conteúdo extra (barra, gráfico, bússola...). */
  children?: ReactNode;
  className?: string;
}

/**
 * Tile de métrica genérico: cabeçalho (ícone + label), valor e rodapé.
 * Sem domínio — a feature decide o que é "UV", "vento" etc.
 */
export function MetricTile({
  icon,
  label,
  value,
  footnote,
  children,
  className,
}: MetricTileProps) {
  return (
    <GlassCard
      interactive
      className={cn("flex flex-col gap-3 p-5", className)}
    >
      <div className="flex items-center gap-2 text-ink-subtle">
        {icon}
        <span className="text-xs font-semibold tracking-wider uppercase">
          {label}
        </span>
      </div>
      <div className="text-2xl font-semibold text-ink">{value}</div>
      {children}
      {footnote && (
        <div className="mt-auto text-sm text-ink-muted">{footnote}</div>
      )}
    </GlassCard>
  );
}
