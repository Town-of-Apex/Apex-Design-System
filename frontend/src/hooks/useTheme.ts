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

export type ColorSystem = "default" | "ocean" | "sunset" | "forest"

const THEME_STORAGE_KEY = "apex-theme"
const COLOR_STORAGE_KEY = "apex-color-system"

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === "dark" || stored === "light") return stored
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark"
  return "light"
}

function getInitialColorSystem(): ColorSystem {
  const stored = localStorage.getItem(COLOR_STORAGE_KEY) as ColorSystem | null
  return stored || "default"
}

function applyTheme(theme: Theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark")
  } else {
    document.documentElement.removeAttribute("data-theme")
  }
}

function applyColorSystem(color: ColorSystem) {
  document.documentElement.setAttribute("data-color-system", color)
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)
  const [colorSystem, setColorSystem] = useState<ColorSystem>(getInitialColorSystem)

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    applyColorSystem(colorSystem)
    localStorage.setItem(COLOR_STORAGE_KEY, colorSystem)
  }, [colorSystem])

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  return { theme, toggleTheme, colorSystem, setColorSystem }
}
