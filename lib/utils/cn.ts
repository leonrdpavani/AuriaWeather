import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Junta classes condicionais (clsx) e resolve conflitos do Tailwind (twMerge).
 * Util genérico, sem domínio — usado por todo primitivo de ui/.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
