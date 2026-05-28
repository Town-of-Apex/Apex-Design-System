/**
 * services/authService.ts
 *
 * Authentication API client and local session storage.
 */
import { get, post } from "@/services/api"
import { setAuthToken, clearAuthToken } from "@/services/api"
import type {
  AuthConfig,
  AuthSession,
  LoginCredentials,
  LoginResponse,
  MeResponse,
} from "@/types/auth"
import type { User } from "@/types/db"

const SESSION_KEY = "apex_auth_session"

function toSession(response: LoginResponse): AuthSession {
  return {
    accessToken: response.access_token,
    user: response.user,
    role: response.role,
    permissions: response.permissions,
  }
}

export function loadStoredSession(): AuthSession | null {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    localStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function saveSession(session: AuthSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  setAuthToken(session.accessToken)
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
  clearAuthToken()
}

export const authService = {
  async getConfig(): Promise<AuthConfig> {
    return get<AuthConfig>("/api/auth/config")
  },

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await post<LoginResponse>("/api/auth/login", credentials)
    const session = toSession(response)
    saveSession(session)
    return session
  },

  logout(): void {
    clearSession()
  },

  async me(): Promise<MeResponse> {
    return get<MeResponse>("/api/auth/me")
  },

  hasPermission(session: AuthSession | null, permission: string): boolean {
    if (!session) return false
    return session.permissions.includes(permission)
  },

  restoreSession(): AuthSession | null {
    const session = loadStoredSession()
    if (session) {
      setAuthToken(session.accessToken)
    }
    return session
  },
}

export type { User }
