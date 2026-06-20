"use client";

import { AnimatePresence, motion } from "framer-motion";
import { IconAlertTriangleFilled } from "@tabler/icons-react";
import type { WeatherAlert } from "@/features/weather/types";
import { cn } from "@/lib/utils/cn";

const SEVERITY_STYLES: Record<WeatherAlert["severity"], string> = {
  advisory: "border-accent-400/40 bg-accent-400/10 text-accent-300",
  watch: "border-warning/40 bg-warning/10 text-warning",
  warning: "border-danger/40 bg-danger/10 text-danger",
};

/** Faixa de alertas meteorológicos (some quando não há alertas). */
export function AlertBanner({ alerts }: { alerts: WeatherAlert[] }) {
  return (
    <AnimatePresence initial={false}>
      {alerts.map((alert) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, height: 0, y: -8 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "flex items-start gap-3 rounded-2xl border p-4 backdrop-blur-md",
            SEVERITY_STYLES[alert.severity],
          )}
        >
          <IconAlertTriangleFilled className="mt-0.5 size-5 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">{alert.title}</span>
            <span className="text-xs text-ink-muted">{alert.description}</span>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
}
