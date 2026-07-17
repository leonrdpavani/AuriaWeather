import { type ReactNode } from "react";
import { Text, View } from "react-native";
import { GlassCard } from "@/ui/primitives/GlassCard";
import { cn } from "@/lib/utils/cn";

interface MetricTileProps {
  /** Ícone pequeno do cabeçalho. */
  icon?: ReactNode;
  /** Rótulo curto em maiúsculas: "UV INDEX". */
  label: string;
  /** Valor principal grande (string/número) — opcional. */
  value?: ReactNode;
  /** Linha de apoio abaixo do valor. */
  footnote?: ReactNode;
  /** Conteúdo extra (barra, bússola, arco...). */
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
    <GlassCard interactive className={cn("flex-1 gap-3 p-5", className)}>
      <View className="flex-row items-center gap-2">
        {icon}
        <Text className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
          {label}
        </Text>
      </View>
      {value != null && (
        <Text className="text-2xl font-semibold text-ink">{value}</Text>
      )}
      {children}
      {footnote != null && (
        <Text className="mt-auto text-sm text-ink-muted">{footnote}</Text>
      )}
    </GlassCard>
  );
}
