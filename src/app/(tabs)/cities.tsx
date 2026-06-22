import { MapPin } from "lucide-react-native";
import { EmptyState } from "@/ui";
import { ScreenBackground } from "@/components/ScreenBackground";
import { palette } from "@/constants/palette";

export default function CitiesScreen() {
  return (
    <ScreenBackground>
      <EmptyState
        icon={<MapPin size={32} color={palette.brand[300]} />}
        title="Saved Cities"
        description="Soon you'll be able to pin multiple cities and compare their weather side by side."
      />
    </ScreenBackground>
  );
}
