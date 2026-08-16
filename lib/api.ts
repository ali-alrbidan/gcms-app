// import type {
//   ApiResponse,
//   Category,
//   ClassificationPreviewResult,
//   ClassificationRule,
//   Complaint,
//   ComplaintStatus,
//   Department,
//   LoginStartResponse,
//   NotificationDeliveryLog,
//   Priority,
//   ReportOverview,
//   SlaRule,
//   User,
//   VerifyOtpResponse,
// } from "@/types/api";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

// const TOKEN_KEY = "gcms_token";

// export function getToken(): string | null {
//   if (typeof window === "undefined") return null;
//   return window.localStorage.getItem(TOKEN_KEY);
// }

// export function setToken(token: string) {
//   window.localStorage.setItem(TOKEN_KEY, token);
// }

// export function clearToken() {
//   window.localStorage.removeItem(TOKEN_KEY);
// }

// export class ApiRequestError extends Error {
//   status: number;
//   errors?: Record<string, string[]>;

//   constructor(message: string, status: number, errors?: Record<string, string[]>) {
//     super(message);
//     this.name = "ApiRequestError";
//     this.status = status;
//     this.errors = errors;
//   }
// }

// interface RequestOptions extends RequestInit {
//   auth?: boolean; // attach Bearer token, default true
// }

// async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
//   const { auth = true, headers, ...rest } = options;

//   const finalHeaders: Record<string, string> = {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//     ...(headers as Record<string, string>),
//   };

//   if (auth) {
//     const token = getToken();
//     if (token) finalHeaders.Authorization = `Bearer ${token}`;
//   }

//   const res = await fetch(`${BASE_URL}${path}`, {
//     ...rest,
//     headers: finalHeaders,
//   });

//   let json: ApiResponse<T> | undefined;
//   try {
//     json = await res.json();
//   } catch {
//     // no JSON body
//   }

//   if (!res.ok || !json || json.success === false) {
//     const message =
//       (json && "message" in json && json.message) || `Request failed (${res.status})`;
//     const errors = json && "errors" in json ? json.errors : undefined;
//     throw new ApiRequestError(message, res.status, errors);
//   }

//   return (json as { data: T }).data;
// }

// // ---------- Auth ----------

// export const authApi = {
//   register: (payload: {
//     name: string;
//     email: string;
//     phone: string;
//     password: string;
//     password_confirmation: string;
//   }) =>
//     request<LoginStartResponse>("/auth/register", {
//       method: "POST",
//       body: JSON.stringify(payload),
//       auth: false,
//     }),

//   login: (payload: { login: string; password: string }) =>
//     request<LoginStartResponse>("/auth/login", {
//       method: "POST",
//       body: JSON.stringify(payload),
//       auth: false,
//     }),

//   verifyOtp: (payload: {
//     user_id: string | number;
//     otp: string;
//     purpose: "register" | "login";
//     device_name?: string;
//   }) =>
//     request<VerifyOtpResponse>("/auth/verify-otp", {
//       method: "POST",
//       body: JSON.stringify(payload),
//       auth: false,
//     }),

//   me: () => request<{ user: User }>("/auth/me", { method: "GET" }),

//   logout: () => request<null>("/auth/logout", { method: "POST" }),

//   logoutAll: () => request<null>("/auth/logout-all", { method: "POST" }),

//   changePassword: (payload: {
//     current_password: string;
//     password: string;
//     password_confirmation: string;
//   }) =>
//     request<null>("/auth/change-password", {
//       method: "POST",
//       body: JSON.stringify(payload),
//     }),
// };

// // ---------- Role ping checks ----------

// export const roleApi = {
//   adminPing: () => request<{ role: string }>("/admin/ping", { method: "GET" }),
//   employeePing: () => request<{ role: string }>("/employee/ping", { method: "GET" }),
//   citizenPing: () => request<{ role: string }>("/citizen/ping", { method: "GET" }),
// };

// // ---------- Public lookups ----------

