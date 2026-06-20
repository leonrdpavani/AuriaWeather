"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ease } from "@/ui/tokens/motion";
import { cn } from "@/lib/utils/cn";

export interface DockItem {
  id: string;
  label: string;
  icon: ReactNode;
  href: string;
}

interface FloatingDockProps {
  items: DockItem[];
  activeId: string;
  className?: string;
}

/**
 * Menu flutuante (dock) genérico, fixo na parte de baixo e centralizado.
 * Sem domínio: recebe itens + qual está ativo. A pílula ativa anima entre itens.
 */
export function FloatingDock({ items, activeId, className }: FloatingDockProps) {
  return (
    <nav
      aria-label="Primary"
      className={cn(
        "fixed inset-x-0 bottom-5 z-40 flex justify-center px-4",
        className,
      )}
    >
      <div className="glass flex items-center gap-1 rounded-full p-1.5 shadow-glass">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <Link
              key={item.id}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-2 rounded-full px-4 py-2.5 transition-colors",
                "outline-none focus-visible:ring-2 focus-visible:ring-brand-400",
                active ? "text-white" : "text-ink-muted hover:text-ink",
              )}
            >
              {active && (
                <motion.span
                  layoutId="dock-active"
                  transition={ease.spring}
                  className="absolute inset-0 rounded-full bg-brand-500 shadow-glow"
                />
              )}
              <motion.span
                whileHover={{ y: -2, scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                className="relative z-10 [&>svg]:size-5"
              >
                {item.icon}
              </motion.span>
              <span
                className={cn(
                  "relative z-10 text-sm font-medium",
                  // rótulo só aparece no item ativo (visual de dock)
                  active ? "inline" : "hidden sm:group-hover:inline",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
