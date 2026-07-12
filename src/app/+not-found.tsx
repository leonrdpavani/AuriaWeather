import { router } from "expo-router";
import { Compass } from "lucide-react-native";
import { Button, EmptyState } from "@/ui";
import { ScreenBackground } from "@/components/ScreenBackground";
import { palette } from "@/constants/palette";

/**
 * Rota de fallback (convenção do expo-router): renderizada quando nenhuma rota
 * casa com a URL. Mantém a identidade visual e oferece volta ao início.
 */
export default function NotFoundScreen() {
  return (
    <ScreenBackground>
      <EmptyState
        icon={<Compass size={32} color={palette.brand[300]} />}
        title="Screen not found"
        description="This screen doesn't exist. Let's get you back to the forecast."
        action={
          <Button onPress={() => router.replace("/")}>Back to home</Button>
        }
      />
    </ScreenBackground>
  );
}