// export const lookupsApi = {
//   departments: () =>
//     request<{ departments: Department[] }>("/lookups/departments", {
//       method: "GET",
//       auth: false,
//     }),
//   categories: (departmentId?: string | number) =>
//     request<{ categories: Category[] }>(
//       `/lookups/categories${departmentId ? `?department_id=${departmentId}` : ""}`,
//       { method: "GET", auth: false }
//     ),
//   priorities: () =>
//     request<{ priorities: Priority[] }>("/lookups/priorities", {
//       method: "GET",
//       auth: false,
//     }),
//   complaintStatuses: () =>
//     request<{ statuses: string[] }>("/lookups/complaint-statuses", {
//       method: "GET",
//       auth: false,
//     }),
// };

// // ---------- Admin: Departments ----------

// export const adminDepartmentsApi = {
//   list: (params: { per_page?: number; page?: number } = {}) => {
//     const qs = new URLSearchParams(params as Record<string, string>).toString();
//     return request<{ departments: Department[] }>(`/admin/departments${qs ? `?${qs}` : ""}`, {
//       method: "GET",
//     });
//   },
//   create: (payload: Partial<Department>) =>
//     request<{ department: Department }>("/admin/departments", {
//       method: "POST",
//       body: JSON.stringify(payload),
//     }),
//   show: (id: string | number) =>
//     request<{ department: Department }>(`/admin/departments/${id}`, { method: "GET" }),
//   update: (id: string | number, payload: Partial<Department>) =>
//     request<{ department: Department }>(`/admin/departments/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(payload),
//     }),
//   remove: (id: string | number) =>
//     request<null>(`/admin/departments/${id}`, { method: "DELETE" }),
// };

// // ---------- Admin: Categories ----------

// export const adminCategoriesApi = {
//   list: (params: { per_page?: number; page?: number } = {}) => {
//     const qs = new URLSearchParams(params as Record<string, string>).toString();
//     return request<{ categories: Category[] }>(`/admin/categories${qs ? `?${qs}` : ""}`, {
//       method: "GET",
//     });
//   },
//   create: (payload: Partial<Category>) =>
//     request<{ category: Category }>("/admin/categories", {
//       method: "POST",
//       body: JSON.stringify(payload),
//     }),
//   show: (id: string | number) =>
//     request<{ category: Category }>(`/admin/categories/${id}`, { method: "GET" }),
//   update: (id: string | number, payload: Partial<Category>) =>
//     request<{ category: Category }>(`/admin/categories/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(payload),
//     }),
//   remove: (id: string | number) =>
//     request<null>(`/admin/categories/${id}`, { method: "DELETE" }),
// };

// // ---------- Admin: Priorities ----------

// export const adminPrioritiesApi = {
//   list: (params: { per_page?: number; page?: number } = {}) => {
//     const qs = new URLSearchParams(params as Record<string, string>).toString();
//     return request<{ priorities: Priority[] }>(`/admin/priorities${qs ? `?${qs}` : ""}`, {
//       method: "GET",
//     });
//   },
//   create: (payload: Partial<Priority>) =>
//     request<{ priority: Priority }>("/admin/priorities", {
//       method: "POST",
//       body: JSON.stringify(payload),
//     }),
//   show: (id: string | number) =>
//     request<{ priority: Priority }>(`/admin/priorities/${id}`, { method: "GET" }),
//   update: (id: string | number, payload: Partial<Priority>) =>
//     request<{ priority: Priority }>(`/admin/priorities/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(payload),
//     }),
//   remove: (id: string | number) =>
//     request<null>(`/admin/priorities/${id}`, { method: "DELETE" }),
// };

// // ---------- Admin: SLA Rules ----------

