/**
 * hooks/useAppMetadata.ts
 *
 * Loads the application identity (title, version, etc.) from app_metadata.json.
 * This is the React equivalent of how apex-core.js auto-populated the old
 * .app-title-text and .app-footer-meta elements.
 *
 * HOW TO USE:
 *   const { metadata, isLoading } = useAppMetadata()
 *   // metadata.title → "Apex Demo App"
 *   // metadata.version → "0.8.0"
 */

import { useState, useEffect } from "react"
import type { AppMetadata } from "@/types/app"

export function useAppMetadata() {
  const [metadata, setMetadata] = useState<AppMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}app_metadata.json`)
      .then((res) => res.json())
      .then((data: AppMetadata) => {
        setMetadata(data)
        // Update the browser tab title
        document.title = data.title
      })
      .catch(() => {
        // If the file is missing, use a safe fallback so the app still renders
        setMetadata({
          title:       "Apex Application",
          version:     "0.8.0",
          author:      "Apex IT",
          year:        new Date().getFullYear().toString(),
          status:      "Active",
          description: "Internal municipal application",
        })
      })
      .finally(() => setIsLoading(false))
  }, [])

  return { metadata, isLoading }
}
