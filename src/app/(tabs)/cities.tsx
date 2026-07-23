import { ScrollView, Text, View } from "react-native";
import { MotiView } from "moti";
import { useRouter } from "expo-router";
import { MapPin } from "lucide-react-native";
import { EmptyState } from "@/ui";
import { ScreenBackground } from "@/components/ScreenBackground";
import { CitySearch } from "@/features/weather/components/CitySearch";
import { CityCard } from "@/features/weather/components/CityCard";
import { useCities } from "@/features/weather/hooks/useCities";
import { usePreferences } from "@/lib/preferences/preferences";
import { fadeUpFrom, fadeUpTo, stagger } from "@/ui/tokens/motion";
import { palette } from "@/constants/palette";

/**
 * Tela de cidades salvas. Busca para adicionar, lista persistida com o clima de
 * cada uma; tocar abre a cidade na Home. Estado vem dos providers globais.
 */
export default function CitiesScreen() {
  const router = useRouter();
  const { saved, active, setActive, toggleSaved, removeSaved, isSaved } =
    useCities();
  const { tempUnit, reduceMotion } = usePreferences();

  function open(city: string) {
    setActive(city);
    router.navigate("/");
  }

  function add(city: string) {
    if (!isSaved(city)) toggleSaved(city);
  }

  return (
    <ScreenBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, gap: 16 }}
      >
        <View className="gap-1 px-1">
          <Text className="text-3xl font-semibold text-ink">Cities</Text>
          <Text className="text-sm text-ink-muted">
            {saved.length > 0
              ? `${saved.length} saved ${saved.length === 1 ? "place" : "places"}`
              : "Search and save your favorite places"}
          </Text>
        </View>

        <CitySearch onSelect={add} />

        {saved.length === 0 ? (
          <View className="pt-6">
            <EmptyState
              icon={<MapPin size={32} color={palette.brand[300]} />}
              title="No cities yet"
              description="Use the search above to save cities and compare their weather side by side."
            />
          </View>
        ) : (
          <View className="gap-3">
            {saved.map((city, i) =>
              reduceMotion ? (
                <CityCard
                  key={city}
                  city={city}
                  unit={tempUnit}
                  active={city === active}
                  onOpen={open}
                  onRemove={removeSaved}
                />
              ) : (
                <MotiView
                  key={city}
                  from={fadeUpFrom}
                  animate={fadeUpTo}
                  transition={{ type: "timing", duration: 350, delay: stagger(i) }}
                >
                  <CityCard
                    city={city}
                    unit={tempUnit}
                    active={city === active}
                    onOpen={open}
                    onRemove={removeSaved}
                  />
                </MotiView>
              ),
            )}
          </View>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}