// export const adminSlaRulesApi = {
//   list: (params: { per_page?: number; page?: number } = {}) => {
//     const qs = new URLSearchParams(params as Record<string, string>).toString();
//     return request<{ sla_rules: SlaRule[] }>(`/admin/sla-rules${qs ? `?${qs}` : ""}`, {
//       method: "GET",
//     });
//   },
//   create: (payload: Partial<SlaRule>) =>
//     request<{ sla_rule: SlaRule }>("/admin/sla-rules", {
//       method: "POST",
//       body: JSON.stringify(payload),
//     }),
//   show: (id: string | number) =>
//     request<{ sla_rule: SlaRule }>(`/admin/sla-rules/${id}`, { method: "GET" }),
//   update: (id: string | number, payload: Partial<SlaRule>) =>
//     request<{ sla_rule: SlaRule }>(`/admin/sla-rules/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(payload),
//     }),
//   remove: (id: string | number) =>
//     request<null>(`/admin/sla-rules/${id}`, { method: "DELETE" }),
// };

// // ---------- Employee: Complaints ----------

// export const employeeComplaintsApi = {
//   list: (params: { per_page?: number; page?: number; status?: string } = {}) => {
//     const qs = new URLSearchParams(params as Record<string, string>).toString();
//     return request<{ complaints: Complaint[] }>(`/employee/complaints${qs ? `?${qs}` : ""}`, {
//       method: "GET",
//     });
//   },
//   show: (id: string | number) =>
//     request<{ complaint: Complaint }>(`/employee/complaints/${id}`, { method: "GET" }),
//   updateStatus: (id: string | number, payload: { status: ComplaintStatus; note?: string }) =>
//     request<{ complaint: Complaint }>(`/employee/complaints/${id}/status`, {
//       method: "PATCH",
//       body: JSON.stringify(payload),
//     }),
// };

// // ---------- Admin: Complaints ----------

// export const adminComplaintsApi = {
//   list: (params: { per_page?: number; page?: number; status?: string } = {}) => {
//     const qs = new URLSearchParams(params as Record<string, string>).toString();
//     return request<{ complaints: Complaint[] }>(`/admin/complaints${qs ? `?${qs}` : ""}`, {
//       method: "GET",
//     });
//   },
//   show: (id: string | number) =>
//     request<{ complaint: Complaint }>(`/admin/complaints/${id}`, { method: "GET" }),
//   assign: (id: string | number, payload: { employee_id: string | number; note?: string }) =>
//     request<{ complaint: Complaint }>(`/admin/complaints/${id}/assign`, {
//       method: "PATCH",
//       body: JSON.stringify(payload),
//     }),
//   changeDepartment: (
//     id: string | number,
//     payload: { department_id: string | number; category_id?: string | number; note?: string }
//   ) =>
//     request<{ complaint: Complaint }>(`/admin/complaints/${id}/department`, {
//       method: "PATCH",
//       body: JSON.stringify(payload),
//     }),
//   changePriority: (id: string | number, payload: { priority_id: string | number; note?: string }) =>
//     request<{ complaint: Complaint }>(`/admin/complaints/${id}/priority`, {
//       method: "PATCH",
//       body: JSON.stringify(payload),
//     }),
//   updateStatus: (id: string | number, payload: { status: ComplaintStatus; note?: string }) =>
//     request<{ complaint: Complaint }>(`/admin/complaints/${id}/status`, {
//       method: "PATCH",
//       body: JSON.stringify(payload),
//     }),
// };

// // ---------- Admin: Reports ----------

// export const reportsApi = {
//   overview: () => request<ReportOverview>("/admin/reports/overview", { method: "GET" }),
//   complaintsByStatus: () =>
//     request<Record<string, number> | unknown[]>("/admin/reports/complaints-by-status", {
//       method: "GET",
//     }),
//   complaintsByDepartment: () =>
//     request<unknown[]>("/admin/reports/complaints-by-department", { method: "GET" }),
//   complaintsByPriority: () =>
//     request<unknown[]>("/admin/reports/complaints-by-priority", { method: "GET" }),
//   slaPerformance: () => request<unknown>("/admin/reports/sla-performance", { method: "GET" }),
//   employeePerformance: () =>
//     request<unknown[]>("/admin/reports/employee-performance", { method: "GET" }),
//   complaintTrends: (params: { date_from?: string; date_to?: string; group_by?: string } = {}) => {
//     const qs = new URLSearchParams(params as Record<string, string>).toString();
//     return request<unknown[]>(`/admin/reports/complaint-trends${qs ? `?${qs}` : ""}`, {
//       method: "GET",
//     });
//   },
//   slaBreaches: (params: { per_page?: number; page?: number } = {}) => {
//     const qs = new URLSearchParams(params as Record<string, string>).toString();
//     return request<{ data: unknown[] } | unknown[]>(`/admin/reports/sla-breaches${qs ? `?${qs}` : ""}`, {
//       method: "GET",
//     });
//   },
// };

