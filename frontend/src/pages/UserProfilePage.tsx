import { useNavigate } from "react-router-dom"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/shared/PageHeader"
import { Divider } from "@/components/shared/Divider"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { useAuth } from "@/hooks/useAuth"

export function UserProfilePage() {
  const navigate = useNavigate()
  const { session, authEnabled, logout } = useAuth()

  return (
    <PageContainer>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        
        <PageHeader
          overline="Account Information"
          title="User Profile"
          subtitle="Your signed-in account and app role."
        />

        <Divider />

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "var(--space-10)", maxWidth: "800px" }}>
          <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <h3 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.125rem", color: "var(--text-main)", margin: 0 }}>
              Profile Details
            </h3>
            
            <Card style={{ padding: "var(--space-6)" }}>
              {session ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Name</p>
                    <p style={{ color: "var(--text-muted)", margin: "var(--space-1) 0 0" }}>{session.user.full_name}</p>
                  </div>
                  <Divider />
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Username</p>
                    <p style={{ color: "var(--text-muted)", margin: "var(--space-1) 0 0" }}>{session.user.username}</p>
                  </div>
                  <Divider />
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Email</p>
                    <p style={{ color: "var(--text-muted)", margin: "var(--space-1) 0 0" }}>{session.user.email ?? "—"}</p>
                  </div>
                  <Divider />
                  <div>
                    <p style={{ fontWeight: 600, color: "var(--text-main)", margin: 0 }}>App Role</p>
                    <div style={{ marginTop: "var(--space-2)" }}>
                      <Badge variant={session.role === "admin" ? "success" : "default"}>
                        {session.role}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <p style={{ color: "var(--text-muted)", margin: 0 }}>
                  {authEnabled
                    ? "You are not signed in."
                    : "Authentication is disabled for this application."}
                </p>
              )}
            </Card>
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <h3 style={{ fontFamily: "var(--font-ui)", fontWeight: 800, fontSize: "1.125rem", color: "var(--text-main)", margin: 0 }}>
              Authentication
            </h3>
            
            <Card style={{ padding: "var(--space-6)" }}>
              <p style={{ color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>
                Microsoft Entra SSO will replace dev-mode username/password login in production.
              </p>
              {authEnabled && !session && (
                <Button variant="secondary" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
              )}
              {authEnabled && session && (
                <Button variant="secondary" onClick={logout}>
                  Sign Out
                </Button>
              )}
            </Card>
          </section>
        </div>
      </div>
    </PageContainer>
  )
}
