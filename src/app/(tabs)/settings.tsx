import { Settings } from "lucide-react-native";
import { EmptyState } from "@/ui";
import { ScreenBackground } from "@/components/ScreenBackground";
import { palette } from "@/constants/palette";

export default function SettingsScreen() {
  return (
    <ScreenBackground>
      <EmptyState
        icon={<Settings size={32} color={palette.brand[300]} />}
        title="Settings"
        description="Units, theme and notification preferences will live here."
      />
    </ScreenBackground>
  );
}