// // ---------- Classification Management ----------

// export const classificationApi = {
//   preview: (payload: { title: string; description: string }) =>
//     request<ClassificationPreviewResult>("/classification/complaints/preview", {
//       method: "POST",
//       body: JSON.stringify(payload),
//     }),
//   listRules: (params: { per_page?: number; page?: number } = {}) => {
//     const qs = new URLSearchParams(params as Record<string, string>).toString();
//     return request<{ classification_rules: ClassificationRule[] }>(
//       `/admin/classification-rules${qs ? `?${qs}` : ""}`,
//       { method: "GET" }
//     );
//   },
//   createRule: (payload: Partial<ClassificationRule>) =>
//     request<{ classification_rule: ClassificationRule }>("/admin/classification-rules", {
//       method: "POST",
//       body: JSON.stringify(payload),
//     }),
//   showRule: (id: string | number) =>
//     request<{ classification_rule: ClassificationRule }>(`/admin/classification-rules/${id}`, {
//       method: "GET",
//     }),
//   updateRule: (id: string | number, payload: Partial<ClassificationRule>) =>
//     request<{ classification_rule: ClassificationRule }>(`/admin/classification-rules/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(payload),
//     }),
//   removeRule: (id: string | number) =>
//     request<null>(`/admin/classification-rules/${id}`, { method: "DELETE" }),
// };

// // ---------- Notification Admin ----------

// export const notificationAdminApi = {
//   listDeliveryLogs: (params: { per_page?: number; page?: number } = {}) => {
//     const qs = new URLSearchParams(params as Record<string, string>).toString();
//     return request<{ delivery_logs: NotificationDeliveryLog[] }>(
//       `/admin/notification-delivery-logs${qs ? `?${qs}` : ""}`,
//       { method: "GET" }
//     );
//   },
//   showDeliveryLog: (id: string | number) =>
//     request<{ delivery_log: NotificationDeliveryLog }>(`/admin/notification-delivery-logs/${id}`, {
//       method: "GET",
//     }),
// };

// export { ApiRequestError as ApiError };

import type { Locale } from "@/lib/i18n";
import type {
  ApiResponse,
  Category,
  ClassificationPreviewResult,
  ClassificationRule,
  Complaint,
  ComplaintStatus,
  Department,
  Employee,
  LoginStartResponse,
  NotificationDeliveryLog,
  PaginationMeta,
  Priority,
  ReportOverview,
  SlaRule,
  User,
  VerifyOtpResponse,
} from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

const TOKEN_KEY = "gcms_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}
// أضف هذه الدالة بجانب getToken/setToken
function getLocale(): Locale {
  if (typeof window === "undefined") return "ar";
  const stored = window.localStorage.getItem("gcms_locale");
  return stored === "en" ? "en" : "ar";
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiRequestError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions extends RequestInit {
  auth?: boolean; // attach Bearer token, default true
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const json = await fetchJson<T>(path, options);
  return (json as { data: T }).data;
}

async function fetchJson<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { auth = true, headers, ...rest } = options;

  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Accept-Language": getLocale(),
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
  });

  let json: ApiResponse<T> | undefined;
  try {
    json = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok || !json || json.success === false) {
    const errors = json && "errors" in json ? json.errors : undefined;
    const firstError = errors
      ? Object.values(errors)
          .flat()
          .find(Boolean)
      : undefined;
    const message =
      firstError ||
      (json && "message" in json && json.message) ||
      `Request failed (${res.status})`;
    throw new ApiRequestError(message, res.status, errors);
  }

  return json;
}

