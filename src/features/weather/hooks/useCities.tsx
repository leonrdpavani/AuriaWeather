/**
 * Estado global de localidades (domínio clima, persistido).
 *
 * Guarda a lista de cidades SALVAS e a cidade ATIVA (a que a Home exibe).
 * Compartilhado entre a Home (estrela de favoritar + cidade atual) e a tela
 * Cities (lista + selecionar). Persiste no storage (lib) — a direção de
 * dependência segue feature → lib.
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
import { config } from "@/lib/config";
import { loadJSON, saveJSON } from "@/lib/storage/store";

interface StoredCities {
  saved: string[];
  active: string;
}

const STORAGE_KEY = "cities";

interface CitiesContextValue {
  /** Nomes das cidades salvas (na ordem em que foram adicionadas). */
  saved: string[];
  /** Cidade exibida na Home. */
  active: string;
  hydrated: boolean;
  setActive: (city: string) => void;
  toggleSaved: (city: string) => void;
  removeSaved: (city: string) => void;
  isSaved: (city: string) => boolean;
}

const CitiesContext = createContext<CitiesContextValue | null>(null);

export function CitiesProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [active, setActiveState] = useState<string>(config.defaultCity);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let alive = true;
    loadJSON<StoredCities>(STORAGE_KEY, {
      saved: [],
      active: config.defaultCity,
    }).then((data) => {
      if (!alive) return;
      setSaved(data.saved);
      setActiveState(data.active || config.defaultCity);
      setHydrated(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const persist = useCallback((next: StoredCities) => {
    void saveJSON(STORAGE_KEY, next);
  }, []);

  const setActive = useCallback(
    (city: string) => {
      setActiveState((prevActive) => {
        setSaved((prevSaved) => {
          persist({ saved: prevSaved, active: city });
          return prevSaved;
        });
        return city;
      });
    },
    [persist],
  );

  const toggleSaved = useCallback(
    (city: string) => {
      setSaved((prev) => {
        const exists = prev.some((c) => c === city);
        const next = exists ? prev.filter((c) => c !== city) : [...prev, city];
        setActiveState((a) => {
          persist({ saved: next, active: a });
          return a;
        });
        return next;
      });
    },
    [persist],
  );

  const removeSaved = useCallback(
    (city: string) => {
      setSaved((prev) => {
        const next = prev.filter((c) => c !== city);
        setActiveState((a) => {
          persist({ saved: next, active: a });
          return a;
        });
        return next;
      });
    },
    [persist],
  );

  const isSaved = useCallback(
    (city: string) => saved.some((c) => c === city),
    [saved],
  );

  const value = useMemo<CitiesContextValue>(
    () => ({
      saved,
      active,
      hydrated,
      setActive,
      toggleSaved,
      removeSaved,
      isSaved,
    }),
    [saved, active, hydrated, setActive, toggleSaved, removeSaved, isSaved],
  );

  return (
    <CitiesContext.Provider value={value}>{children}</CitiesContext.Provider>
  );
}

/** Acessa as localidades globais. Erra se usado fora do provider. */
export function useCities(): CitiesContextValue {
  const ctx = useContext(CitiesContext);
  if (!ctx) {
    throw new Error("useCities deve ser usado dentro de CitiesProvider");
  }
  return ctx;
}
