/**
 * Preferências do app (estado global persistido).
 *
 * Vive em `lib/` porque é configuração transversal: tanto a feature de clima
 * (unidade de temperatura/vento) quanto a tela de ajustes consomem daqui, sem
 * quebrar a direção de dependência (features → lib). Carrega do storage na
 * montagem e grava a cada mudança.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Unit, WindUnit } from "@/lib/utils/format";
import { loadJSON, saveJSON } from "@/lib/storage/store";

export interface Preferences {
  /** Unidade de temperatura. */
  tempUnit: Unit;
  /** Unidade de velocidade do vento. */
  windUnit: WindUnit;
  /** Reduz animações de entrada (acessibilidade / performance). */
  reduceMotion: boolean;
  /** Exibe o banner de alertas severos na Home. */
  showAlerts: boolean;
}

const DEFAULTS: Preferences = {
  tempUnit: "celsius",
  windUnit: "kmh",
  reduceMotion: false,
  showAlerts: true,
};

const STORAGE_KEY = "preferences";

interface PreferencesContextValue extends Preferences {
  /** true até o valor persistido carregar (evita "piscar" o default). */
  hydrated: boolean;
  setPreference: <K extends keyof Preferences>(
    key: K,
    value: Preferences[K],
  ) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULTS);
  const [hydrated, setHydrated] = useState(false);

  // Carrega uma vez na montagem.
  useEffect(() => {
    let active = true;
    loadJSON<Preferences>(STORAGE_KEY, DEFAULTS).then((saved) => {
      if (!active) return;
      setPrefs({ ...DEFAULTS, ...saved });
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const setPreference = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
      setPrefs((prev) => {
        const next = { ...prev, [key]: value };
        void saveJSON(STORAGE_KEY, next);
        return next;
      });
    },
    [],
  );

  const value = useMemo<PreferencesContextValue>(
    () => ({ ...prefs, hydrated, setPreference }),
    [prefs, hydrated, setPreference],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

/** Acessa as preferências globais. Erra se usado fora do provider. */
export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error("usePreferences deve ser usado dentro de PreferencesProvider");
  }
  return ctx;
}
