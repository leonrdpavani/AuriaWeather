import { useState } from "react";
import { View } from "react-native";
import { MotiView } from "moti";
import {
  Activity,
  Droplet,
  Eye,
  Gauge,
  Sun,
  Sunrise,
  Thermometer,
  Wind,
} from "lucide-react-native";
import { MetricTile, SegmentedControl, type SegmentOption } from "@/ui";
import {
  Compass,
  LevelBar,
  SunArc,
  uvLabel,
} from "@/features/weather/components/metric-visuals";
import type { DayTab, DayWeather, Unit } from "@/features/weather/types";
import { formatWind, toUnit, type WindUnit } from "@/lib/utils/format";
import { palette } from "@/constants/palette";

const ICON = palette.inkMuted;

const TABS: SegmentOption<DayTab>[] = [
  { value: "air", label: "Air", icon: <Activity size={15} color={ICON} /> },
  { value: "atmosphere", label: "Atmosphere", icon: <Wind size={15} color={ICON} /> },
  { value: "sun", label: "Sun", icon: <Sun size={15} color={ICON} /> },
];

interface DayDetailsTabsProps {
  day: DayWeather;
  unit: Unit;
  windUnit: WindUnit;
}

/** Abas com as informações detalhadas do DIA SELECIONADO. */
export function DayDetailsTabs({ day, unit, windUnit }: DayDetailsTabsProps) {
  const [tab, setTab] = useState<DayTab>("air");

  return (
    <View className="gap-4">
      <SegmentedControl
        accessibilityLabel="Day details"
        options={TABS}
        value={tab}
        onChange={setTab}
      />

      <MotiView
        key={tab}
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 250 }}
      >
        {tab === "air" && (
          <View className="flex-row gap-4">
            <MetricTile
              icon={<Activity size={15} color={ICON} />}
              label="Air Quality"
              value={`${day.airQuality.level} · ${day.airQuality.label}`}
            >
              <LevelBar pct={(day.airQuality.aqi / 300) * 100} />
            </MetricTile>
            <MetricTile
              icon={<Sun size={15} color={ICON} />}
              label="UV Index"
              value={day.uvIndex}
              footnote={uvLabel(day.uvIndex)}
            >
              <LevelBar pct={(day.uvIndex / 11) * 100} />
            </MetricTile>
          </View>
        )}

        {tab === "atmosphere" && (
          <View className="gap-4">
            <View className="flex-row gap-4">
              <MetricTile
                icon={<Wind size={15} color={ICON} />}
                label="Wind"
                value={formatWind(day.windKph, windUnit)}
              >
                <Compass deg={day.windDir} />
              </MetricTile>
              <MetricTile
                icon={<Droplet size={15} color={ICON} />}
                label="Humidity"
                value={`${day.humidity}%`}
                footnote={`Feels ${toUnit(day.feelsLikeC, unit)}°`}
              />
            </View>
            <View className="flex-row gap-4">
              <MetricTile
                icon={<Gauge size={15} color={ICON} />}
                label="Pressure"
                value={day.pressureHpa}
                footnote="hPa"
              />
              <MetricTile
                icon={<Eye size={15} color={ICON} />}
                label="Visibility"
                value={`${day.visibilityKm} km`}
              />
            </View>
          </View>
        )}

        {tab === "sun" && (
          <View className="gap-4">
            <MetricTile
              icon={<Sunrise size={15} color={ICON} />}
              label="Sunrise & Sunset"
            >
              <SunArc sunrise={day.sun.sunrise} sunset={day.sun.sunset} />
            </MetricTile>
            <View className="flex-row gap-4">
              <MetricTile
                icon={<Thermometer size={15} color={ICON} />}
                label="Feels Like"
                value={`${toUnit(day.feelsLikeC, unit)}°`}
              />
              <MetricTile
                icon={<Droplet size={15} color={ICON} />}
                label="Rainfall"
                value={`${day.rainfallMm} mm`}
                footnote={`${day.precipProbability}% chance`}
              />
            </View>
          </View>
        )}
      </MotiView>
    </View>
  );
}
