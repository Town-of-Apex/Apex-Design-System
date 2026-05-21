/**
 * types/permit.ts
 *
 * TypeScript interfaces for the Permit domain.
 * These match the shape of data returned by the FastAPI backend.
 */

export type PermitStatus =
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Closed"

export type PermitType =
  | "Building"
  | "Electrical"
  | "Plumbing"
  | "Mechanical"
  | "Grading"
  | "Sign"
  | "Other"

/** A permit record as returned by GET /api/permits */
export interface Permit {
  id: number
  permit_number: string
  applicant_name: string
  applicant_email: string | null
  project_address: string
  permit_type: PermitType
  status: PermitStatus
  description: string
  created_at: string // ISO date string
  updated_at: string   // ISO date string
}

/** Body sent when creating or updating a permit */
export interface PermitFormData {
  applicant_name: string
  applicant_email: string
  project_address: string
  permit_type: PermitType
  status: PermitStatus
  description: string
}

/** Query parameters for filtering the permit list */
export interface PermitFilters {
  search?: string
  status?: PermitStatus | ""
}
