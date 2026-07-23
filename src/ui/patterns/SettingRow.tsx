import { type ReactNode } from "react";
import { Text, View } from "react-native";
import { cn } from "@/lib/utils/cn";

interface SettingRowProps {
  /** Ícone pequeno à esquerda. */
  icon?: ReactNode;
  title: string;
  description?: string;
  /** Controle à direita (Switch, SegmentedControl...). */
  trailing?: ReactNode;
  /** Adiciona a divisória superior (usado a partir da 2ª linha do grupo). */
  divided?: boolean;
  className?: string;
}

/**
 * Linha de configuração genérica: ícone + título/descrição à esquerda e um
 * controle à direita. Sem domínio — a tela decide o que cada linha ajusta.
 */
export function SettingRow({
  icon,
  title,
  description,
  trailing,
  divided = false,
  className,
}: SettingRowProps) {
  return (
    <View
      className={cn(
        "flex-row items-center gap-3 px-4 py-3.5",
        divided && "border-t border-glass-border",
        className,
      )}
    >
      {icon && (
        <View className="size-9 items-center justify-center rounded-xl bg-glass">
          {icon}
        </View>
      )}
      <View className="flex-1">
        <Text className="text-sm font-medium text-ink">{title}</Text>
        {description && (
          <Text className="text-xs text-ink-muted">{description}</Text>
        )}
      </View>
      {trailing}
    </View>
  );
}
