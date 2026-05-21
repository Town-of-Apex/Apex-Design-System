/**
 * services/dbService.ts
 *
 * Client API calls for database status and user management.
 */

import { get, post, del } from "@/services/api"
import type { DbStatus, User, UserFormData } from "@/types/db"

export const dbService = {
  /**
   * Fetch database connection status, active tables, and diagnostic metrics.
   */
  async getStatus(): Promise<DbStatus> {
    return get<DbStatus>("/api/db-status")
  },

  /**
   * Fetch list of registered template users.
   */
  async getUsers(): Promise<User[]> {
    return get<User[]>("/api/users")
  },

  /**
   * Create a new template user.
   */
  async createUser(data: UserFormData): Promise<User> {
    return post<User>("/api/users", data)
  },

  /**
   * Delete a user by ID.
   */
  async deleteUser(id: number): Promise<void> {
    return del<void>(`/api/users/${id}`)
  },
}
