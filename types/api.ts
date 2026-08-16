// Shared API types for the Government Complaints Management System

export type UserRole = "citizen" | "employee" | "admin";
export interface User {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  national_id?: string | null;
  role: UserRole;
  department?: { id: string | number; name: string; code: string } | null;
  is_active?: boolean;
  phone_verified_at?: string | null;
  last_login_at?: string | null;
  [key: string]: unknown;
}

export interface Employee {
  id: string | number;
  name: string;
  email: string;
  phone?: string | null;
  national_id?: string | null;
  role: "employee";
  department?: { id: string | number; name: string; code: string } | null;
  is_active: boolean;
  phone_verified_at?: string | null;
  last_login_at?: string | null;
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

// Employee/Admin complaint types, matching the confirmed collection.
export type ComplaintStatus =
  | "submitted"
  | "under_review"
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
  department?: Department | null;
  category?: Category | null;
  priority?: Priority | null;
  citizen?: User | null;
  assigned_employee?: User | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface ClassificationRule {
  id: string | number;
  department_id: string | number;
  category_id: string | number;
  department?: Department;
  category?: Category;
  keyword: string;
  weight: number;
  is_active: boolean;
  language?: string;
  notes?: string | null;
}

export interface ClassificationPreviewResult {
  suggested_department?: Department | null;
  suggested_category?: Category | null;
  scores?: Array<{
    category_id: string | number;
    category_name?: string;
    score: number;
  }>;
  [key: string]: unknown;
}

export interface NotificationDeliveryLog {
  id: string | number;
  channel?: string;
  status?: string;
  recipient?: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface ReportOverview {
  total_complaints?: number;
  open_complaints?: number;
  resolved_complaints?: number;
  overdue_complaints?: number;
  [key: string]: unknown;
}
