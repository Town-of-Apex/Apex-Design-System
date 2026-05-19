/**
 * services/permitService.ts
 *
 * All API calls related to the Permit domain.
 *
 * HOW TO USE:
 *   import { permitService } from "@/services/permitService"
 *
 *   // In a component or hook:
 *   const permits = await permitService.getAll({ status: "Approved" })
 *   await permitService.create({ applicant_name: "...", ... })
 *   await permitService.update(5, { status: "Closed" })
 *   await permitService.remove(5)
 */

import { get, post, put, del } from "@/services/api"
import type { Permit, PermitFormData, PermitFilters } from "@/types/permit"

export const permitService = {
  /**
   * Fetch all permits, optionally filtered by search string and/or status.
   */
  async getAll(filters?: PermitFilters): Promise<Permit[]> {
    const params = new URLSearchParams()
    if (filters?.search) params.set("search", filters.search)
    if (filters?.status) params.set("status", filters.status)

    const query = params.toString()
    const path = query ? `/api/permits?${query}` : "/api/permits"
    return get<Permit[]>(path)
  },

  /**
   * Fetch a single permit by its numeric ID.
   */
  async getById(id: number): Promise<Permit> {
    return get<Permit>(`/api/permits/${id}`)
  },

  /**
   * Create a new permit. Returns the created permit record.
   */
  async create(data: PermitFormData): Promise<Permit> {
    return post<Permit>("/api/permits", data)
  },

  /**
   * Update an existing permit by ID. Returns the updated record.
   */
  async update(id: number, data: Partial<PermitFormData>): Promise<Permit> {
    return put<Permit>(`/api/permits/${id}`, data)
  },

  /**
   * Delete a permit by ID.
   */
  async remove(id: number): Promise<void> {
    return del<void>(`/api/permits/${id}`)
  },
}
