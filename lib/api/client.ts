import { config } from "@/lib/config";

/**
 * Cliente base único: baseURL, headers e (futuro) auth.
 * Toda chamada à API Node passa por aqui. Componentes NUNCA dão fetch direto.
 *
 * Em modo mock (sem NEXT_PUBLIC_API_BASE_URL) este cliente não é usado ainda —
 * os recursos retornam dados locais. Ele já existe como o ponto de troca para
 * quando plugarmos o backend de verdade.
 */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = RequestInit & {
  /** Opções de cache do Next (revalidate/tags) para leituras em Server Components. */
  next?: { revalidate?: number; tags?: string[] };
};

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const res = await fetch(`${config.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new ApiError(`Request failed: ${path}`, res.status);
  }

  return res.json() as Promise<T>;
}
