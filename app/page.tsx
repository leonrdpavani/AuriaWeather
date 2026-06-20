import { getWeather } from "@/lib/api/weather";
import { config } from "@/lib/config";
import { WeatherDashboard } from "@/features/weather/components/WeatherDashboard";

/**
 * Página inicial — Server Component.
 * Apenas busca os dados (camada lib/api) e monta a feature client.
 * Nenhuma lógica de UI ou de API vive aqui (regra de arquitetura: app/ orquestra).
 */
export default async function Home() {
  const initialData = await getWeather(config.defaultCity);
  return <WeatherDashboard initialData={initialData} />;
}
