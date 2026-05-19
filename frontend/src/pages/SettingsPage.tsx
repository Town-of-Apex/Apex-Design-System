/**
 * pages/SettingsPage.tsx
 *
 * App settings page. Demonstrates complex form layouts with cards.
 *
 * This is the React port of pages/settings.html.
 */

import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/shared/PageHeader"
import { Divider } from "@/components/shared/Divider"
import { Card } from "@/components/ui/Card"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { toast } from "sonner"
import { useState } from "react"

export function SettingsPage() {
  const [settings, setSettings] = useState({
    primaryColor: "forest-green",
    accentColor: "sunflower-gold",
    muppet: "Gonzo the Great",
    somethingElse: true,
    emailNotifications: false,
    evenMoreThings: true,
  })

  const handleSave = () => {
    toast.success("Settings saved", { description: "Your preferences have been updated." })
  }

  return (
    <PageContainer>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        
        <PageHeader
          overline="System Preferences"
          title="App Settings"
          subtitle="Configure your application experience and preferences."
        />

        <Divider />

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-10)", maxWidth: "800px" }}>
          
          {/* ── Appearance ─────────────────────────────────────────── */}
          <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <h3 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.125rem", color: "var(--text-main)", margin: 0 }}>
              Appearance &amp; Theme
            </h3>
            
            <Card style={{ padding: "var(--space-6)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Primary App Color</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "var(--space-1) 0 0" }}>
                      Main brand color for the application.
                    </p>
                  </div>
                  <Select
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    style={{ width: "200px" }}
                  >
                    <option value="forest-green">Forest Green</option>
                    <option value="hunter-green">Hunter Green</option>
                    <option value="baltic-blue">Baltic Blue</option>
                    <option value="sunflower-gold">Sunflower Gold</option>
                    <option value="cinnabar">Cinnabar</option>
                    <option value="grey-olive">Grey Olive</option>
                  </Select>
                </div>

                <Divider />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Accent Color</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "var(--space-1) 0 0" }}>
                      Color used for highlights and warnings.
                    </p>
                  </div>
                  <Select
                    value={settings.accentColor}
                    onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                    style={{ width: "200px" }}
                  >
                    <option value="sunflower-gold">Sunflower Gold</option>
                    <option value="forest-green">Forest Green</option>
                    <option value="hunter-green">Hunter Green</option>
                    <option value="baltic-blue">Baltic Blue</option>
                    <option value="cinnabar">Cinnabar</option>
                    <option value="grey-olive">Grey Olive</option>
                  </Select>
                </div>
              </div>
            </Card>
          </section>

          {/* ── General ────────────────────────────────────────────── */}
          <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <h3 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.125rem", color: "var(--text-main)", margin: 0 }}>
              General
            </h3>
            
            <Card style={{ padding: "var(--space-6)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Placeholder Dropdown</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "var(--space-1) 0 0" }}>
                      Who is the coolest Muppet?
                    </p>
                  </div>
                  <Select
                    value={settings.muppet}
                    onChange={(e) => setSettings({ ...settings, muppet: e.target.value })}
                    style={{ width: "200px" }}
                  >
                    <option value="Dr. Teeth">Dr. Teeth</option>
                    <option value="Animal">Animal</option>
                    <option value="Gonzo the Great">Gonzo the Great</option>
                    <option value="Rowlf the Dog">Rowlf the Dog</option>
                    <option value="Beaker">Beaker</option>
                    <option value="Swedish Chef">Swedish Chef</option>
                  </Select>
                </div>

                <Divider />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-4)" }}>
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Something Else</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "var(--space-1) 0 0" }}>
                      This should probably have a checkbox or toggle switch or something.
                    </p>
                  </div>
                  <label style={{ position: "relative", display: "inline-block", width: "44px", height: "24px", flexShrink: 0 }}>
                    <input
                      type="checkbox"
                      checked={settings.somethingElse}
                      onChange={(e) => setSettings({ ...settings, somethingElse: e.target.checked })}
                      style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                    />
                    <span
                      style={{
                        position:        "absolute",
                        cursor:          "pointer",
                        inset:           0,
                        backgroundColor: settings.somethingElse ? "var(--brand-primary)" : "var(--bg-inner)",
                        borderRadius:    "var(--radius-btn)",
                        border:          `1px solid ${settings.somethingElse ? "var(--brand-primary)" : "var(--border-strong)"}`,
                        transition:      "all var(--duration-fast) var(--ease-standard)",
                      }}
                    >
                      <span
                        style={{
                          position:        "absolute",
                          height:          "16px",
                          width:           "16px",
                          left:            "3px",
                          bottom:          "3px",
                          backgroundColor: "white",
                          borderRadius:    "4px",
                          transition:      "all var(--duration-fast) var(--ease-standard)",
                          transform:       settings.somethingElse ? "translateX(20px)" : "translateX(0)",
                        }}
                      />
                    </span>
                  </label>
                </div>
              </div>
            </Card>
          </section>

          {/* ── Actions ────────────────────────────────────────────── */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-4)" }}>
            <Button variant="secondary" onClick={() => toast("Changes discarded")}>Discard Changes</Button>
            <Button variant="primary" onClick={handleSave}>Save Settings</Button>
          </div>

        </div>
      </div>
    </PageContainer>
  )
}