async function requestWithMeta<T>(
  path: string,
  options: RequestOptions = {},
): Promise<{ data: T; meta?: PaginationMeta }> {
  const json = await fetchJson<T>(path, options);
  const success = json as { data: T; meta?: PaginationMeta };
  return { data: success.data, meta: success.meta };
}

/**
 * Some endpoints wrap the payload under a named key (e.g. { department: {...} }),
 * others (like /admin/complaints/{id}) return the resource directly as `data`.
 * This normalizes both shapes so the rest of the app can rely on a consistent key.
 */
function unwrap<T>(raw: unknown, key: string): T {
  if (
    raw &&
    typeof raw === "object" &&
    key in (raw as Record<string, unknown>)
  ) {
    return (raw as Record<string, unknown>)[key] as T;
  }
  return raw as T;
}

function unwrapList<T>(raw: unknown, key: string): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (
    raw &&
    typeof raw === "object" &&
    key in (raw as Record<string, unknown>)
  ) {
    const val = (raw as Record<string, unknown>)[key];
    return Array.isArray(val) ? (val as T[]) : [];
  }
  return [];
}

// ---------- Auth ----------

export const authApi = {
  register: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirmation: string;
  }) =>
    request<LoginStartResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    }),

  login: (payload: { login: string; password: string }) =>
    request<LoginStartResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    }),

  verifyOtp: (payload: {
    user_id: string | number;
    otp: string;
    purpose: "register" | "verify_email" | "login";
    device_name?: string;
  }) =>
    request<VerifyOtpResponse>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    }),

  resendOtp: (payload: {
    user_id: string | number;
    purpose: "register" | "verify_email" | "login";
  }) =>
    request<{ requires_otp: boolean }>("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify(payload),
      auth: false,
    }),

  me: () => request<{ user: User }>("/auth/me", { method: "GET" }),

  logout: () => request<null>("/auth/logout", { method: "POST" }),

  logoutAll: () => request<null>("/auth/logout-all", { method: "POST" }),

  changePassword: (payload: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) =>
    request<null>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

// ---------- Role ping checks ----------

export const roleApi = {
  adminPing: () => request<{ role: string }>("/admin/ping", { method: "GET" }),
  employeePing: () =>
    request<{ role: string }>("/employee/ping", { method: "GET" }),
  citizenPing: () =>
    request<{ role: string }>("/citizen/ping", { method: "GET" }),
};

// ---------- Public lookups ----------

export const lookupsApi = {
  departments: () =>
    request<{ departments: Department[] }>("/lookups/departments", {
      method: "GET",
      auth: false,
    }),
  categories: (departmentId?: string | number) =>
    request<{ categories: Category[] }>(
      `/lookups/categories${departmentId ? `?department_id=${departmentId}` : ""}`,
      { method: "GET", auth: false },
    ),
  priorities: () =>
    request<{ priorities: Priority[] }>("/lookups/priorities", {
      method: "GET",
      auth: false,
    }),
  complaintStatuses: () =>
    request<{ statuses: string[] }>("/lookups/complaint-statuses", {
      method: "GET",
      auth: false,
    }),
};

// ---------- Admin: Departments ----------

export const adminDepartmentsApi = {
  list: (params: { per_page?: number; page?: number } = {}) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<{ departments: Department[] }>(
      `/admin/departments${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
      },
    );
  },
  create: (payload: Partial<Department>) =>
    request<{ department: Department }>("/admin/departments", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  show: (id: string | number) =>
    request<{ department: Department }>(`/admin/departments/${id}`, {
      method: "GET",
    }),
  update: (id: string | number, payload: Partial<Department>) =>
    request<{ department: Department }>(`/admin/departments/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id: string | number) =>
    request<null>(`/admin/departments/${id}`, { method: "DELETE" }),
};

