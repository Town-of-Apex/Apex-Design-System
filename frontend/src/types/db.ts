/**
 * types/db.ts
 *
 * Types for database connection status, metrics, and template users.
 */

export interface DbDetails {
  version?: string;
  active_connections?: number;
  database_size?: string;
  dialect?: string;
}

export interface DbStatus {
  connected: boolean;
  engine: string;
  url: string;
  fallback_active: boolean;
  error: string | null;
  warning?: string;
  tables?: string[];
  details?: DbDetails;
  meta_error?: string;
}

export interface User {
  id: number;
  username: string;
  full_name: string;
  email: string | null;
  role: string;
  department: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserFormData {
  username: string;
  full_name: string;
  password?: string;
  email?: string;
  role?: string;
  department?: string;
}
