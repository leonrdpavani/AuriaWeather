import { useMemo, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { MotiView } from "moti";
import { MapPin, Search } from "lucide-react-native";
import { GlassCard } from "@/ui";
import { listCities } from "@/lib/api/weather";
import { cn } from "@/lib/utils/cn";
import { palette } from "@/constants/palette";

interface CitySearchProps {
  onSelect: (city: string) => void;
  className?: string;
}

/** Busca de cidade com sugestões (filtra o mock). */
export function CitySearch({ onSelect, className }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const cities = useMemo(() => listCities(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter(
      (c) =>
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q),
    );
  }, [cities, query]);

  function choose(city: string) {
    onSelect(city);
    setQuery("");
    setOpen(false);
  }

  return (
    <View className={cn("relative", className)} style={{ zIndex: 20 }}>
      <View className="flex-row items-center gap-2 rounded-full border border-glass-border bg-glass px-4 py-2.5">
        <Search size={16} color={palette.inkSubtle} />
        <TextInput
          value={query}
          onChangeText={(t) => {
            setQuery(t);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          placeholder="Search for a city"
          placeholderTextColor={palette.inkSubtle}
          className="flex-1 text-sm text-ink"
          style={{ paddingVertical: 0 }}
        />
      </View>

      {open && results.length > 0 && (
        <MotiView
          from={{ opacity: 0, translateY: -8 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 200 }}
          className="absolute left-0 right-0 top-full mt-2"
          style={{ zIndex: 30 }}
        >
          <GlassCard className="overflow-hidden p-1.5">
            {results.map((c) => (
              <Pressable
                key={c.city}
                onPress={() => choose(c.city)}
                className="flex-row items-center gap-2.5 rounded-2xl px-3 py-2.5 active:bg-glass-strong"
              >
                <MapPin size={16} color={palette.inkSubtle} />
                <Text className="text-sm font-medium text-ink">{c.city}</Text>
                <Text className="text-xs text-ink-subtle">{c.country}</Text>
              </Pressable>
            ))}
          </GlassCard>
        </MotiView>
      )}
    </View>
  );
}
