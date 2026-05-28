/**
 * hooks/useAuth.tsx
 *
 * Authentication context — session state, login/logout, permission checks.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { authService } from "@/services/authService"
import type { AuthSession, LoginCredentials } from "@/types/auth"

interface AuthContextValue {
  authEnabled: boolean
  session: AuthSession | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  hasPermission: (permission: string) => boolean
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authEnabled, setAuthEnabled] = useState(true)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSession = useCallback(async () => {
    if (!authEnabled) {
      setSession(null)
      return
    }
    try {
      const me = await authService.me()
      const stored = authService.loadStoredSession()
      if (stored) {
        setSession({
          ...stored,
          user: me.user,
          role: me.role,
          permissions: me.permissions,
        })
        authService.saveSession({
          ...stored,
          user: me.user,
          role: me.role,
          permissions: me.permissions,
        })
      }
    } catch {
      authService.logout()
      setSession(null)
    }
  }, [authEnabled])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        const config = await authService.getConfig()
        if (cancelled) return
        setAuthEnabled(config.auth_enabled)

        if (!config.auth_enabled) {
          setSession(null)
          return
        }

        const restored = authService.restoreSession()
        if (restored) {
          setSession(restored)
          await refreshSession()
        }
      } catch {
        if (!cancelled) {
          setAuthEnabled(true)
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [refreshSession])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const newSession = await authService.login(credentials)
    setSession(newSession)
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setSession(null)
  }, [])

  const hasPermission = useCallback(
    (permission: string) => {
      if (!authEnabled) return true
      return authService.hasPermission(session, permission)
    },
    [authEnabled, session],
  )

  const value = useMemo(
    () => ({
      authEnabled,
      session,
      isLoading,
      login,
      logout,
      hasPermission,
      refreshSession,
    }),
    [authEnabled, session, isLoading, login, logout, hasPermission, refreshSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}
