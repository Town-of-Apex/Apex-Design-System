/**
 * types/app.ts
 *
 * Shared application-level types used across components.
 */

/** App metadata loaded from app_metadata.json */
export interface AppMetadata {
  title: string
  version: string
  author: string
  year: string
  status: string
  description: string
}

/** A navigation item used in the header and sidebar */
export interface NavItem {
  id: string
  label: string
  path: string
  /** Optional: hides the item from visible nav (still routable) */
  hidden?: boolean
}

/** Theme options */
export type Theme = "light" | "dark"
