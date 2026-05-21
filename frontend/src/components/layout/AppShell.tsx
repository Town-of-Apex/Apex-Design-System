/**
 * components/layout/AppShell.tsx
 *
 * The root application layout. Wraps every page with:
 *   - AppHeader (sticky top)
 *   - <main> content area (fills remaining space)
 *   - AppFooter (bottom)
 *
 * This is the React equivalent of the <body> structure in core.html.
 *
 * HOW TO USE:
 * AppShell is rendered once in App.tsx and wraps all routes via <Outlet />.
 * You never need to add the header/footer inside individual page components.
 */

import { Outlet } from "react-router-dom"
import { Toaster } from "sonner"
import { AppHeader } from "@/components/layout/AppHeader"
import { AppFooter } from "@/components/layout/AppFooter"

export function AppShell() {
  return (
    <>
      {/* Sticky application header */}
      <AppHeader />

      {/* Main content area — grows to fill space between header and footer */}
      <main
        style={{
          flex:    1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* <Outlet /> renders the matched child route's page component */}
        <Outlet />
      </main>

      {/* Sticky footer */}
      <AppFooter />

      {/*
        Sonner toast notifications.
        Call toast("Message") or toast.success("Done") from anywhere in the app.
        This is the equivalent of the old apex.showToast() global function.
      */}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background:   "var(--bg-surface)",
            border:       "1px solid var(--border-strong)",
            color:        "var(--text-main)",
            borderRadius: "var(--radius-btn)",
            fontFamily:   "var(--font-body)",
          },
        }}
      />
    </>
  )
}
