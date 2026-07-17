import { type ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Fundo base das telas sem o clima reativo (Cities/Radar/Settings).
 * Gradiente escuro discreto + respeito à safe area. A Home usa o
 * WeatherBackground no lugar deste.
 */
export function ScreenBackground({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1">
      <LinearGradient
        colors={["#1d1a44", "#0b0a1f"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.7 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        className="flex-1"
        style={{ paddingTop: insets.top, paddingBottom: 110 }}
      >
        {children}
      </View>
    </View>
  );
}
