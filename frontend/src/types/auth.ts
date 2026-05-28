/**
 * types/auth.ts
 *
 * Authentication and authorization types.
 */

import type { User } from "@/types/db"

export interface AuthSession {
  accessToken: string
  user: User
  role: string
  permissions: string[]
}

export interface AuthConfig {
  auth_enabled: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse extends AuthSession {
  access_token: string
  token_type: "bearer"
}

export interface MeResponse {
  user: User
  role: string
  permissions: string[]
}

/** Permission codenames — keep in sync with app/core/permissions.py */
export const PERMISSIONS = {
  SETTINGS_ACCESS: "settings.access",
  USERS_MANAGE: "users.manage",
} as const

export type PermissionCodename = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
