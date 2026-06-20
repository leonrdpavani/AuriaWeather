/**
 * Barrel do design system. Reexport só aqui em ui/ (regra de arquitetura).
 * Features importam de "@/ui".
 */
export { GlassCard } from "./primitives/GlassCard";
export { Button } from "./primitives/Button";
export { IconButton } from "./primitives/IconButton";
export { Skeleton } from "./primitives/Skeleton";
export { AnimatedNumber } from "./primitives/AnimatedNumber";
export {
  SegmentedControl,
  type SegmentOption,
} from "./primitives/SegmentedControl";

export { MetricTile } from "./patterns/MetricTile";
export { SectionHeader } from "./patterns/SectionHeader";
export { ScrollRow } from "./patterns/ScrollRow";
export { FloatingDock, type DockItem } from "./patterns/FloatingDock";
export { EmptyState } from "./patterns/EmptyState";
