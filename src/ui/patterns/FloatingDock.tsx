import { type ReactNode, useState } from "react";
import {
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MotiView } from "moti";
import { BlurView } from "expo-blur";
import { spring } from "@/ui/tokens/motion";

export interface DockItem {
  id: string;
  label: string;
  /** Recebe o estado ativo para colorir o ícone corretamente. */
  icon: (active: boolean) => ReactNode;
}

interface FloatingDockProps {
  items: DockItem[];
  activeId: string;
  onSelect: (id: string) => void;
}

type Box = { x: number; width: number };

/**
 * Menu flutuante (dock) genérico — porte do FloatingDock para React Native.
 * A pílula ativa desliza entre os itens (mede o layout de cada um). O rótulo
 * aparece só no item ativo (visual de dock). Usado como tabBar do expo-router.
 */
export function FloatingDock({ items, activeId, onSelect }: FloatingDockProps) {
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const active = boxes[activeId];

  function onItemLayout(id: string, e: LayoutChangeEvent) {
    const { x, width } = e.nativeEvent.layout;
    setBoxes((prev) =>
      prev[id]?.width === width && prev[id]?.x === x
        ? prev
        : { ...prev, [id]: { x, width } },
    );
  }

  return (
    <View className="absolute inset-x-0 bottom-5 items-center px-4">
      <View className="overflow-hidden rounded-full border border-glass-border">
        {/* BlurView só de fundo (absoluteFill). Layout fica no View — className de
            layout não aplica de forma confiável direto no BlurView. */}
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
        <View className="flex-row items-center gap-1 p-1.5">
          {active && (
            <MotiView
              className="absolute rounded-full bg-brand-500"
              animate={{ translateX: active.x, width: active.width }}
              transition={spring}
              style={{ top: 6, bottom: 6, left: 0 }}
            />
          )}
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <Pressable
                key={item.id}
                onLayout={(e) => onItemLayout(item.id, e)}
                onPress={() => onSelect(item.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                className="flex-row items-center gap-2 rounded-full px-4 py-2.5"
              >
                {item.icon(isActive)}
                {isActive && (
                  <Text className="text-sm font-medium text-white">
                    {item.label}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
