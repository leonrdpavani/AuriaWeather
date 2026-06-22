import { Tabs, type BottomTabBarProps } from "expo-router/js-tabs";
import { Home, MapPin, Radar, Settings } from "lucide-react-native";
import { FloatingDock, type DockItem } from "@/ui";
import { palette } from "@/constants/palette";

function iconColor(active: boolean) {
  return active ? palette.white : palette.inkMuted;
}

const ITEMS: DockItem[] = [
  { id: "index", label: "Home", icon: (a) => <Home size={20} color={iconColor(a)} /> },
  { id: "cities", label: "Cities", icon: (a) => <MapPin size={20} color={iconColor(a)} /> },
  { id: "radar", label: "Radar", icon: (a) => <Radar size={20} color={iconColor(a)} /> },
  { id: "settings", label: "Settings", icon: (a) => <Settings size={20} color={iconColor(a)} /> },
];

/** Tab bar custom: adapta o estado do navigator para o FloatingDock (ui/). */
function DockTabBar({ state, navigation }: BottomTabBarProps) {
  const activeId = state.routes[state.index]?.name ?? "index";
  return (
    <FloatingDock
      items={ITEMS}
      activeId={activeId}
      onSelect={(id) => navigation.navigate(id)}
    />
  );
}

/**
 * Navegação principal por tabs. O visual é o FloatingDock flutuante (substitui
 * o AppDock do Next). Telas: Home (clima), Cities, Radar, Settings.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: "transparent" } }}
      tabBar={(props) => <DockTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="cities" />
      <Tabs.Screen name="radar" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
