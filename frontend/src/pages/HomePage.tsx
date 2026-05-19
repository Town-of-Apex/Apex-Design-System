/**
 * pages/HomePage.tsx
 *
 * The application home / landing page.
 * Demonstrates the standard page structure: PageContainer → PageHeader → sections.
 *
 * This is the React port of pages/home.html.
 */

import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/shared/PageHeader"
import { Divider } from "@/components/shared/Divider"
import { Card, CardContent } from "@/components/ui/Card"

// The three "getting started" steps to display
const GETTING_STARTED_STEPS = [
  {
    step:        "Step 1",
    title:       "Define Your Metadata",
    description: (
      <>
        Open <code>app_metadata.json</code> in the project root to update the
        application title, version, and author information.
      </>
    ),
  },
  {
    step:        "Step 2",
    title:       "Add Application Routes",
    description: (
      <>
        Add new entries to <code>src/lib/navigation.ts</code> and create a
        matching page component in <code>src/pages/</code>. Register the route
        in <code>App.tsx</code>.
      </>
    ),
  },
  {
    step:        "Step 3",
    title:       "Build Your Pages",
    description: (
      <>
        Create new <code>.tsx</code> files in <code>src/pages/</code> using the{" "}
        <code>PageContainer</code> and <code>PageHeader</code> components as your
        starting structure.
        <br />
        <a style={{ color: "var(--brand-primary)", textDecoration: "underline" }} href="https://www.google.com">google.com</a>
      </>
    ),
  },
]

export function HomePage() {
  return (
    <PageContainer>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-12)" }}>

        {/* ── Page title ───────────────────────────────────────────── */}
        <PageHeader
          overline="Home"
          title="Town of Apex Template App"
          subtitle="A ready-to-use starting point for building a professional web application using the Town of Apex Design System."
        />

        <Divider />

        {/* ── Getting Started cards ────────────────────────────────── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <h2
            style={{
              fontFamily:   "var(--font-ui)",
              fontWeight:    800,
              fontSize:     "1.5rem",
              letterSpacing: "-0.02em",
              color:        "var(--text-main)",
              margin:        0,
              textAlign:    "left",
            }}
          >
            Getting Started
          </h2>

          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap:                 "var(--space-6)",
            }}
          >
            {GETTING_STARTED_STEPS.map(({ step, title, description }) => (
              <Card key={step} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
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
                  {step}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontWeight: 800,
                    fontSize:   "1.125rem",
                    color:      "var(--text-main)",
                    margin:     "var(--space-2) 0 0",
                    textAlign:  "left",
                  }}
                >
                  {title}
                </h3>
                <CardContent>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize:   "1rem",
                      color:      "var(--text-main)",
                      lineHeight: 1.6,
                      margin:     "var(--space-2) 0 0",
                    }}
                  >
                    {description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Divider />

        {/* ── Technology stack summary ─────────────────────────────── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <h2
            style={{
              fontFamily:   "var(--font-ui)",
              fontWeight:    800,
              fontSize:     "1.5rem",
              letterSpacing: "-0.02em",
              color:        "var(--text-main)",
              margin:        0,
              textAlign:    "left",
            }}
          >
            Technology Stack
          </h2>

          <div
            style={{
              display:             "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap:                 "var(--space-4)",
            }}
          >
            {[
              { name: "React",       role: "UI component framework" },
              { name: "Vite",        role: "Development server & bundler" },
              { name: "TypeScript",  role: "Type safety" },
              { name: "Tailwind",    role: "Utility-first CSS" },
              { name: "FastAPI",     role: "Python backend API" },
              { name: "SQLite",      role: "Lightweight database" },
            ].map(({ name, role }) => (
              <Card key={name} variant="subtle">
                <p
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontWeight: 700,
                    fontSize:   "0.9375rem",
                    color:      "var(--brand-primary)",
                    margin:     0,
                    textAlign:  "left",
                  }}
                >
                  {name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize:   "0.875rem",
                    color:      "var(--text-muted)",
                    margin:     "var(--space-1) 0 0",
                  }}
                >
                  {role}
                </p>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </PageContainer>
  )
}
