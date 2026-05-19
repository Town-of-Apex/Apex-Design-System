/**
 * lib/utils.ts
 *
 * Utility helpers used throughout the application.
 *
 * cn() is the standard way to merge Tailwind classes in this codebase.
 * It combines clsx (conditional classes) with tailwind-merge (deduplication).
 *
 * Usage:
 *   cn("p-4", isActive && "bg-brand-primary", className)
 */
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
