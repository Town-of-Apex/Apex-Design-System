/**
 * pages/ComponentsPage.tsx
 *
 * Design system component showcase.
 * Demonstrates all available UI primitives with working examples.
 *
 * This is the React port of pages/components.html.
 */

import { useState } from "react"
import { toast } from "sonner"
import { Plus } from "lucide-react"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/shared/PageHeader"
import { Divider } from "@/components/shared/Divider"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Textarea } from "@/components/ui/Textarea"
import { Label } from "@/components/ui/Label"
import { Badge } from "@/components/ui/Badge"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/Dialog"

export function ComponentsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dangerDialogOpen, setDangerDialogOpen] = useState(false)
  const [switchOn, setSwitchOn] = useState(true)
  const [checkboxOn, setCheckboxOn] = useState(true)

  return (
    <PageContainer>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-12)" }}>

        {/* ── Page title ───────────────────────────────────────────── */}
        <PageHeader
          overline="Components"
          title="Components"
          subtitle="A collection of reusable UI primitives built on accessible Radix UI foundations."
        />

        <Divider />

        {/* ── Buttons & Dialogs ────────────────────────────────────── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-main)", margin: 0, textAlign: "left" }}>
            Buttons &amp; Dialogs
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-4)" }}>
            {/* Primary → opens standard dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="primary">Primary Button</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Standard Modal</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p style={{ margin: 0, color: "var(--text-main)", lineHeight: 1.6 }}>
                    This is a standardized dialog built on Radix UI's Dialog primitive.
                    It traps focus, closes on Escape, and is fully accessible.
                  </p>
                </DialogBody>
                <DialogFooter>
                  <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Secondary → success toast */}
            <Button
              variant="secondary"
              onClick={() => toast.success("Success", { description: "Operation completed." })}
            >
              Secondary Button
            </Button>

            {/* Ghost → info toast */}
            <Button
              variant="ghost"
              onClick={() => toast.info("Info", { description: "Here's some information." })}
            >
              Ghost Button
            </Button>

            {/* Danger → danger dialog */}
            <Dialog open={dangerDialogOpen} onOpenChange={setDangerDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="danger">Danger Button</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p style={{ margin: 0, color: "var(--text-main)", lineHeight: 1.6 }}>
                    Are you sure you want to permanently delete this record?
                    This action cannot be undone.
                  </p>
                </DialogBody>
                <DialogFooter>
                  <Button variant="secondary" onClick={() => setDangerDialogOpen(false)}>Cancel</Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      setDangerDialogOpen(false)
                      toast.error("Record deleted", { description: "The record has been permanently removed." })
                    }}
                  >
                    Delete Permanently
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
            Apex supports four button variants and accessible dialog/toast feedback.
          </p>
        </section>

        <Divider />

        {/* ── Badges ───────────────────────────────────────────────── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-main)", margin: 0, textAlign: "left" }}>
            Status Badges
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)" }}>
            <Badge variant="default">Closed</Badge>
            <Badge variant="success">Approved</Badge>
            <Badge variant="info">Submitted</Badge>
            <Badge variant="warning">Under Review</Badge>
            <Badge variant="error">Rejected</Badge>
          </div>
        </section>

        <Divider />

        {/* ── Forms ────────────────────────────────────────────────── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-main)", margin: 0, textAlign: "left" }}>
            Input &amp; Form Styling
          </h2>
          <Card style={{ maxWidth: "600px" }}>
            <form
              style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
              onSubmit={(e) => {
                e.preventDefault()
                toast.success("Form submitted", { description: "Configuration saved." })
              }}
            >
              <div>
                <Label htmlFor="demo-name">Full Name</Label>
                <Input id="demo-name" type="text" placeholder="e.g. Alexander Hamilton" />
              </div>
              <div>
                <Label htmlFor="demo-dept">Department</Label>
                <Select id="demo-dept">
                  <option>Treasury</option>
                  <option>State</option>
                  <option>War</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="demo-notes">Notes</Label>
                <Textarea id="demo-notes" rows={4} placeholder="Enter observations..." />
              </div>
              <div style={{ marginTop: "var(--space-2)" }}>
                <Button type="submit" variant="primary">
                  <Plus className="w-4 h-4" />
                  Save Configuration
                </Button>
              </div>
            </form>
          </Card>
        </section>

        <Divider />

        {/* ── Selection Controls ───────────────────────────────────── */}
        <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <h2 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.5rem", color: "var(--text-main)", margin: 0, textAlign: "left" }}>
            Selection &amp; Toggles
          </h2>
          <Card style={{ maxWidth: "600px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>

              {/* Toggle Switch */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Toggle Switch</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: "var(--space-1) 0 0" }}>
                    Binary state selection (e.g. Settings)
                  </p>
                </div>
                {/* Native toggle switch — styled via inline styles matching apex-modern.css */}
                <label style={{ position: "relative", display: "inline-block", width: "44px", height: "24px", flexShrink: 0 }}>
                  <input
                    type="checkbox"
                    checked={switchOn}
                    onChange={(e) => setSwitchOn(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0, position: "absolute" }}
                  />
                  <span
                    style={{
                      position:        "absolute",
                      cursor:          "pointer",
                      inset:           0,
                      backgroundColor: switchOn ? "var(--brand-primary)" : "var(--bg-inner)",
                      borderRadius:    "var(--radius-btn)",
                      border:          `1px solid ${switchOn ? "var(--brand-primary)" : "var(--border-strong)"}`,
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
                        transform:       switchOn ? "translateX(20px)" : "translateX(0)",
                      }}
                    />
                  </span>
                </label>
              </div>

              <Divider />

              {/* Checkbox */}
              <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
                <input
                  type="checkbox"
                  id="demo-checkbox"
                  checked={checkboxOn}
                  onChange={(e) => setCheckboxOn(e.target.checked)}
                  style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer", accentColor: "var(--brand-primary)" }}
                />
                <label htmlFor="demo-checkbox" style={{ fontWeight: 600, color: "var(--text-main)", cursor: "pointer" }}>
                  Standard Checkbox
                </label>
              </div>

            </div>
          </Card>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
            Switches use React-controlled state. Checkboxes use native accent-color for brand alignment.
          </p>
        </section>

      </div>
    </PageContainer>
  )
}
