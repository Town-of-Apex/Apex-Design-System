/**
 * pages/PermitsPage.tsx
 *
 * Permit application management.
 * Demonstrates table layout, search filtering, and form modals.
 *
 * This is the React port of pages/permits.html and static/permits.js.
 */

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Search, Plus } from "lucide-react"

import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/shared/PageHeader"
import { Divider } from "@/components/shared/Divider"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Textarea } from "@/components/ui/Textarea"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "@/components/ui/Dialog"

import { permitService } from "@/services/permitService"
import type { Permit, PermitStatus, PermitFormData } from "@/types/permit"

export function PermitsPage() {
  const [permits, setPermits] = useState<Permit[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<PermitStatus | "">("")

  // Form modal state
  const [formOpen, setFormOpen] = useState(false)
  const [formData, setFormData] = useState<PermitFormData>({
    applicant_name: "",
    applicant_email: "",
    project_address: "",
    permit_type: "Building",
    status: "Submitted",
    description: "",
  })

  const loadPermits = async () => {
    setLoading(true)
    try {
      const data = await permitService.getAll({
        search: search.trim() !== "" ? search : undefined,
        status: statusFilter !== "" ? statusFilter : undefined,
      })
      setPermits(data)
    } catch (error) {
      toast.error("Failed to load permits", { description: String(error) })
    } finally {
      setLoading(false)
    }
  }

  // Load permits on mount and when filters change
  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      loadPermits()
    }, 300)
    return () => clearTimeout(timer)
  }, [search, statusFilter])

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await permitService.create(formData)
      toast.success("Permit created successfully")
      setFormOpen(false)
      // Reset form
      setFormData({
        applicant_name: "",
        applicant_email: "",
        project_address: "",
        permit_type: "Building",
        status: "Submitted",
        description: "",
      })
      loadPermits()
    } catch (error) {
      toast.error("Failed to create permit", { description: String(error) })
    }
  }

  return (
    <PageContainer>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        
        <PageHeader
          overline="Applications"
          title="Permit Applications"
          subtitle="Submit, search, and manage permit records."
        />

        <Divider />

        {/* ── Toolbar ──────────────────────────────────────────────── */}
        <section style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "stretch" }}>
          <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
            <Search style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", width: "16px", height: "16px", color: "var(--text-muted)" }} />
            <Input
              type="search"
              placeholder="Search by name, address, or permit #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: "36px" }}
            />
          </div>
          
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as PermitStatus | "")}
            style={{ minWidth: "160px" }}
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Closed">Closed</option>
          </Select>

          <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogTrigger asChild>
              <Button variant="primary">
                <Plus className="w-4 h-4" />
                New Permit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleFormSubmit}>
                <DialogHeader>
                  <DialogTitle>New Permit Application</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
                    <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <Label htmlFor="applicant_name">Applicant Name *</Label>
                        <Input
                          id="applicant_name"
                          required
                          value={formData.applicant_name}
                          onChange={(e) => setFormData({ ...formData, applicant_name: e.target.value })}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <Label htmlFor="applicant_email">Applicant Email</Label>
                        <Input
                          id="applicant_email"
                          type="email"
                          value={formData.applicant_email}
                          onChange={(e) => setFormData({ ...formData, applicant_email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="project_address">Project Address *</Label>
                      <Input
                        id="project_address"
                        required
                        value={formData.project_address}
                        onChange={(e) => setFormData({ ...formData, project_address: e.target.value })}
                      />
                    </div>

                    <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <Label htmlFor="permit_type">Permit Type *</Label>
                        <Select
                          id="permit_type"
                          required
                          value={formData.permit_type}
                          onChange={(e) => setFormData({ ...formData, permit_type: e.target.value as any })}
                        >
                          <option value="Building">Building</option>
                          <option value="Electrical">Electrical</option>
                          <option value="Plumbing">Plumbing</option>
                          <option value="Mechanical">Mechanical</option>
                          <option value="Grading">Grading</option>
                          <option value="Sign">Sign</option>
                          <option value="Other">Other</option>
                        </Select>
                      </div>
                      <div style={{ flex: 1, minWidth: "200px" }}>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          id="status"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as PermitStatus })}
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Closed">Closed</option>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Description of Work *</Label>
                      <Textarea
                        id="description"
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>
                </DialogBody>
                <DialogFooter>
                  <Button variant="secondary" type="button" onClick={() => setFormOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit">
                    Submit Permit
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </section>

        {/* ── Table ────────────────────────────────────────────────── */}
        <section>
          <Card style={{ padding: 0, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-subtle)", background: "var(--bg-canvas)" }}>
                  <th style={{ padding: "var(--space-4) var(--space-6)", textAlign: "left", fontWeight: 700 }}>Permit #</th>
                  <th style={{ padding: "var(--space-4) var(--space-6)", textAlign: "left", fontWeight: 700 }}>Applicant</th>
                  <th style={{ padding: "var(--space-4) var(--space-6)", textAlign: "left", fontWeight: 700 }}>Address</th>
                  <th style={{ padding: "var(--space-4) var(--space-6)", textAlign: "left", fontWeight: 700 }}>Type</th>
                  <th style={{ padding: "var(--space-4) var(--space-6)", textAlign: "left", fontWeight: 700 }}>Status</th>
                  <th style={{ padding: "var(--space-4) var(--space-6)", textAlign: "left", fontWeight: 700 }}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "var(--space-10)", textAlign: "center", color: "var(--text-muted)" }}>
                      Loading permits...
                    </td>
                  </tr>
                ) : permits.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: "var(--space-10)", textAlign: "center", color: "var(--text-muted)" }}>
                      No permits found.
                    </td>
                  </tr>
                ) : (
                  permits.map((permit) => (
                    <tr key={permit.id} style={{ borderBottom: "1px solid var(--border-subtle)", transition: "background-color var(--duration-fast)", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--bg-inner)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td style={{ padding: "var(--space-3) var(--space-6)", fontWeight: 600, color: "var(--brand-primary)" }}>{permit.permit_number}</td>
                      <td style={{ padding: "var(--space-3) var(--space-6)" }}>{permit.applicant_name}</td>
                      <td style={{ padding: "var(--space-3) var(--space-6)", color: "var(--text-muted)" }}>{permit.project_address}</td>
                      <td style={{ padding: "var(--space-3) var(--space-6)" }}>{permit.permit_type}</td>
                      <td style={{ padding: "var(--space-3) var(--space-6)" }}>
                        <StatusBadge status={permit.status} />
                      </td>
                      <td style={{ padding: "var(--space-3) var(--space-6)", color: "var(--text-muted)" }}>
                        {new Date(permit.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Card>
        </section>

      </div>
    </PageContainer>
  )
}
