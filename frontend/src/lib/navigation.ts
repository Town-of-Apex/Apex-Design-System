/**
 * lib/navigation.ts
 *
 * Central definition of the application's navigation structure.
 *
 * This is the React equivalent of the `tabs` array in apex-config.js.
 * To add a new page to the navigation:
 *   1. Add an entry here
 *   2. Create the page component in /pages
 *   3. Add the route in App.tsx
 *
 * Set `hidden: true` to make a page routable but not shown in the nav bar
 * (e.g., the Settings page, which is accessed via the settings dropdown).
 */

import type { NavItem } from "@/types/app"

export const NAV_ITEMS: NavItem[] = [
  {
    id:    "home",
    label: "Home",
    path:  "/",
  },
  {
    id:    "permits",
    label: "Permits",
    path:  "/permits",
  },
  {
    id:    "components",
    label: "Components",
    path:  "/components",
  },
  {
    id:    "colors",
    label: "Colors",
    path:  "/colors",
  },
  {
    id:     "settings",
    label:  "Settings",
    path:   "/settings",
    hidden: true, // Accessible via the settings dropdown, not the nav bar
  },
  {
    id:     "profile",
    label:  "User Profile",
    path:   "/profile",
    hidden: true,
  },
]
