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
export interface PaginationMeta {
  current_page: number;
  from: number | null;
  last_page: number;
  per_page: number;
  to: number | null;
  total: number;
}

export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
  meta?: PaginationMeta;
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
  | "waiting_citizen"
  | "resolved"
  | "closed"
  | "rejected"
  | "escalated";

// export interface Complaint {
//   id: string | number;
//   title: string;
//   description: string;
//   status: ComplaintStatus;
//   department?: Department | null;
//   category?: Category | null;
//   priority?: Priority | null;
//   citizen?: User | null;
//   assigned_employee?: User | null;
//   created_at: string;
//   updated_at: string;
//   [key: string]: unknown;
// }

export interface Complaint {
  id: string | number;
  complaint_number?: string;
  title: string;
  description: string;
  status: ComplaintStatus;
  department_id?: number;
  department?: Department | null;
  category_id?: number;
  category?: Category | null;
  priority_id?: number;
  priority?: Priority | null;
  latitude?: string;
  longitude?: string;
  address?: string;
  location?: {
    lat: string;
    lng: string;
    address: string;
  };
  source?: string;
  client_uuid?: string | null;
  client_ref?: string | null;
  classification_confidence?: number;
  classification?: {
    auto_assigned: boolean;
    confidence: number;
    method: string;
  };
  due_at?: string;
  sla_due_at?: string;
  first_response_at?: string | null;
  resolved_at?: string | null;
  closed_at?: string | null;
  is_sla_breached?: boolean;
  citizen?: User | null;
  assigned_employee_id?: number;
  assigned_employee?: User | null;
  attachments?: Attachment[];
  timeline?: TimelineEvent[];
  status_histories?: StatusHistory[];
  assignments?: Assignment[];
  active_information_request?: ComplaintInformationRequest | null;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}
export interface StatusHistory {
  id: number;
  from_status?: string | null;
  to_status?: string;
  note?: string;
  duration_minutes?: number | null;
  changed_by?: string;
  created_at: string;
}

export interface Assignment {
  id: number;
  assigned_by: {
    id: number;
    name: string;
    role?: string;
  };
  assigned_to: {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    role?: string;
  };
  department?: {
    id: number;
    name: string;
    code?: string;
  };
  note?: string;
  assigned_at: string;
  created_at: string;
}

// "Request additional information" lives on the complaint status lifecycle
// (see ComplaintInformationRequestResource on the backend).
export interface ComplaintInformationRequest {
  id: string | number;
  message: string;
  status: "pending" | "responded" | "completed";
  requested_at?: string | null;
  responded_at?: string | null;
  response_message?: string | null;
  requested_by?: {
    id: string | number;
    name: string;
  } | null;
}

export interface Attachment {
  id?: number;
  original_name?: string | null;
  file_name?: string | null;
  file_path?: string | null;
  url?: string | null;
  mime_type?: string | null;
  file_size?: number | null;
  disk?: string | null;
  uploaded_by?: string | null;
  created_at?: string | null;
}

export interface TimelineEvent {
  id: number;
  from_status?: string | null;
  to_status?: string;
  note?: string;
  duration_minutes?: number | null;
  changed_by?: string;
  created_at: string;
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
