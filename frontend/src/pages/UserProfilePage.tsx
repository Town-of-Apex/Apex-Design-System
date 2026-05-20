import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/shared/PageHeader"
import { Divider } from "@/components/shared/Divider"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"

export function UserProfilePage() {
  return (
    <PageContainer>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        
        <PageHeader
          overline="Account Information"
          title="User Profile"
          subtitle="Manage your personal information and security settings."
        />

        <Divider />

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-10)", maxWidth: "800px" }}>
          <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <h3 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.125rem", color: "var(--text-main)", margin: 0 }}>
              Profile Details
            </h3>
            
            <Card style={{ padding: "var(--space-6)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Name</p>
                  <p style={{ color: "var(--text-muted)", margin: "var(--space-1) 0 0" }}>Town Employee</p>
                </div>
                <Divider />
                <div>
                  <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Email</p>
                  <p style={{ color: "var(--text-muted)", margin: "var(--space-1) 0 0" }}>employee@apexnc.org</p>
                </div>
                <Divider />
                <div>
                  <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Department</p>
                  <p style={{ color: "var(--text-muted)", margin: "var(--space-1) 0 0" }}>Information Technology</p>
                </div>
              </div>
            </Card>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <h3 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.125rem", color: "var(--text-main)", margin: 0 }}>
              Authentication
            </h3>
            
            <Card style={{ padding: "var(--space-6)" }}>
              <p style={{ color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>
                Active Directory authentication integration will be configured here.
              </p>
              <Button variant="secondary" disabled>Link AD Account</Button>
            </Card>
          </section>
        </div>
      </div>
    </PageContainer>
  )
}
