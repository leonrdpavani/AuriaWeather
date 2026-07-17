import { type ReactNode } from "react";
import { Text, View } from "react-native";
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
    <View className={cn("flex-row items-center justify-between px-1", className)}>
      <View className="flex-row items-center gap-2">
        {icon}
        <Text className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
          {title}
        </Text>
      </View>
      {action}
    </View>
  );
}
