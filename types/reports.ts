import type { ComplaintStatus } from "@/types/api";

export interface ReportFilters {
  date_from?: string;
  date_to?: string;
  department_id?: string | number;
  category_id?: string | number;
  priority_id?: string | number;
  assigned_employee_id?: string | number;
  citizen_id?: string | number;
  status?: ComplaintStatus;
  is_sla_breached?: boolean;
  group_by?: "day" | "week" | "month";
  per_page?: number;
  page?: number;
}

export interface ReportOverview {
  total_complaints: number;
  open_complaints: number;
  resolved_complaints: number;
  closed_complaints: number;
  rejected_complaints: number;
  escalated_complaints: number;
  sla_breached_complaints: number;
  sla_breach_rate: number;
  average_first_response_minutes: number | null;
  average_resolution_minutes: number | null;
  new_complaints_today: number;
  new_complaints_this_week: number;
  new_complaints_this_month: number;
  [key: string]: unknown;
}

export interface ComplaintStatusMetric {
  status: ComplaintStatus;
  count: number;
  percentage: number;
}

export interface ReportDepartment {
  id: string | number;
  name: string;
  code: string;
}

export interface DepartmentReportMetric {
  department: ReportDepartment;
  total: number;
  open: number;
  resolved: number;
  closed: number;
  sla_breached: number;
  sla_breach_rate: number;
  average_resolution_minutes: number | null;
}

export interface ReportPriority {
  id: string | number;
  name: string;
  code: string;
  level: number;
}

export interface PriorityReportMetric {
  priority: ReportPriority;
  total: number;
  open: number;
  resolved: number;
  sla_breached: number;
  sla_breach_rate: number;
}

export interface SlaPerformanceReport {
  total_with_sla: number;
  within_sla: number;
  breached: number;
  breach_rate: number;
  average_delay_minutes_for_breached: number | null;
  by_department: Array<{ department: ReportDepartment; total_with_sla: number; breached: number; breach_rate: number }>;
  by_priority: Array<{ priority: ReportPriority; total_with_sla: number; breached: number; breach_rate: number }>;
}

export interface EmployeePerformanceMetric {
  employee: { id: string | number; name: string; email: string };
  department: { id: string | number; name: string } | null;
  assigned_total: number;
  in_progress: number;
  resolved: number;
  closed: number;
  sla_breached: number;
  average_first_response_minutes: number | null;
  average_resolution_minutes: number | null;
  resolution_rate: number;
  sla_success_rate: number;
}

export interface ComplaintTrendMetric {
  period: string;
  created: number;
  resolved: number;
  closed: number;
  sla_breached: number;
}

export interface SlaBreachComplaint {
  id: string | number;
  complaint_number: string;
  title: string;
  status: ComplaintStatus;
  department: ReportDepartment | null;
  priority: ReportPriority | null;
  assigned_employee: { id: string | number; name: string; email: string } | null;
  due_at: string | null;
  created_at: string | null;
  delay_minutes: number | null;
}

export interface SlaBreachesResponse {
  complaints: SlaBreachComplaint[];
}
