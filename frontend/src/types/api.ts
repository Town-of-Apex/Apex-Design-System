/**
 * types/api.ts
 *
 * Generic API response wrapper types.
 * The FastAPI backend wraps all responses in {success, data} or {success, error}.
 */

/** Successful API response */
export interface ApiSuccess<T> {
  success: true
  data: T
}

/** Failed API response */
export interface ApiError {
  success: false
  error: {
    code: string
    message: string
  }
}

/** Union type for any API response */
export type ApiResponse<T> = ApiSuccess<T> | ApiError

/** Standard paginated list response */
export interface PaginatedList<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}
