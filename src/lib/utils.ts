import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina classes condicionalmente e resolve conflitos do Tailwind.
 * 
 * @param inputs Lista de strings ou falsy values para combinar
 * @returns Uma única string com as classes combinadas
 */
export function cn(...inputs: Array<string | undefined | null | false>): string {
  return twMerge(clsx(...inputs))
}
