import { type ReactNode } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";
import { BlurView } from "expo-blur";
import { cn } from "@/lib/utils/cn";

type GlassCardProps = ViewProps & {
  /** Borda/realce um pouco mais fortes (cards clicáveis ou em destaque). */
  interactive?: boolean;
  /** Intensidade do desfoque (0–100). */
  intensity?: number;
  children?: ReactNode;
};

/**
 * Cartão de vidro — tijolo base de quase toda a UI.
 * Substitui o `backdrop-filter: blur()` do CSS por um <BlurView> nativo
 * (iOS + Android) sob um leve véu translúcido. Burro: sem domínio, sem estado.
 * `className` controla layout/padding (NativeWind), como no original.
 */
export function GlassCard({
  interactive = false,
  intensity = 24,
  className,
  style,
  children,
  ...props
}: GlassCardProps) {
  return (
    <View
      className={cn(
        "relative overflow-hidden rounded-3xl border",
        interactive ? "border-white/15" : "border-glass-border",
        className,
      )}
      style={[styles.shadow, style]}
      {...props}
    >
      <BlurView
        intensity={intensity}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />
      <View
        style={StyleSheet.absoluteFill}
        className={interactive ? "bg-glass-strong" : "bg-glass"}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#05040f",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 8,
  },
});
