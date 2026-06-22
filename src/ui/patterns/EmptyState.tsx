import { type ReactNode } from "react";
import { Text, View } from "react-native";
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
    <View
      className={cn(
        "flex-1 items-center justify-center px-6",
        className,
      )}
    >
      <GlassCard className="w-full max-w-md items-center gap-4 p-10">
        {icon && (
          <View className="size-16 items-center justify-center rounded-2xl bg-glass">
            {icon}
          </View>
        )}
        <Text className="text-center text-2xl font-semibold text-ink">
          {title}
        </Text>
        {description && (
          <Text className="text-center text-sm leading-relaxed text-ink-muted">
            {description}
          </Text>
        )}
        {action}
      </GlassCard>
    </View>
  );
}
