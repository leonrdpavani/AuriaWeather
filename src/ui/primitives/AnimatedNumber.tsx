import { useEffect } from "react";
import { TextInput, type TextStyle } from "react-native";
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
 * Conta de um valor a outro com easing — porte do AnimatedNumber (framer-motion).
 * Anima um TextInput não-editável via `animatedProps` (sem re-render por frame).
 * Reanima sempre que `value` muda (troca de cidade / unidade).
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

  useEffect(() => {
    sv.value = withTiming(value, {
      duration,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    });
  }, [sv, value, duration]);

  const animatedProps = useAnimatedProps(() => {
    const text = `${sv.value.toFixed(decimals)}${suffix}`;
    return { text, defaultValue: text } as object;
  });

  return (
    <AnimatedTextInput
      editable={false}
      pointerEvents="none"
      className={className}
      style={[{ padding: 0 }, style]}
      value={`${value.toFixed(decimals)}${suffix}`}
      animatedProps={animatedProps}
    />
  );
}
