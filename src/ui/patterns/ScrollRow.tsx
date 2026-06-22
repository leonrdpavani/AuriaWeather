import { type ReactNode } from "react";
import { ScrollView, type ScrollViewProps } from "react-native";

type ScrollRowProps = ScrollViewProps & {
  children?: ReactNode;
  /** Espaço entre itens (px). */
  gap?: number;
};

/**
 * Linha horizontal rolável, sem barra de scroll — porte do ScrollRow.
 * Genérico: a feature coloca os filhos (ex: horas da previsão).
 */
export function ScrollRow({
  children,
  gap = 12,
  contentContainerStyle,
  ...props
}: ScrollRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[{ gap, paddingBottom: 4 }, contentContainerStyle]}
      {...props}
    >
      {children}
    </ScrollView>
  );
}
