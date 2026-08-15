// "use client";

// import { useEffect, useState, use as usePromise } from "react";
// import Link from "next/link";
// import {
//   adminComplaintsApi,
//   adminEmployeesApi,
//   lookupsApi,
//   ApiError,
// } from "@/lib/api";
// import type {
//   Complaint,
//   ComplaintStatus,
//   Department,
//   Category,
//   Priority,
//   Employee,
// } from "@/types/api";
// import {
//   StatusBadge,
//   ALL_STATUSES,
//   statusLabel,
// } from "@/components/status-badge";
// import {
//   FormField,
//   inputClass,
//   primaryButtonClass,
//   secondaryButtonClass,
// } from "@/components/form-field";

// export default function AdminComplaintDetail({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = usePromise(params);
//   const [complaint, setComplaint] = useState<Complaint | null>(null);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [priorities, setPriorities] = useState<Priority[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [activeAction, setActiveAction] = useState<
//     "status" | "assign" | "department" | "priority" | null
//   >(null);
//   const [statusValue, setStatusValue] = useState<ComplaintStatus | "">("");

//   // Assignment state
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [employeesLoading, setEmployeesLoading] = useState(false);
//   const [employeesError, setEmployeesError] = useState<string | null>(null);
//   const [assignedEmployeeId, setAssignedEmployeeId] = useState("");

//   const [departmentId, setDepartmentId] = useState("");
//   const [categoryId, setCategoryId] = useState("");
//   const [priorityId, setPriorityId] = useState("");
//   const [note, setNote] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [actionError, setActionError] = useState<string | null>(null);

//   async function load() {
//     setLoading(true);
//     setError(null);
//     try {
//       const [{ complaint }, { departments }, { categories }, { priorities }] =
//         await Promise.all([
//           adminComplaintsApi.show(id),
//           lookupsApi.departments(),
//           lookupsApi.categories(),
//           lookupsApi.priorities(),
//         ]);
//       setComplaint(complaint);
//       setStatusValue(complaint.status);
//       setDepartments(departments);
//       setCategories(categories);
//       setPriorities(priorities);
//     } catch (err) {
//       setError(err instanceof ApiError ? err.message : "تعذّر تحميل الشكوى.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   // Load employees for the complaint's department once "assign" is opened
//   async function loadEmployees() {
//     if (!complaint) return;
//     setEmployeesLoading(true);
//     setEmployeesError(null);
//     try {
//       const { employees } = await adminEmployeesApi.list({
//         department_id: complaint.department?.id,
//         is_active: true,
//         per_page: 100,
//       });
//       setEmployees(employees);
//     } catch (err) {
//       setEmployeesError(
//         err instanceof ApiError ? err.message : "تعذّر تحميل الموظفين.",
//       );
//     } finally {
//       setEmployeesLoading(false);
//     }
//   }

//   function resetActionState() {
//     setActiveAction(null);
//     setNote("");
//     setActionError(null);
//   }

