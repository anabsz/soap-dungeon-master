import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Converte o texto de um <input> em inteiro; null se não for válido. */
export function parseIntInput(value: string): number | null {
  const text = value.trim();
  return /^-?\d+$/.test(text) ? Number(text) : null;
}

export function formatSigned(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}
