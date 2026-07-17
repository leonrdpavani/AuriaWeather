import { Radar } from "lucide-react-native";
import { EmptyState } from "@/ui";
import { ScreenBackground } from "@/components/ScreenBackground";
import { palette } from "@/constants/palette";

export default function RadarScreen() {
  return (
    <ScreenBackground>
      <EmptyState
        icon={<Radar size={32} color={palette.brand[300]} />}
        title="Live Radar"
        description="An animated precipitation and storm radar map is on the way."
      />
    </ScreenBackground>
  );
}
