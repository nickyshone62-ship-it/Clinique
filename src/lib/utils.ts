import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine et fusionne les classes CSS Tailwind proprement.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
