/**
 * components/auth/ProtectedRoute.tsx
 *
 * Route guard that requires authentication and optionally a permission codename.
 */
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import type { PermissionCodename } from "@/types/auth"

interface ProtectedRouteProps {
  children: React.ReactNode
  permission?: PermissionCodename
}

export function ProtectedRoute({ children, permission }: ProtectedRouteProps) {
  const { authEnabled, session, isLoading, hasPermission } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div style={{ padding: "var(--space-8)", color: "var(--text-muted)" }}>
        Loading…
      </div>
    )
  }

  if (!authEnabled) {
    return <>{children}</>
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