// ---------- Admin: Categories ----------

export const adminCategoriesApi = {
  list: (params: { per_page?: number; page?: number } = {}) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<{ categories: Category[] }>(
      `/admin/categories${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
      },
    );
  },
  create: (payload: Partial<Category>) =>
    request<{ category: Category }>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  show: (id: string | number) =>
    request<{ category: Category }>(`/admin/categories/${id}`, {
      method: "GET",
    }),
  update: (id: string | number, payload: Partial<Category>) =>
    request<{ category: Category }>(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id: string | number) =>
    request<null>(`/admin/categories/${id}`, { method: "DELETE" }),
};

// ---------- Admin: Priorities ----------

export const adminPrioritiesApi = {
  list: (params: { per_page?: number; page?: number } = {}) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<{ priorities: Priority[] }>(
      `/admin/priorities${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
      },
    );
  },
  create: (payload: Partial<Priority>) =>
    request<{ priority: Priority }>("/admin/priorities", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  show: (id: string | number) =>
    request<{ priority: Priority }>(`/admin/priorities/${id}`, {
      method: "GET",
    }),
  update: (id: string | number, payload: Partial<Priority>) =>
    request<{ priority: Priority }>(`/admin/priorities/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id: string | number) =>
    request<null>(`/admin/priorities/${id}`, { method: "DELETE" }),
};

// ---------- Admin: SLA Rules ----------

export const adminSlaRulesApi = {
  list: (params: { per_page?: number; page?: number } = {}) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<{ sla_rules: SlaRule[] }>(
      `/admin/sla-rules${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
      },
    );
  },
  create: (payload: Partial<SlaRule>) =>
    request<{ sla_rule: SlaRule }>("/admin/sla-rules", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  show: (id: string | number) =>
    request<{ sla_rule: SlaRule }>(`/admin/sla-rules/${id}`, { method: "GET" }),
  update: (id: string | number, payload: Partial<SlaRule>) =>
    request<{ sla_rule: SlaRule }>(`/admin/sla-rules/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  remove: (id: string | number) =>
    request<null>(`/admin/sla-rules/${id}`, { method: "DELETE" }),
};

// ---------- Admin: Employees ----------

export const adminEmployeesApi = {
  list: (
    params: {
      search?: string;
      department_id?: string | number;
      is_active?: boolean;
      page?: number;
      per_page?: number;
    } = {},
  ) => {
    const query: Record<string, string> = {};
    if (params.search) query.search = params.search;
    if (params.department_id !== undefined)
      query.department_id = String(params.department_id);
    if (params.is_active !== undefined)
      query.is_active = String(params.is_active);
    if (params.page) query.page = String(params.page);
    if (params.per_page) query.per_page = String(params.per_page);
    const qs = new URLSearchParams(query).toString();
    return request<{ employees: Employee[] }>(
      `/admin/employees${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
      },
    );
  },
};

// ---------- Employee: Complaints ----------
// NOTE: /admin/complaints/{id} confirmed to return the complaint object
// directly as `data` (no "complaint" wrapper key). We apply the same
// unwrap() helper here defensively in case the employee routes match.

