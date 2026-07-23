/**
 * Armazenamento local tipado (camada lib — sem domínio, sem UI).
 *
 * Fino wrapper JSON sobre o AsyncStorage do Expo. Persiste preferências e a
 * lista de cidades salvas entre aberturas do app. Toda leitura/escrita é
 * assíncrona e tolerante a falha (retorna fallback em vez de lançar) — storage
 * corrompido nunca deve derrubar a UI.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

/** Namespace das chaves para evitar colisão com outros consumidores. */
const PREFIX = "auria:";

/** Lê e faz parse de um valor. Retorna `fallback` se ausente ou inválido. */
export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Serializa e grava um valor. Silencioso em caso de falha de escrita. */
export async function saveJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Sem storage disponível: o app segue com o estado em memória.
  }
}