//   async function onSubmitStatus(e: React.FormEvent) {
//     e.preventDefault();
//     if (!statusValue) return;
//     setSaving(true);
//     setActionError(null);
//     try {
//       await adminComplaintsApi.updateStatus(id, {
//         status: statusValue,
//         note: note || undefined,
//       });
//       resetActionState();
//       await load();
//     } catch (err) {
//       setActionError(
//         err instanceof ApiError ? err.message : "تعذّر تحديث الحالة.",
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function onSubmitAssign(e: React.FormEvent) {
//     e.preventDefault();
//     if (!assignedEmployeeId) return;
//     setSaving(true);
//     setActionError(null);
//     try {
//       await adminComplaintsApi.assign(id, {
//         assigned_employee_id: assignedEmployeeId,
//         note: note || undefined,
//       });
//       resetActionState();
//       setAssignedEmployeeId("");
//       await load();
//     } catch (err) {
//       setActionError(
//         err instanceof ApiError ? err.message : "تعذّر إسناد الشكوى.",
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function onSubmitDepartment(e: React.FormEvent) {
//     e.preventDefault();
//     if (!departmentId) return;
//     setSaving(true);
//     setActionError(null);
//     try {
//       await adminComplaintsApi.changeDepartment(id, {
//         department_id: departmentId,
//         category_id: categoryId || undefined,
//         note: note || undefined,
//       });
//       resetActionState();
//       await load();
//     } catch (err) {
//       setActionError(
//         err instanceof ApiError ? err.message : "تعذّر تغيير القسم.",
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function onSubmitPriority(e: React.FormEvent) {
//     e.preventDefault();
//     if (!priorityId) return;
//     setSaving(true);
//     setActionError(null);
//     try {
//       await adminComplaintsApi.changePriority(id, {
//         priority_id: priorityId,
//         note: note || undefined,
//       });
//       resetActionState();
//       await load();
//     } catch (err) {
//       setActionError(
//         err instanceof ApiError ? err.message : "تعذّر تغيير الأولوية.",
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading) return <p className="text-sm text-muted">جارٍ التحميل…</p>;
//   if (error) return <p className="text-sm text-brick">{error}</p>;
//   if (!complaint) return null;

//   const actionButtons = [
//     { key: "status", label: "تحديث الحالة" },
//     { key: "assign", label: "إسناد لموظف" },
//     { key: "department", label: "تغيير القسم/التصنيف" },
//     { key: "priority", label: "تغيير الأولوية" },
//   ] as const;

//   return (
//     <div>
//       <Link
//         href="/admin/complaints"
//         className="text-sm text-muted hover:text-ink"
//       >
//         ← رجوع للقائمة
//       </Link>

//       <div className="mt-3 flex items-start justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-ink">{complaint.title}</h1>
//           <p className="mt-1 text-sm text-muted">
//             {complaint.reference_no
//               ? `مرجع #${complaint.reference_no}`
//               : `شكوى #${complaint.id}`}
//           </p>
//         </div>
//         <StatusBadge status={complaint.status} />
//       </div>

//       <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
//         <div className="rounded-lg border border-line bg-surface p-4">
//           <p className="text-xs uppercase tracking-wide text-muted">القسم</p>
//           <p className="mt-1 text-sm font-medium text-ink">
//             {complaint.department?.name ?? "—"}
//           </p>
//         </div>
//         <div className="rounded-lg border border-line bg-surface p-4">
//           <p className="text-xs uppercase tracking-wide text-muted">التصنيف</p>
//           <p className="mt-1 text-sm font-medium text-ink">
//             {complaint.category?.name ?? "—"}
//           </p>
//         </div>
//         <div className="rounded-lg border border-line bg-surface p-4">
//           <p className="text-xs uppercase tracking-wide text-muted">الأولوية</p>
//           <p className="mt-1 text-sm font-medium text-ink">
//             {complaint.priority?.name ?? "—"}
//           </p>
//         </div>
//         <div className="rounded-lg border border-line bg-surface p-4">
//           <p className="text-xs uppercase tracking-wide text-muted">
//             مسندة إلى
//           </p>
//           <p className="mt-1 text-sm font-medium text-ink">
//             {complaint.assigned_employee?.name ?? "غير مسندة"}
//           </p>
//         </div>
//       </div>

//       <div className="mt-4 rounded-lg border border-line bg-surface p-5">
//         <p className="text-xs uppercase tracking-wide text-muted">الوصف</p>
//         <p className="mt-2 whitespace-pre-wrap text-sm text-ink">
//           {complaint.description}
//         </p>
//       </div>

//       <div className="mt-6 rounded-lg border border-line bg-surface p-5">
//         <h2 className="text-sm font-semibold text-ink">إجراءات</h2>
//         <div className="mt-3 flex flex-wrap gap-2">
//           {actionButtons.map((btn) => (
//             <button
//               key={btn.key}
//               onClick={() => {
//                 setActiveAction(btn.key);
//                 setActionError(null);
//                 if (btn.key === "assign" && employees.length === 0) {
//                   loadEmployees();
//                 }
//               }}
//               className={
//                 activeAction === btn.key
//                   ? primaryButtonClass
//                   : secondaryButtonClass
//               }
//             >
//               {btn.label}
//             </button>
//           ))}
//         </div>

//         {activeAction === "status" && (
//           <form onSubmit={onSubmitStatus} className="mt-4 max-w-sm space-y-3">
//             <FormField label="الحالة الجديدة">
//               <select
//                 className={inputClass}
//                 value={statusValue}
//                 onChange={(e) =>
//                   setStatusValue(e.target.value as ComplaintStatus)
//                 }
//               >
//                 {ALL_STATUSES.map((s) => (
//                   <option key={s} value={s}>
//                     {statusLabel(s)}
//                   </option>
//                 ))}
//               </select>
//             </FormField>
//             <FormField label="ملاحظة (اختياري)">
//               <textarea
//                 className={inputClass}
//                 rows={2}
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//               />
//             </FormField>
//             {actionError && <p className="text-sm text-brick">{actionError}</p>}
//             <button
//               type="submit"
//               disabled={saving}
//               className={primaryButtonClass}
//             >
//               {saving ? "جارٍ الحفظ…" : "حفظ"}
//             </button>
//           </form>
//         )}

//         {activeAction === "assign" && (
//           <form onSubmit={onSubmitAssign} className="mt-4 max-w-sm space-y-3">
//             <FormField
//               label={`الموظف${complaint.department ? ` (قسم ${complaint.department.name})` : ""}`}
//             >
//               {employeesLoading ? (
//                 <p className="text-sm text-muted">جارٍ تحميل الموظفين…</p>
//               ) : employeesError ? (
//                 <p className="text-sm text-brick">{employeesError}</p>
//               ) : employees.length === 0 ? (
//                 <p className="text-sm text-muted">
//                   لا يوجد موظفون نشطون في هذا القسم.
//                 </p>
//               ) : (
//                 <select
//                   required
//                   className={inputClass}
//                   value={assignedEmployeeId}
//                   onChange={(e) => setAssignedEmployeeId(e.target.value)}
//                 >
//                   <option value="" disabled>
//                     اختر الموظف
//                   </option>
//                   {employees.map((emp) => (
//                     <option key={emp.id} value={emp.id}>
//                       {emp.name} — {emp.email}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </FormField>
//             <FormField label="ملاحظة (اختياري)">
//               <textarea
//                 className={inputClass}
//                 rows={2}
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//               />
//             </FormField>
//             {actionError && <p className="text-sm text-brick">{actionError}</p>}
//             <button
//               type="submit"
//               disabled={saving || !assignedEmployeeId}
//               className={primaryButtonClass}
//             >
//               {saving ? "جارٍ الحفظ…" : "إسناد"}
//             </button>
//           </form>
//         )}

//         {activeAction === "department" && (
//           <form
//             onSubmit={onSubmitDepartment}
//             className="mt-4 max-w-sm space-y-3"
//           >
//             <FormField label="القسم">
//               <select
//                 required
//                 className={inputClass}
//                 value={departmentId}
//                 onChange={(e) => setDepartmentId(e.target.value)}
//               >
//                 <option value="" disabled>
//                   اختر القسم
//                 </option>
//                 {departments.map((d) => (
//                   <option key={d.id} value={d.id}>
//                     {d.name}
//                   </option>
//                 ))}
//               </select>
//             </FormField>
//             <FormField label="التصنيف (اختياري)">
//               <select
//                 className={inputClass}
//                 value={categoryId}
//                 onChange={(e) => setCategoryId(e.target.value)}
//               >
//                 <option value="">بدون تغيير</option>
//                 {categories
//                   .filter(
//                     (c) =>
//                       !departmentId || String(c.department_id) === departmentId,
//                   )
//                   .map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.name}
//                     </option>
//                   ))}
//               </select>
//             </FormField>
//             <FormField label="ملاحظة (اختياري)">
//               <textarea
//                 className={inputClass}
//                 rows={2}
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//               />
//             </FormField>
//             {actionError && <p className="text-sm text-brick">{actionError}</p>}
//             <button
//               type="submit"
//               disabled={saving}
//               className={primaryButtonClass}
//             >
//               {saving ? "جارٍ الحفظ…" : "حفظ"}
//             </button>
//           </form>
//         )}

//         {activeAction === "priority" && (
//           <form onSubmit={onSubmitPriority} className="mt-4 max-w-sm space-y-3">
//             <FormField label="الأولوية">
//               <select
//                 required
//                 className={inputClass}
//                 value={priorityId}
//                 onChange={(e) => setPriorityId(e.target.value)}
//               >
//                 <option value="" disabled>
//                   اختر الأولوية
//                 </option>
//                 {priorities.map((p) => (
//                   <option key={p.id} value={p.id}>
//                     {p.name}
//                   </option>
//                 ))}
//               </select>
//             </FormField>
//             <FormField label="ملاحظة (اختياري)">
//               <textarea
//                 className={inputClass}
//                 rows={2}
//                 value={note}
//                 onChange={(e) => setNote(e.target.value)}
//               />
//             </FormField>
//             {actionError && <p className="text-sm text-brick">{actionError}</p>}
//             <button
//               type="submit"
//               disabled={saving}
//               className={primaryButtonClass}
//             >
//               {saving ? "جارٍ الحفظ…" : "حفظ"}
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import {
  adminComplaintsApi,
  adminEmployeesApi,
  lookupsApi,
  ApiError,
} from "@/lib/api";
import type {
  Complaint,
  ComplaintStatus,
  Department,
  Category,
  Priority,
  Employee,
} from "@/types/api";
import {
  StatusBadge,
  ALL_STATUSES,
  statusLabel,
} from "@/components/status-badge";
import {
  FormField,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/form-field";
import {
  ChevronLeft,
  User,
  Building2,
  Tag,
  Flag,
  Clock,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Circle,
  AlertCircle,
  Loader2,
  Send,
  Eye,
  UserCheck,
  RefreshCw,
  XCircle,
} from "lucide-react";

// Status pipeline configuration
const STATUS_PIPELINE: Record<
  ComplaintStatus,
  { label: string; icon: React.ReactNode; color: string; step: number }
> = {
  submitted: {
    label: "Submitted",
    icon: <Send className="h-5 w-5" />,
    color: "text-blue-500",
    step: 0,
  },
  under_review: {
    label: "Under Review",
    icon: <Eye className="h-5 w-5" />,
    color: "text-purple-500",
    step: 1,
  },
  assigned: {
    label: "Assigned",
    icon: <UserCheck className="h-5 w-5" />,
    color: "text-indigo-500",
    step: 2,
  },
  in_progress: {
    label: "In Progress",
    icon: <RefreshCw className="h-5 w-5 animate-spin" />,
    color: "text-yellow-500",
    step: 3,
  },
  resolved: {
    label: "Resolved",
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "text-green-500",
    step: 4,
  },
  closed: {
    label: "Closed",
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: "text-gray-500",
    step: 5,
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle className="h-5 w-5" />,
    color: "text-red-500",
    step: 6,
  },
};

// Order of statuses in the pipeline
const STATUS_ORDER: ComplaintStatus[] = [
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "resolved",
  "closed",
  "rejected",
];

export default function AdminComplaintDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeAction, setActiveAction] = useState<
    "status" | "assign" | "department" | "priority" | null
  >(null);
  const [statusValue, setStatusValue] = useState<ComplaintStatus | "">("");

  // Assignment state
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeesError, setEmployeesError] = useState<string | null>(null);
  const [assignedEmployeeId, setAssignedEmployeeId] = useState("");

  const [departmentId, setDepartmentId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [{ complaint }, { departments }, { categories }, { priorities }] =
        await Promise.all([
          adminComplaintsApi.show(id),
          lookupsApi.departments(),
          lookupsApi.categories(),
          lookupsApi.priorities(),
        ]);
      setComplaint(complaint);
      setStatusValue(complaint.status);
      setDepartments(departments);
      setCategories(categories);
      setPriorities(priorities);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to load complaint.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadEmployees() {
    if (!complaint) return;
    setEmployeesLoading(true);
    setEmployeesError(null);
    try {
      const { employees } = await adminEmployeesApi.list({
        department_id: complaint.department?.id,
        is_active: true,
        per_page: 100,
      });
      setEmployees(employees);
    } catch (err) {
      setEmployeesError(
        err instanceof ApiError ? err.message : "Failed to load employees.",
      );
    } finally {
      setEmployeesLoading(false);
    }
  }

  function resetActionState() {
    setActiveAction(null);
    setNote("");
    setActionError(null);
    setSuccessMessage(null);
  }

  function showSuccess(message: string) {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 5000);
  }

  async function onSubmitStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!statusValue) return;
    setSaving(true);
    setActionError(null);
    try {
      await adminComplaintsApi.updateStatus(id, {
        status: statusValue,
        note: note || undefined,
      });
      showSuccess(
        `Status updated to "${statusLabel(statusValue)}" successfully!`,
      );
      resetActionState();
      await load();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Failed to update status.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function onSubmitAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!assignedEmployeeId) return;
    setSaving(true);
    setActionError(null);
    try {
      await adminComplaintsApi.assign(id, {
        assigned_employee_id: assignedEmployeeId,
        note: note || undefined,
      });
      const assignedEmployee = employees.find(
        (e) => e.id === assignedEmployeeId,
      );
      showSuccess(
        `Complaint assigned to ${assignedEmployee?.name || "employee"} successfully!`,
      );
      resetActionState();
      setAssignedEmployeeId("");
      await load();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Failed to assign complaint.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function onSubmitDepartment(e: React.FormEvent) {
    e.preventDefault();
    if (!departmentId) return;
    setSaving(true);
    setActionError(null);
    try {
      await adminComplaintsApi.changeDepartment(id, {
        department_id: departmentId,
        category_id: categoryId || undefined,
        note: note || undefined,
      });
      showSuccess("Department changed successfully!");
      resetActionState();
      await load();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Failed to change department.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function onSubmitPriority(e: React.FormEvent) {
    e.preventDefault();
    if (!priorityId) return;
    setSaving(true);
    setActionError(null);
    try {
      await adminComplaintsApi.changePriority(id, {
        priority_id: priorityId,
        note: note || undefined,
      });
      showSuccess("Priority changed successfully!");
      resetActionState();
      await load();
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : "Failed to change priority.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-500" />
          <p className="mt-3 text-sm text-gray-500">
            Loading complaint details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <p className="mt-3 text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!complaint) return null;

  const currentStep = STATUS_PIPELINE[complaint.status]?.step ?? 0;

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/complaints"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to list
        </Link>
        <div className="h-6 w-px bg-gray-200" />
        <span className="text-sm text-gray-500">
          {complaint.reference_no
            ? `Reference #${complaint.reference_no}`
            : `Complaint #${complaint.id}`}
        </span>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-200 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="inline h-4 w-4 mr-2" />
          {successMessage}
        </div>
      )}

      {/* Main Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        {/* Complaint Header */}
        <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {complaint.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <StatusBadge status={complaint.status} />
                <span className="text-sm text-gray-500">
                  <Calendar className="inline h-3.5 w-3.5 mr-1" />
                  {new Date(complaint.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {complaint.priority && (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                    complaint.priority.name === "High" ||
                    complaint.priority.name === "Critical"
                      ? "bg-red-100 text-red-700"
                      : complaint.priority.name === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <Flag className="h-3 w-3" />
                  {complaint.priority.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status Pipeline */}
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-8">
          <div className="flex items-center justify-between">
            {STATUS_ORDER.map((status, index) => {
              const pipeline = STATUS_PIPELINE[status];
              const isCompleted = index <= currentStep;
              const isCurrent = status === complaint.status;

              return (
                <div key={status} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                        isCompleted
                          ? "border-indigo-500 bg-indigo-500 text-white shadow-md"
                          : "border-gray-300 bg-white text-gray-400"
                      } ${isCurrent ? "ring-4 ring-indigo-200 shadow-lg" : ""}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isCompleted ? "text-indigo-600" : "text-gray-400"
                      }`}
                    >
                      {pipeline.label}
                    </span>
                    {isCurrent && (
                      <span className="mt-0.5 text-[10px] font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  {index < STATUS_ORDER.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2">
                      <div
                        className={`h-full transition-all ${
                          index < currentStep ? "bg-indigo-500" : "bg-gray-200"
                        }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Complaint Details Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-gray-400" />
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Department
                </p>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {complaint.department?.name ?? "—"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Category
                </p>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {complaint.category?.name ?? "—"}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Assigned To
                </p>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {complaint.assigned_employee?.name ?? (
                  <span className="text-gray-400">Unassigned</span>
                )}
              </p>
              {complaint.assigned_employee?.email && (
                <p className="mt-0.5 text-xs text-gray-500">
                  {complaint.assigned_employee.email}
                </p>
              )}
            </div>

            <div className="rounded-lg bg-gray-50 p-4 border border-gray-100">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Last Updated
                </p>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-900">
                {complaint.updated_at
                  ? new Date(complaint.updated_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "—"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 rounded-lg bg-gray-50 p-4 border border-gray-100">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-gray-400" />
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                Description
              </p>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {/* Additional Info - Submitted At */}
          <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-500">
            <span>
              <span className="font-medium text-gray-700">Submitted:</span>{" "}
              {new Date(complaint.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <h2 className="text-sm font-semibold text-gray-900">Actions</h2>
          <p className="mt-0.5 text-xs text-gray-500">
            Manage this complaint with the actions below
          </p>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-3">
            {[
              { key: "status", label: "Update Status" },
              { key: "assign", label: "Assign to Employee" },
              { key: "department", label: "Change Department" },
              { key: "priority", label: "Change Priority" },
            ].map((btn) => (
              <button
                key={btn.key}
                onClick={() => {
                  setActiveAction(btn.key as typeof activeAction);
                  setActionError(null);
                  setSuccessMessage(null);
                  if (btn.key === "assign" && employees.length === 0) {
                    loadEmployees();
                  }
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                  activeAction === btn.key
                    ? "bg-indigo-600 text-white shadow-md hover:bg-indigo-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Action Forms */}
          <div className="mt-4">
            {activeAction === "status" && (
              <form
                onSubmit={onSubmitStatus}
                className="max-w-md space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <FormField label="New Status">
                  <select
                    className={`${inputClass} w-full`}
                    value={statusValue}
                    onChange={(e) =>
                      setStatusValue(e.target.value as ComplaintStatus)
                    }
                  >
                    {ALL_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {statusLabel(s)}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Note (Optional)">
                  <textarea
                    className={`${inputClass} w-full`}
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note about this status change..."
                  />
                </FormField>
                {actionError && (
                  <p className="text-sm text-red-600">{actionError}</p>
                )}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`${primaryButtonClass} flex items-center gap-2`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetActionState}
                    className={secondaryButtonClass}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {activeAction === "assign" && (
              <form
                onSubmit={onSubmitAssign}
                className="max-w-md space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <FormField
                  label={`Employee ${complaint.department ? `(Department: ${complaint.department.name})` : ""}`}
                >
                  {employeesLoading ? (
                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading employees...
                    </p>
                  ) : employeesError ? (
                    <p className="text-sm text-red-600">{employeesError}</p>
                  ) : employees.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No active employees in this department.
                    </p>
                  ) : (
                    <select
                      required
                      className={`${inputClass} w-full`}
                      value={assignedEmployeeId}
                      onChange={(e) => setAssignedEmployeeId(e.target.value)}
                    >
                      <option value="" disabled>
                        Select employee
                      </option>
                      {employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} — {emp.email}
                        </option>
                      ))}
                    </select>
                  )}
                </FormField>
                <FormField label="Note (Optional)">
                  <textarea
                    className={`${inputClass} w-full`}
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note about this assignment..."
                  />
                </FormField>
                {actionError && (
                  <p className="text-sm text-red-600">{actionError}</p>
                )}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving || !assignedEmployeeId}
                    className={`${primaryButtonClass} flex items-center gap-2`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Assign"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetActionState}
                    className={secondaryButtonClass}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {activeAction === "department" && (
              <form
                onSubmit={onSubmitDepartment}
                className="max-w-md space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <FormField label="Department">
                  <select
                    required
                    className={`${inputClass} w-full`}
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                  >
                    <option value="" disabled>
                      Select department
                    </option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Category (Optional)">
                  <select
                    className={`${inputClass} w-full`}
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="">No change</option>
                    {categories
                      .filter(
                        (c) =>
                          !departmentId ||
                          String(c.department_id) === departmentId,
                      )
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </FormField>
                <FormField label="Note (Optional)">
                  <textarea
                    className={`${inputClass} w-full`}
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note about this change..."
                  />
                </FormField>
                {actionError && (
                  <p className="text-sm text-red-600">{actionError}</p>
                )}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`${primaryButtonClass} flex items-center gap-2`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetActionState}
                    className={secondaryButtonClass}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {activeAction === "priority" && (
              <form
                onSubmit={onSubmitPriority}
                className="max-w-md space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-4"
              >
                <FormField label="Priority">
                  <select
                    required
                    className={`${inputClass} w-full`}
                    value={priorityId}
                    onChange={(e) => setPriorityId(e.target.value)}
                  >
                    <option value="" disabled>
                      Select priority
                    </option>
                    {priorities.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </FormField>
                <FormField label="Note (Optional)">
                  <textarea
                    className={`${inputClass} w-full`}
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note about this priority change..."
                  />
                </FormField>
                {actionError && (
                  <p className="text-sm text-red-600">{actionError}</p>
                )}
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`${primaryButtonClass} flex items-center gap-2`}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetActionState}
                    className={secondaryButtonClass}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
