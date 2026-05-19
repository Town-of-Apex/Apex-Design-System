/**
 * components/shared/PageHeader.tsx
 *
 * Standard page title block used at the top of every page.
 * Outputs the overline label, serif h1, and optional subtitle.
 *
 * This replaces the repeated HTML pattern:
 *   <p class="metadata">Section</p>
 *   <h1 class="mt-2">Page Title</h1>
 *   <p class="body-text mt-4">Subtitle text.</p>
 *
 * HOW TO USE:
 *   <PageHeader
 *     overline="Applications"
 *     title="Permit Applications"
 *     subtitle="Submit, search, and manage permit records."
 *   />
 */

interface PageHeaderProps {
  /** Small all-caps label shown above the title (e.g. "Applications") */
  overline?: string
  /** The main page title — rendered as an h1 */
  title: string
  /** Optional subtitle paragraph */
  subtitle?: string
}

export function PageHeader({ overline, title, subtitle }: PageHeaderProps) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {overline && (
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
          {overline}
        </p>
      )}

      <h1
        style={{
          fontFamily:   "var(--font-display)",
          fontWeight:   400,
          fontSize:     "3rem",
          lineHeight:   1.1,
          letterSpacing: "-0.01em",
          color:        "var(--brand-primary)",
          textAlign:    "left",
          margin:       overline ? "var(--space-2) 0 0" : 0,
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize:   "1rem",
            color:      "var(--text-main)",
            lineHeight: 1.6,
            marginTop:  "var(--space-4)",
            marginBottom: 0,
          }}
        >
          {subtitle}
        </p>
      )}
    </section>
  )
}
