import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getWeather } from "@/lib/api/weather";
import { config } from "@/lib/config";
import { WeatherDashboard } from "@/features/weather/components/WeatherDashboard";
import { ScreenBackground } from "@/components/ScreenBackground";
import type { WeatherData } from "@/features/weather/types";
import { palette } from "@/constants/palette";

/**
 * Tela inicial — carrega o clima da cidade padrão (camada lib/api) e monta o
 * WeatherDashboard. O fetch acontece na montagem (mock; vira TanStack Query
 * quando houver backend).
 */
export default function HomeScreen() {
  const [data, setData] = useState<WeatherData | null>(null);

  useEffect(() => {
    let active = true;
    getWeather(config.defaultCity).then((d) => {
      if (active) setData(d);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!data) {
    return (
      <ScreenBackground>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={palette.brand[300]} />
        </View>
      </ScreenBackground>
    );
  }

  return <WeatherDashboard initialData={data} />;
}
