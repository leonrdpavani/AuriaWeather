import "@/global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PreferencesProvider } from "@/lib/preferences/preferences";
import { CitiesProvider } from "@/features/weather/hooks/useCities";
import { palette } from "@/constants/palette";

/**
 * Layout raiz do app. Monta os providers globais (gestos + safe area +
 * preferências + localidades persistidas), a barra de status clara (UI é
 * escura) e um Stack sem header — a navegação principal vive no grupo (tabs).
 */
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PreferencesProvider>
          <CitiesProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: palette.surface },
              }}
            >
              <Stack.Screen name="(tabs)" />
            </Stack>
          </CitiesProvider>
        </PreferencesProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
