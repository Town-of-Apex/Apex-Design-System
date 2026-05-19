/**
 * components/layout/AppFooter.tsx
 *
 * Application footer — shows the app name, version, and copyright year.
 * This replaces the .app-footer-meta auto-population from apex-core.js.
 */

import { useAppMetadata } from "@/hooks/useAppMetadata"

export function AppFooter() {
  const { metadata } = useAppMetadata()

  return (
    <footer
      style={{
        background:    "var(--bg-surface)",
        borderTop:     "1px solid var(--border-subtle)",
        paddingBlock:  "var(--space-2)",
        transition:    "background-color var(--duration-medium) var(--ease-standard)",
      }}
    >
      <div
        style={{
          width:     "100%",
          maxWidth:  "var(--container-width)",
          margin:    "0 auto",
          padding:   "0 var(--space-8)",
        }}
      >
        <p
          style={{
            fontSize:      "0.75rem",
            color:         "var(--text-muted)",
            fontWeight:    600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            margin:        0,
          }}
        >
          {metadata
            ? `${metadata.title} v${metadata.version} © ${metadata.year}`
            : "Apex Application"}
        </p>
      </div>
    </footer>
  )
}
