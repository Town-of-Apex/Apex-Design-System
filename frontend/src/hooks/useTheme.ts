/**
 * hooks/useTheme.ts
 *
 * Manages the light/dark theme for the application.
 *
 * HOW IT WORKS:
 * - The theme is stored in localStorage so it persists across page loads.
 * - Applying a theme sets/removes the `data-theme="dark"` attribute on <html>.
 * - This triggers the CSS custom property overrides defined in globals.css.
 *
 * HOW TO USE:
 *   const { theme, toggleTheme } = useTheme()
 */

import { useState, useEffect } from "react"
import type { Theme } from "@/types/app"

const STORAGE_KEY = "apex-theme"

function getInitialTheme(): Theme {
  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === "dark" || stored === "light") return stored

  // Fall back to the user's OS preference
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark"

  return "light"
}

function applyTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark")
  } else {
    document.documentElement.removeAttribute("data-theme")
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  // Apply the theme to <html> whenever it changes
  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return { theme, toggleTheme }
}
