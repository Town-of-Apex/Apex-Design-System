/**
 * pages/ColorsPage.tsx
 *
 * Color palette showcase.
 * Demonstrates the use of CSS variables from the design system.
 *
 * This is the React port of pages/colors.html.
 */

import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/shared/PageHeader"
import { Divider } from "@/components/shared/Divider"
import { Card } from "@/components/ui/Card"

const BRAND_COLORS = [
  { name: "Forest Green", hex: "#3f873f", varName: "--town-forest-green" },
  { name: "Sunflower Gold", hex: "#f3bd48", varName: "--town-sunflower-gold" },
  { name: "Cinnabar", hex: "#d75742", varName: "--town-cinnabar" },
  { name: "Baltic Blue", hex: "#00586f", varName: "--town-baltic-blue" },
  { name: "Hunter Green", hex: "#40683c", varName: "--town-hunter-green" },
  { name: "Grey Olive", hex: "#968c83", varName: "--town-grey-olive" },
  { name: "Dim Grey", hex: "#796e65", varName: "--town-dim-grey" },
]

export function ColorsPage() {
  return (
    <PageContainer>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        
        <PageHeader
          overline="Design System"
          title="Color Palette"
          subtitle="Official Town of Apex brand colors and semantic state colors."
        />

        <Divider />

        <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-main)", margin: 0 }}>
            Official Brand Colors
          </h2>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
            {BRAND_COLORS.map(({ name, hex, varName }) => (
              <Card key={name} style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ height: "100px", backgroundColor: `var(${varName})` }} />
                <div style={{ padding: "var(--space-4)" }}>
                  <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>{name}</p>
                  <p style={{ fontFamily: "monospace", fontSize: "0.875rem", color: "var(--text-muted)", margin: "var(--space-1) 0 0" }}>{hex}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "var(--space-1) 0 0" }}>var({varName})</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <Divider />

        <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-main)", margin: 0 }}>
            Semantic Roles
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            {[
              { role: "Primary Brand", value: "var(--brand-primary)", desc: "Used for headers, primary buttons, and major accents." },
              { role: "Accent", value: "var(--brand-accent)", desc: "Used for warnings and secondary highlights." },
              { role: "Success", value: "var(--color-success)", desc: "Positive actions, completed states." },
              { role: "Warning", value: "var(--color-warning)", desc: "Pending states, cautious actions." },
              { role: "Error", value: "var(--color-error)", desc: "Destructive actions, failures." },
              { role: "Info", value: "var(--color-info)", desc: "Informational messages, neutral states." },
            ].map(({ role, value, desc }) => (
              <Card key={role} style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", padding: "var(--space-4)" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-btn)", backgroundColor: value }} />
                <div>
                  <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>{role}</p>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: "var(--space-1) 0 0" }}>{desc}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </PageContainer>
  )
}
