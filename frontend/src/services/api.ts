/**
 * services/api.ts
 *
 * Base HTTP client for all API calls.
 *
 * WHY THIS EXISTS:
 * Centralizing fetch logic here means every component gets the same error
 * handling, base URL, and headers automatically. You never write raw fetch()
 * calls inside a component.
 *
 * HOW TO USE:
 *   import { get, post, put, del } from "@/services/api"
 *   const permits = await get<Permit[]>("/api/permits")
 */

import type { ApiResponse } from "@/types/api"

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/**
 * The base URL prefix for all API requests (e.g. "/demo" or "").
 * In development, Vite proxies [base_path]/api → http://apex-backend:8080
 */
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "")

// ---------------------------------------------------------------------------
// Core fetch wrapper
// ---------------------------------------------------------------------------

/**
 * Internal helper that wraps fetch with standard error handling.
 * Returns the parsed JSON body or throws an Error with a readable message.
 */
async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  }

  if (body !== undefined) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`${BASE_PATH}${path}`, options)

  // The server may return a non-OK status with a JSON error body
  const json = (await response.json()) as ApiResponse<T>

  if (!response.ok || !json.success) {
    const errorJson = json as Extract<ApiResponse<T>, { success: false }>
    throw new Error(errorJson.error?.message ?? `HTTP ${response.status}`)
  }

  return (json as Extract<ApiResponse<T>, { success: true }>).data
}

// ---------------------------------------------------------------------------
// Public methods
// ---------------------------------------------------------------------------

/** HTTP GET — fetches data from the given path */
export function get<T>(path: string): Promise<T> {
  return request<T>("GET", path)
}

/** HTTP POST — creates a new resource */
export function post<T>(path: string, body: unknown): Promise<T> {
  return request<T>("POST", path, body)
}

/** HTTP PUT — replaces an existing resource */
export function put<T>(path: string, body: unknown): Promise<T> {
  return request<T>("PUT", path, body)
}

/** HTTP DELETE — removes a resource */
export function del<T>(path: string): Promise<T> {
  return request<T>("DELETE", path)
}