export const employeeComplaintsApi = {
  list: async (
    params: {
      per_page?: number;
      page?: number;
      status?: string;
      scope?: "assigned_to_me" | "my_department" | "all_accessible";
    } = {},
  ) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    const endpoint = `/employee/complaints${qs ? `?${qs}` : ""}`;
    console.log("Employee API - Fetching complaints list:", endpoint);
    try {
      const { data, meta } = await requestWithMeta<{
        complaints: Complaint[];
      }>(endpoint, {
        method: "GET",
      });
      console.log("Employee API - Complaints list response:", data, meta);
      return {
        complaints: unwrapList<Complaint>(data, "complaints"),
        meta,
      };
    } catch (error) {
      console.error("Employee API - Error fetching complaints list:", error);
      throw error;
    }
  },
  show: async (id: string | number) => {
    const endpoint = `/employee/complaints/${id}`;
    console.log("Employee API - Fetching complaint detail:", endpoint);
    try {
      const raw = await request<unknown>(endpoint, {
        method: "GET",
      });
      console.log("Employee API - Complaint detail response:", raw);
      return { complaint: unwrap<Complaint>(raw, "complaint") };
    } catch (error) {
      console.error("Employee API - Error fetching complaint detail:", error);
      throw error;
    }
  },
  updateStatus: async (
    id: string | number,
    payload: { status: ComplaintStatus; note?: string },
  ) => {
    const requestBody = {
      status: payload.status,
      note: payload.note,
    };
    const endpoint = `/employee/complaints/${id}/status`;
    console.log("Employee API - Updating complaint status:", endpoint, requestBody);
    try {
      const raw = await request<unknown>(endpoint, {
        method: "PATCH",
        body: JSON.stringify(requestBody),
      });
      console.log("Employee API - Status update response:", raw);
      return { complaint: unwrap<Complaint>(raw, "complaint") };
    } catch (error) {
      console.error("Employee API - Error updating complaint status:", error);
      throw error;
    }
  },
};

// ---------- Admin: Complaints ----------

