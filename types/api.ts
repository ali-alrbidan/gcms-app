// Shared API types for the Government Complaints Management System

export type UserRole = "citizen" | "employee" | "admin";

export interface User {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  [key: string]: unknown;
}

export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
  meta?: {
    total?: number;
    per_page?: number;
    current_page?: number;
    last_page?: number;
    [key: string]: unknown;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface LoginStartResponse {
  user_id: string | number;
  requires_otp: boolean;
  otp?: string; // only present when APP_ENV=local
}

export interface VerifyOtpResponse {
  token_type: "Bearer";
  token: string;
  user: User;
}

export interface Department {
  id: string | number;
  name: string;
  code: string;
  description?: string | null;
  is_active: boolean;
}

export interface Category {
  id: string | number;
  department_id: string | number;
  department?: Department;
  name: string;
  code: string;
  description?: string | null;
  keywords?: string[];
  is_active: boolean;
}

export interface Priority {
  id: string | number;
  name: string;
  code: string;
  level: number;
  color?: string;
  description?: string | null;
}

export interface SlaRule {
  id: string | number;
  department_id?: string | number | null;
  category_id?: string | number | null;
  priority_id: string | number;
  department?: Department | null;
  category?: Category | null;
  priority?: Priority;
  response_time_hours: number;
  resolution_time_hours: number;
  is_active: boolean;
}

// Employee-side complaint types are best-guess placeholders until the
// real endpoints/shape are confirmed. Marked clearly so they're easy to
// find and adjust in lib/api.ts + app/employee/*.
export type ComplaintStatus =
  | "submitted"
  | "in_review"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "closed"
  | "rejected";

export interface Complaint {
  id: string | number;
  reference_no?: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  department?: Department;
  category?: Category;
  priority?: Priority;
  citizen?: User;
  assigned_to?: User | null;
  created_at: string;
  updated_at: string;
}
