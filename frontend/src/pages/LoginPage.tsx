/**
 * pages/LoginPage.tsx
 *
 * Dev-mode login form. Will be replaced or supplemented by Microsoft Entra SSO.
 */
import { FormEvent, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { PageContainer } from "@/components/layout/PageContainer"
import { PageHeader } from "@/components/shared/PageHeader"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Button } from "@/components/ui/Button"
import { useAuth } from "@/hooks/useAuth"

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, authEnabled } = useAuth()

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: string } | null)?.from ?? "/"

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password) {
      toast.error("Enter username and password")
      return
    }

    try {
      setSubmitting(true)
      await login({ username: username.trim(), password })
      toast.success("Signed in")
      navigate(from, { replace: true })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Login failed"
      toast.error("Sign in failed", { description: message })
    } finally {
      setSubmitting(false)
    }
  }

  if (!authEnabled) {
    navigate("/", { replace: true })
    return null
  }

  return (
    <PageContainer>
      <div style={{ maxWidth: "420px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
        <PageHeader
          overline="Authentication"
          title="Sign In"
          subtitle="Dev-mode login. Default admin: admin / admin123"
        />

        <Card style={{ padding: "var(--space-6)" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </Card>
      </div>
    </PageContainer>
  )
}
