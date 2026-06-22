import { type ReactNode, useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import { MotiView } from "moti";
import { cn } from "@/lib/utils/cn";

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  /** Ícone opcional à esquerda do rótulo. */
  icon?: ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  accessibilityLabel?: string;
}

const PADDING = 4; // p-1

/**
 * Toggle de segmentos genérico com pílula animada (porte do SegmentedControl).
 * A pílula desliza entre os segmentos (Moti spring). Sem domínio: serve para
 * unidade, abas etc.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const [width, setWidth] = useState(0);
  const segWidth = width > 0 ? (width - PADDING * 2) / options.length : 0;
  const activeIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  function onLayout(e: LayoutChangeEvent) {
    setWidth(e.nativeEvent.layout.width);
  }

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      onLayout={onLayout}
      className={cn(
        "relative flex-row self-start rounded-full border border-glass-border bg-glass p-1",
        className,
      )}
    >
      {segWidth > 0 && (
        <MotiView
          className="absolute rounded-full bg-brand-500"
          animate={{ translateX: PADDING + activeIndex * segWidth }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          style={{
            width: segWidth,
            top: PADDING,
            bottom: PADDING,
            left: 0,
          }}
        />
      )}
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(option.value)}
            style={segWidth > 0 ? { width: segWidth } : undefined}
            className="flex-row items-center justify-center gap-1.5 rounded-full px-4 py-1.5"
          >
            {option.icon}
            <Text
              className={cn(
                "text-sm font-medium",
                active ? "text-white" : "text-ink-muted",
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
