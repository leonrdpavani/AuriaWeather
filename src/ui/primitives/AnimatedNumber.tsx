import { useEffect } from "react";
import { StyleSheet, Text, TextInput, type TextStyle, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AnimatedNumberProps {
  value: number;
  /** Sufixo fixo, ex: "°". */
  suffix?: string;
  /** Casas decimais. */
  decimals?: number;
  /** Duração em ms. */
  duration?: number;
  className?: string;
  style?: TextStyle;
}

/**
 * Conta de um valor a outro com easing (contador animado).
 * Anima um TextInput não-editável via `animatedProps` (sem re-render por frame).
 * Reanima sempre que `value` muda (troca de cidade / unidade).
 *
 * Largura: um <Text> invisível com o valor FINAL dita o tamanho do container; o
 * input animado fica sobreposto (absoluto). Assim a medição nunca depende do
 * texto que muda a cada frame — sem isso o TextInput sem largura ou "cresce
 * infinitamente" (nativo) ou cai na largura padrão gigante do <input> (web).
 */
export function AnimatedNumber({
  value,
  suffix = "",
  decimals = 0,
  duration = 800,
  className,
  style,
}: AnimatedNumberProps) {
  const sv = useSharedValue(value);
  const text = `${value.toFixed(decimals)}${suffix}`;

  useEffect(() => {
    sv.value = withTiming(value, {
      duration,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    });
  }, [sv, value, duration]);

  const animatedProps = useAnimatedProps(() => {
    return { text: `${sv.value.toFixed(decimals)}${suffix}` } as object;
  });

  return (
    <View style={{ position: "relative" }}>
      {/* Sizer invisível: define a largura pelo valor assentado (não anima). */}
      <Text
        className={className}
        style={[style, { opacity: 0 }]}
        accessibilityElementsHidden
        importantForAccessibility="no"
      >
        {text}
      </Text>
      <AnimatedTextInput
        editable={false}
        pointerEvents="none"
        className={className}
        style={[StyleSheet.absoluteFill, { padding: 0 }, style]}
        defaultValue={text}
        animatedProps={animatedProps}
      />
    </View>
  );
}
