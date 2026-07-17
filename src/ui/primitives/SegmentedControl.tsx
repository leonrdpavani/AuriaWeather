import { type ReactNode, useState } from "react";
import { type LayoutChangeEvent, Pressable, Text, View } from "react-native";
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

type Box = { x: number; width: number };

/**
 * Toggle de segmentos genérico com pílula animada. A pílula desliza entre os
 * segmentos (Moti spring). Sem domínio: serve para unidade, abas etc.
 *
 * Cada segmento mede o PRÓPRIO layout (x/largura) e a pílula usa essa medição.
 * Não derivamos a largura dos filhos a partir do container — isso realimentava
 * a medição a cada frame e o controle "crescia infinitamente".
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const active = boxes[value];

  function onItemLayout(v: string, e: LayoutChangeEvent) {
    const { x, width } = e.nativeEvent.layout;
    setBoxes((prev) =>
      prev[v]?.width === width && prev[v]?.x === x
        ? prev
        : { ...prev, [v]: { x, width } },
    );
  }

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      className={cn(
        "relative flex-row self-start rounded-full border border-glass-border bg-glass p-1",
        className,
      )}
    >
      {active && (
        <MotiView
          className="absolute rounded-full bg-brand-500"
          animate={{ translateX: active.x, width: active.width }}
          transition={{ type: "spring", stiffness: 220, damping: 26 }}
          style={{ top: PADDING, bottom: PADDING, left: 0 }}
        />
      )}
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            onLayout={(e) => onItemLayout(option.value, e)}
            onPress={() => onChange(option.value)}
            className="flex-row items-center justify-center gap-1.5 rounded-full px-4 py-1.5"
          >
            {option.icon}
            <Text
              className={cn(
                "text-sm font-medium",
                isActive ? "text-white" : "text-ink-muted",
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
