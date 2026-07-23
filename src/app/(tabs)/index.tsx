import { ActivityIndicator, View } from "react-native";
import { useCities } from "@/features/weather/hooks/useCities";
import { useCityWeather } from "@/features/weather/hooks/useCityWeather";
import { WeatherDashboard } from "@/features/weather/components/WeatherDashboard";
import { ScreenBackground } from "@/components/ScreenBackground";
import { palette } from "@/constants/palette";

/**
 * Tela inicial — tela fina: lê a cidade ativa (estado global persistido) e
 * monta o WeatherDashboard com o clima dela. Trocar a cidade ativa (aqui ou na
 * tela Cities) refaz o fetch automaticamente.
 */
export default function HomeScreen() {
  const { active } = useCities();
  const { data, isLoading } = useCityWeather(active);

  if (!data) {
    return (
      <ScreenBackground>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={palette.brand[300]} />
        </View>
      </ScreenBackground>
    );
  }

  return <WeatherDashboard data={data} refreshing={isLoading} />;
}