export const adminComplaintsApi = {
  list: async (
    params: { per_page?: number; page?: number; status?: string } = {},
  ) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    const raw = await request<unknown>(
      `/admin/complaints${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
      },
    );
    return { complaints: unwrapList<Complaint>(raw, "complaints") };
  },
  show: async (id: string | number) => {
    const raw = await request<unknown>(`/admin/complaints/${id}`, {
      method: "GET",
    });
    return { complaint: unwrap<Complaint>(raw, "complaint") };
  },
  // assign: async (
  //   id: string | number,
  //   payload: { employee_id: string | number; note?: string },
  // ) => {
  //   const raw = await request<unknown>(`/admin/complaints/${id}/assign`, {
  //     method: "PATCH",
  //     body: JSON.stringify(payload),
  //   });
  //   return { complaint: unwrap<Complaint>(raw, "complaint") };
  // },

  assign: async (
    id: string | number,
    payload: { assigned_employee_id: string | number; note?: string },
  ) => {
    const raw = await request<unknown>(`/admin/complaints/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return { complaint: unwrap<Complaint>(raw, "complaint") };
  },
  changeDepartment: async (
    id: string | number,
    payload: {
      department_id: string | number;
      category_id?: string | number;
      note?: string;
    },
  ) => {
    const raw = await request<unknown>(`/admin/complaints/${id}/department`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return { complaint: unwrap<Complaint>(raw, "complaint") };
  },
  changePriority: async (
    id: string | number,
    payload: { priority_id: string | number; note?: string },
  ) => {
    const raw = await request<unknown>(`/admin/complaints/${id}/priority`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return { complaint: unwrap<Complaint>(raw, "complaint") };
  },
  updateStatus: async (
    id: string | number,
    payload: { status: ComplaintStatus; note?: string },
  ) => {
    const raw = await request<unknown>(`/admin/complaints/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return { complaint: unwrap<Complaint>(raw, "complaint") };
  },
};

// ---------- Information Requests ----------
// There is NO comments endpoint on the backend. "Request additional
// information" is driven through the complaint status lifecycle:
//   PATCH /employee/complaints/{id}/status  with { status: "waiting_citizen", note }
//   PATCH /admin/complaints/{id}/status     with { status: "waiting_citizen", note }
// The request/response is read from complaint.active_information_request.

// ---------- Admin: Reports ----------

export const reportsApi = {
  overview: () =>
    request<ReportOverview>("/admin/reports/overview", { method: "GET" }),
  complaintsByStatus: () =>
    request<Record<string, number> | unknown[]>(
      "/admin/reports/complaints-by-status",
      {
        method: "GET",
      },
    ),
  complaintsByDepartment: () =>
    request<unknown[]>("/admin/reports/complaints-by-department", {
      method: "GET",
    }),
  complaintsByPriority: () =>
    request<unknown[]>("/admin/reports/complaints-by-priority", {
      method: "GET",
    }),
  slaPerformance: () =>
    request<unknown>("/admin/reports/sla-performance", { method: "GET" }),
  employeePerformance: () =>
    request<unknown[]>("/admin/reports/employee-performance", {
      method: "GET",
    }),
  complaintTrends: (
    params: { date_from?: string; date_to?: string; group_by?: string } = {},
  ) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<unknown[]>(
      `/admin/reports/complaint-trends${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
      },
    );
  },
  slaBreaches: (params: { per_page?: number; page?: number } = {}) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<{ data: unknown[] } | unknown[]>(
      `/admin/reports/sla-breaches${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
      },
    );
  },
};

// ---------- Classification Management ----------

export const classificationApi = {
  preview: (payload: { title: string; description: string }) =>
    request<ClassificationPreviewResult>("/classification/complaints/preview", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  listRules: (params: { per_page?: number; page?: number } = {}) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<{ classification_rules: ClassificationRule[] }>(
      `/admin/classification-rules${qs ? `?${qs}` : ""}`,
      { method: "GET" },
    );
  },
  createRule: (payload: Partial<ClassificationRule>) =>
    request<{ classification_rule: ClassificationRule }>(
      "/admin/classification-rules",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    ),
  showRule: (id: string | number) =>
    request<{ classification_rule: ClassificationRule }>(
      `/admin/classification-rules/${id}`,
      {
        method: "GET",
      },
    ),
  updateRule: (id: string | number, payload: Partial<ClassificationRule>) =>
    request<{ classification_rule: ClassificationRule }>(
      `/admin/classification-rules/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    ),
  removeRule: (id: string | number) =>
    request<null>(`/admin/classification-rules/${id}`, { method: "DELETE" }),
};

// ---------- Notification Admin ----------

export const notificationAdminApi = {
  listDeliveryLogs: (params: { per_page?: number; page?: number } = {}) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<{ delivery_logs: NotificationDeliveryLog[] }>(
      `/admin/notification-delivery-logs${qs ? `?${qs}` : ""}`,
      { method: "GET" },
    );
  },
  showDeliveryLog: (id: string | number) =>
    request<{ delivery_log: NotificationDeliveryLog }>(
      `/admin/notification-delivery-logs/${id}`,
      {
        method: "GET",
      },
    ),
};
// ---------- Admin: User Management ----------

export const adminUsersApi = {
  list: (
    params: {
      search?: string;
      role?: "citizen" | "employee" | "admin";
      department_id?: string | number;
      is_active?: boolean;
      page?: number;
      per_page?: number;
    } = {},
  ) => {
    const query: Record<string, string> = {};
    if (params.search) query.search = params.search;
    if (params.role) query.role = params.role;
    if (params.department_id !== undefined)
      query.department_id = String(params.department_id);
    if (params.is_active !== undefined)
      query.is_active = String(params.is_active);
    if (params.page) query.page = String(params.page);
    if (params.per_page) query.per_page = String(params.per_page);
    const qs = new URLSearchParams(query).toString();
    return request<{ users: User[] }>(`/admin/users${qs ? `?${qs}` : ""}`, {
      method: "GET",
    });
  },

  create: (payload: {
    name: string;
    email: string;
    phone: string;
    national_id?: string;
    password: string;
    password_confirmation: string;
    role: "citizen" | "employee" | "admin";
    department_id?: string | number;
    is_active?: boolean;
  }) =>
    request<{ user: User }>("/admin/users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  show: (id: string | number) =>
    request<{ user: User }>(`/admin/users/${id}`, { method: "GET" }),

  update: (
    id: string | number,
    payload: {
      name?: string;
      email?: string;
      phone?: string;
      national_id?: string;
      role?: "citizen" | "employee" | "admin";
      department_id?: string | number | null;
    },
  ) =>
    request<{ user: User }>(`/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  updateStatus: (id: string | number, payload: { is_active: boolean }) =>
    request<{ user: User }>(`/admin/users/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
};
export { ApiRequestError as ApiError };
