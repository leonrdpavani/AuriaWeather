"use client";

import { usePathname } from "next/navigation";
import {
  IconHomeFilled,
  IconMapPinFilled,
  IconRadarFilled,
  IconSettingsFilled,
} from "@tabler/icons-react";
import { FloatingDock, type DockItem } from "@/ui";

/**
 * Navegação principal do app (orquestração — vive em app/).
 * Define as rotas/ícones e marca a ativa; o visual é o FloatingDock (ui/).
 */
const ITEMS: DockItem[] = [
  { id: "home", label: "Home", icon: <IconHomeFilled />, href: "/" },
  { id: "cities", label: "Cities", icon: <IconMapPinFilled />, href: "/cities" },
  { id: "radar", label: "Radar", icon: <IconRadarFilled />, href: "/radar" },
  {
    id: "settings",
    label: "Settings",
    icon: <IconSettingsFilled />,
    href: "/settings",
  },
];

export function AppDock() {
  const pathname = usePathname();
  const active =
    ITEMS.find((i) => i.href !== "/" && pathname.startsWith(i.href))?.id ??
    "home";

  return <FloatingDock items={ITEMS} activeId={active} />;
}
