"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  FolderOpen,
  ImageIcon,
  Link as LinkIcon,
  MapPin,
  MessageSquareMore,
  Paperclip,
  RefreshCw,
  Send,
  ShieldAlert,
  UserCheck,
} from "lucide-react";
import {
  adminComplaintsApi,
  adminEmployeesApi,
  ApiError,
  employeeComplaintsApi,
  lookupsApi,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/locale-context";
import { StatusBadge, useStatusLabel } from "@/components/status-badge";
import { inputClass, primaryButtonClass, secondaryButtonClass } from "@/components/form-field";
import type { Category, Complaint, ComplaintStatus, Department, Employee, Priority } from "@/types/api";
import {
  availableWorkspaceActions,
  BRANCH_STATUSES,
  buildActivity,
  buildPipelineVisits,
  elapsedMinutes,
  formatDuration,
  MAIN_PIPELINE,
  type ActivityType,
  type ComplaintActivityEvent,
  type WorkspaceAction,
} from "./workspace-model";

type StaffRole = "admin" | "employee";
type ModalState =
  | { type: "status"; action: WorkspaceAction }
  | { type: "assign" }
  | { type: "department" }
  | { type: "priority" }
  | null;

const copy = {
  en: {
    loading: "Loading secure complaint workspace…",
    forbidden: "You don't have permission to access this complaint.",
    notFound: "This complaint was not found.",
    failed: "We couldn't load this complaint.",
    retry: "Retry",
    workspace: "Complaint workspace",
    submitted: "Submitted",
    updated: "Last updated",
    noData: "Not provided",
    overview: "Case summary",
    description: "Complaint description",
    citizen: "Citizen",
    organization: "Organization",
    assignment: "Current assignment",
    unassigned: "Unassigned",
    location: "Location",
    openMap: "Open map",
    classification: "Classification",
    category: "Category",
    automatic: "Automatic classification",
    manual: "Manual classification",
    confidence: "Confidence",
    method: "Method",
    sla: "SLA status",
    due: "Due",
    firstResponse: "First response",
    resolved: "Resolved",
    closed: "Closed",
    waiting: "Waiting for citizen",
    within: "Within SLA",
    near: "Near deadline",
    overdue: "Overdue / breached",
    unknownSla: "No SLA deadline",
    current: "Current state",
    lifecycle: "Lifecycle pipeline",
    visited: "Visited",
    next: "Possible next state",
    journey: "Actual journey",
    noHistory: "No status transitions have been returned yet.",
    actions: "Available next actions",
    noActions: "No backend-valid actions are available in this state.",
    requestInfo: "Request additional information",
    continueProcessing: "Accept response & continue",
    resolve: "Accept response & resolve",
    startReview: "Start review",
    startProcessing: "Start processing",
    escalate: "Escalate",
    reject: "Reject complaint",
    closeCase: "Close complaint",
    infoRequest: "Citizen information request",
    responseRequired: "Citizen has replied — staff review required.",
    responsePending: "Waiting for citizen response.",
    requestedBy: "Requested by",
    requested: "Requested",
    citizenResponse: "Citizen response",
    responseAt: "Responded",
    attachments: "Attachments",
    noAttachments: "No attachments have been returned for this complaint.",
    open: "Open",
    activity: "Complete case activity",
    all: "All",
    status: "Status",
    communication: "Citizen communication",
    attachment: "Attachments",
    assignmentFilter: "Assignments",
    technical: "Technical / submission metadata",
    source: "Source",
    clientRef: "Client reference",
    complaintId: "Complaint ID",
    created: "Created",
    note: "Note / reason",
    optional: "optional",
    cancel: "Cancel",
    confirm: "Confirm action",
    save: "Save changes",
    assign: "Assign employee",
    changeDepartment: "Change department/category",
    changePriority: "Change priority",
    selectEmployee: "Select an eligible employee",
    selectDepartment: "Select department",
    noCategory: "No category",
    selectPriority: "Select priority",
    message: "Message to citizen",
    messageHint: "Explain the information or documents required. This is required by the backend.",
    actionNote: "Optional case note",
    processing: "Saving…",
    actionSuccess: "The complaint was refreshed from the backend.",
    confirmTerminal: "This action changes the case to a terminal or resolved state. Please confirm.",
    attachmentUploaded: "Uploaded",
    assignedTo: "Assigned to",
    by: "by",
    from: "from",
    to: "to",
    duration: "Time in previous state",
    currentFor: "Current for",
    eventCreated: "Complaint submitted",
    eventStatus: "Status changed",
    eventNote: "Case note recorded",
    eventRequest: "Additional information requested",
    eventResponse: "Citizen provided additional information",
    eventAttachment: "Attachment uploaded",
  },
  ar: {
    loading: "جارٍ تحميل مساحة عمل الشكوى الآمنة…",
    forbidden: "ليس لديك صلاحية الوصول إلى هذه الشكوى.",
    notFound: "لم يتم العثور على هذه الشكوى.",
    failed: "تعذر تحميل الشكوى.",
    retry: "إعادة المحاولة",
    workspace: "مساحة عمل الشكوى",
    submitted: "تاريخ التقديم",
    updated: "آخر تحديث",
    noData: "غير متوفر",
    overview: "ملخص القضية",
    description: "وصف الشكوى",
    citizen: "المواطن",
    organization: "الجهة المسؤولة",
    assignment: "الإسناد الحالي",
    unassigned: "غير مسندة",
    location: "الموقع",
    openMap: "فتح الخريطة",
    classification: "التصنيف",
    category: "الفئة",
    automatic: "تصنيف تلقائي",
    manual: "تصنيف يدوي",
    confidence: "درجة الثقة",
    method: "الطريقة",
    sla: "حالة اتفاقية مستوى الخدمة",
    due: "الموعد النهائي",
    firstResponse: "أول استجابة",
    resolved: "تاريخ الحل",
    closed: "تاريخ الإغلاق",
    waiting: "بانتظار المواطن",
    within: "ضمن مستوى الخدمة",
    near: "قرب الموعد النهائي",
    overdue: "متأخرة / تم خرق المستوى",
    unknownSla: "لا يوجد موعد SLA",
    current: "الحالة الحالية",
    lifecycle: "مسار دورة حياة الشكوى",
    visited: "تمت زيارتها",
    next: "حالة تالية ممكنة",
    journey: "المسار الفعلي",
    noHistory: "لا توجد انتقالات حالة معادة من النظام بعد.",
    actions: "الإجراءات التالية المتاحة",
    noActions: "لا توجد إجراءات صالحة في الخلفية لهذه الحالة.",
    requestInfo: "طلب معلومات إضافية",
    continueProcessing: "قبول الرد ومتابعة المعالجة",
    resolve: "قبول الرد وحل الشكوى",
    startReview: "بدء المراجعة",
    startProcessing: "بدء المعالجة",
    escalate: "تصعيد",
    reject: "رفض الشكوى",
    closeCase: "إغلاق الشكوى",
    infoRequest: "طلب معلومات من المواطن",
    responseRequired: "ردّ المواطن — يلزم مراجعة الموظف.",
    responsePending: "بانتظار رد المواطن.",
    requestedBy: "طُلب بواسطة",
    requested: "تاريخ الطلب",
    citizenResponse: "رد المواطن",
    responseAt: "تاريخ الرد",
    attachments: "المرفقات",
    noAttachments: "لا توجد مرفقات معادة لهذه الشكوى.",
    open: "فتح",
    activity: "سجل نشاط القضية الكامل",
    all: "الكل",
    status: "الحالات",
    communication: "تواصل المواطن",
    attachment: "المرفقات",
    assignmentFilter: "الإسنادات",
    technical: "بيانات تقنية / بيانات التقديم",
    source: "المصدر",
    clientRef: "مرجع العميل",
    complaintId: "رقم المعرف",
    created: "أنشئت",
    note: "ملاحظة / سبب",
    optional: "اختياري",
    cancel: "إلغاء",
    confirm: "تأكيد الإجراء",
    save: "حفظ التغييرات",
    assign: "إسناد لموظف",
    changeDepartment: "تغيير القسم / الفئة",
    changePriority: "تغيير الأولوية",
    selectEmployee: "اختر موظفاً مؤهلاً",
    selectDepartment: "اختر القسم",
    noCategory: "بلا فئة",
    selectPriority: "اختر الأولوية",
    message: "رسالة إلى المواطن",
    messageHint: "اشرح المعلومات أو المستندات المطلوبة. هذه الرسالة مطلوبة من الخلفية.",
    actionNote: "ملاحظة اختيارية للقضية",
    processing: "جارٍ الحفظ…",
    actionSuccess: "تم تحديث الشكوى من الخلفية.",
    confirmTerminal: "سيغيّر هذا الإجراء القضية إلى حالة نهائية أو محلولة. يرجى التأكيد.",
    attachmentUploaded: "رُفع",
    assignedTo: "أُسندت إلى",
    by: "بواسطة",
    from: "من",
    to: "إلى",
    duration: "المدة في الحالة السابقة",
    currentFor: "الحالة الحالية منذ",
    eventCreated: "تم تقديم الشكوى",
    eventStatus: "تغيرت الحالة",
    eventNote: "تمت إضافة ملاحظة للقضية",
    eventRequest: "تم طلب معلومات إضافية",
    eventResponse: "قدم المواطن معلومات إضافية",
    eventAttachment: "تم رفع مرفق",
  },
} as const;

type WorkspaceCopy = Record<keyof typeof copy.en, string>;

function date(value: string | null | undefined, locale: "ar" | "en"): string {
  if (!value || Number.isNaN(new Date(value).getTime())) return "—";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SY" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function size(value?: number | null): string | null {
  if (!value || value < 1) return null;
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(mime?: string | null, fileName?: string | null): boolean {
  return Boolean(mime?.startsWith("image/") || /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(fileName ?? ""));
}

function Card({ title, icon, children, className = "" }: { title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-line bg-surface p-5 shadow-sm ${className}`}><h2 className="flex items-center gap-2 text-lg font-semibold text-ink">{icon}{title}</h2><div className="mt-4">{children}</div></section>;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return <div><p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p><div className="mt-1 break-words text-sm font-semibold text-ink">{value || "—"}</div></div>;
}

function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => { const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose(); window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [onClose]);
  return <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 sm:items-center" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}><div role="dialog" aria-modal="true" aria-label={title} className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-surface p-5 shadow-2xl"><div className="flex items-start justify-between gap-4"><h2 className="text-xl font-semibold text-ink">{title}</h2><button type="button" onClick={onClose} className="rounded-md p-1 text-muted hover:bg-paper focus:outline-none focus:ring-2 focus:ring-teal" aria-label="Close">×</button></div>{children}</div></div>;
}

function actionLabel(action: WorkspaceAction, labels: WorkspaceCopy, fromStatus?: ComplaintStatus) {
  if (action.status === "waiting_citizen") return labels.requestInfo;
  if (action.status === "in_progress" && fromStatus === "waiting_citizen") return labels.continueProcessing;
  return ({ under_review: labels.startReview, in_progress: labels.startProcessing, resolved: labels.resolve, closed: labels.closeCase, rejected: labels.reject, escalated: labels.escalate, waiting_citizen: labels.requestInfo } as Partial<Record<ComplaintStatus, string>>)[action.id] ?? action.status;
}

function activityText(event: ComplaintActivityEvent, labels: WorkspaceCopy) {
  if (event.type === "status" && event.fromStatus !== event.toStatus) return <>{event.actor || "—"} {labels.from} <StatusBadge status={event.fromStatus ?? ""} /> <ArrowRight className="mx-1 inline h-3 w-3" aria-hidden /> {labels.to} <StatusBadge status={event.toStatus ?? ""} /></>;
  if (event.type === "assignment") return <>{labels.assignedTo} <strong>{event.assignment?.assigned_to?.name ?? "—"}</strong>{event.actor ? ` ${labels.by} ${event.actor}` : ""}</>;
  return event.title;
}

export function ComplaintWorkspace({ id }: { id: string }) {
  const { user, loading: authLoading } = useAuth();
  const { locale } = useLocale();
  const router = useRouter();
  const labels = copy[locale];
  const statusLabel = useStatusLabel();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [error, setError] = useState<{ status?: number; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [lookupsLoading, setLookupsLoading] = useState(false);
  const [activityFilter, setActivityFilter] = useState<"all" | ActivityType>("all");
  const [now, setNow] = useState<number | null>(null);

  const role: StaffRole | null = user?.role === "admin" || user?.role === "employee" ? user.role : null;

  useEffect(() => {
    if (!authLoading && !role) router.replace(user ? `/${user.role}` : "/login");
  }, [authLoading, role, router, user]);

  async function loadComplaint() {
    if (!role) return;
    setLoading(true); setError(null);
    try {
      const result = role === "admin" ? await adminComplaintsApi.show(id) : await employeeComplaintsApi.show(id);
      setComplaint(result.complaint);
    } catch (err) {
      const apiError = err instanceof ApiError ? err : null;
      setError({ status: apiError?.status, message: apiError?.message || labels.failed });
    } finally { setLoading(false); }
  }

  useEffect(() => { if (!authLoading && role) { const timer = window.setTimeout(() => void loadComplaint(), 0); return () => window.clearTimeout(timer); } // role and id are deliberate route inputs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, role, id]);

  useEffect(() => { const timer = window.setTimeout(() => setNow(Date.now()), 0); return () => window.clearTimeout(timer); }, []);

  const actions = useMemo(() => complaint && role ? availableWorkspaceActions(complaint, role, user?.department?.id) : [], [complaint, role, user?.department?.id]);
  const activity = useMemo(() => complaint ? buildActivity(complaint) : [], [complaint]);
  const visits = useMemo(() => complaint ? buildPipelineVisits(complaint) : [], [complaint]);
  const visited = useMemo(() => new Set(visits.map((visit) => visit.status)), [visits]);
  const filteredActivity = activity.filter((event) => activityFilter === "all" || event.type === activityFilter || (activityFilter === "request" && event.type === "response"));

  function openModal(next: ModalState) {
    setActionError(null); setNotice(null); setNote("");
    if (next?.type === "assign") setEmployeeId("");
    if (next?.type === "department" && complaint) { setDepartmentId(String(complaint.department?.id ?? "")); setCategoryId(String(complaint.category?.id ?? "")); }
    if (next?.type === "priority" && complaint) setPriorityId(String(complaint.priority?.id ?? ""));
    setModal(next);
    if (next?.type === "assign" || next?.type === "department" || next?.type === "priority") {
      void loadAdminLookup(next.type);
    }
  }

  async function loadAdminLookup(type: Exclude<NonNullable<ModalState>["type"], "status">) {
    if (!complaint || role !== "admin") return;
    setLookupsLoading(true); setActionError(null);
    try {
      if (type === "assign") {
        const result = await adminEmployeesApi.list({ department_id: complaint.department?.id, is_active: true, per_page: 100 });
        setEmployees(result.employees.filter((employee) => employee.role === "employee" && employee.is_active));
      } else if (type === "department") {
        const [deptResult, categoryResult] = await Promise.all([lookupsApi.departments(), lookupsApi.categories()]);
        setDepartments(deptResult.departments); setCategories(categoryResult.categories);
      } else { const result = await lookupsApi.priorities(); setPriorities(result.priorities); }
    } catch (err) { setActionError(err instanceof ApiError ? err.message : labels.failed); } finally { setLookupsLoading(false); }
  }

  async function submitStatus(action: WorkspaceAction) {
    if (!complaint || !role || saving) return;
    if (action.requiresResponse && !note.trim()) { setActionError(labels.messageHint); return; }
    setSaving(true); setActionError(null);
    try {
      const payload = { status: action.status as ComplaintStatus, note: note.trim() || undefined };
      if (role === "admin") await adminComplaintsApi.updateStatus(complaint.id, payload); else await employeeComplaintsApi.updateStatus(complaint.id, payload);
      setModal(null); setNotice(labels.actionSuccess); await loadComplaint();
    } catch (err) { setActionError(err instanceof ApiError ? err.message : labels.failed); } finally { setSaving(false); }
  }

  async function submitAdmin() {
    if (!complaint || role !== "admin" || !modal || modal.type === "status" || saving) return;
    setSaving(true); setActionError(null);
    try {
      if (modal.type === "assign") {
        if (!employeeId) throw new Error(labels.selectEmployee);
        await adminComplaintsApi.assign(complaint.id, { assigned_employee_id: employeeId, note: note.trim() || undefined });
      } else if (modal.type === "department") {
        if (!departmentId) throw new Error(labels.selectDepartment);
        await adminComplaintsApi.changeDepartment(complaint.id, { department_id: departmentId, category_id: categoryId || undefined, note: note.trim() || undefined });
      } else {
        if (!priorityId) throw new Error(labels.selectPriority);
        await adminComplaintsApi.changePriority(complaint.id, { priority_id: priorityId, note: note.trim() || undefined });
      }
      setModal(null); setNotice(labels.actionSuccess); await loadComplaint();
    } catch (err) { setActionError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : labels.failed); } finally { setSaving(false); }
  }

  if (authLoading || (loading && role !== null)) return <WorkspaceSkeleton text={labels.loading} />;
  if (!role) return <StateCard title={labels.forbidden} icon={<ShieldAlert className="h-9 w-9 text-brick" />} />;
  if (error) return <StateCard title={error.status === 403 ? labels.forbidden : error.status === 404 ? labels.notFound : error.message} icon={<AlertCircle className="h-9 w-9 text-brick" />} action={<button className={secondaryButtonClass} onClick={() => void loadComplaint()}>{labels.retry}</button>} />;
  if (!complaint) return <StateCard title={labels.notFound} icon={<AlertCircle className="h-9 w-9 text-brick" />} />;

  const infoRequest = complaint.active_information_request;
  const currentVisit = visits.at(-1);
  const currentDuration = formatDuration(elapsedMinutes(currentVisit?.timestamp));
  const dueTime = complaint.sla_due_at ?? complaint.due_at;
  const dueHours = dueTime && now ? (new Date(dueTime).getTime() - now) / 3600000 : null;
  const slaState = complaint.status === "waiting_citizen" ? labels.waiting : complaint.is_sla_breached || (dueHours !== null && dueHours < 0) ? labels.overdue : dueHours !== null && dueHours < 24 ? labels.near : dueHours !== null ? labels.within : labels.unknownSla;
  const mapUrl = complaint.latitude && complaint.longitude ? `https://www.google.com/maps?q=${encodeURIComponent(`${complaint.latitude},${complaint.longitude}`)}` : null;
  const availableCategories = categories.filter((category) => String(category.department_id) === departmentId);

  return <main className="mx-auto w-full max-w-7xl space-y-5 pb-10">
    {notice && <div role="status" className="flex items-center gap-2 rounded-xl border border-teal/30 bg-teal/10 px-4 py-3 text-sm text-ink"><CheckCircle2 className="h-4 w-4 text-teal" />{notice}</div>}
    <header className="overflow-hidden rounded-2xl bg-ink p-6 text-white shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">{labels.workspace} · {complaint.complaint_number ?? `#${complaint.id}`}</p><div className="mt-3 flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><h1 className="max-w-4xl text-3xl font-semibold leading-tight">{complaint.title}</h1><div className="mt-4 flex flex-wrap items-center gap-2"><span className="rounded-full bg-white/10 px-3 py-1 text-sm">{statusLabel(complaint.status)}</span>{complaint.priority && <span className="rounded-full bg-white/10 px-3 py-1 text-sm">{complaint.priority.name}</span>}<span className="rounded-full bg-white/10 px-3 py-1 text-sm">{slaState}</span></div></div><div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/80"><span>{labels.submitted}: {date(complaint.created_at, locale)}</span><span>{labels.updated}: {date(complaint.updated_at, locale)}</span></div></div></header>
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-5">
        <Card title={labels.lifecycle} icon={<RefreshCw className="h-5 w-5 text-teal" />}><div className="grid gap-3 md:grid-cols-6">{MAIN_PIPELINE.map((status) => { const state = status === complaint.status ? "border-teal bg-teal/10" : visited.has(status) ? "border-teal/40 bg-teal/5" : (availableWorkspaceActions(complaint, role, user?.department?.id).some((a) => a.status === status) ? "border-amber/50 bg-amber/5" : "border-line bg-paper"); return <div key={status} className={`rounded-xl border p-3 ${state}`}><StatusBadge status={status}/><p className="mt-2 text-xs font-medium text-muted">{status === complaint.status ? labels.current : visited.has(status) ? labels.visited : labels.next}</p></div>; })}</div><div className="mt-4 grid gap-2 sm:grid-cols-3">{BRANCH_STATUSES.map((status) => <div key={status} className={`rounded-lg border p-3 ${status === complaint.status ? "border-brick bg-brick/10" : visited.has(status) ? "border-line bg-paper" : "border-line/70 bg-paper/50"}`}><StatusBadge status={status}/><p className="mt-1 text-xs text-muted">{status === complaint.status ? labels.current : visited.has(status) ? labels.visited : labels.next}</p></div>)}</div><div className="mt-5 border-t border-line pt-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted">{labels.journey}</p>{visits.length > 1 ? <ol className="mt-2 flex flex-wrap items-center gap-1.5 text-sm">{visits.map((visit, index) => <li key={visit.id} className="inline-flex items-center gap-1.5"><StatusBadge status={visit.status}/>{index < visits.length - 1 && <ArrowRight className="h-3 w-3 text-muted" />}</li>)}</ol> : <p className="mt-2 text-sm text-muted">{labels.noHistory}</p>}{currentDuration && <p className="mt-3 text-xs text-muted"><Clock3 className="me-1 inline h-3.5 w-3.5" />{labels.currentFor}: {currentDuration}</p>}</div></Card>
        <Card title={labels.overview} icon={<FileText className="h-5 w-5 text-teal" />}><p className="whitespace-pre-wrap text-sm leading-7 text-ink">{complaint.description || labels.noData}</p><div className="mt-5 grid gap-5 border-t border-line pt-5 sm:grid-cols-2"><Field label={labels.citizen} value={<><p>{complaint.citizen?.name ?? labels.noData}</p>{complaint.citizen?.email && <p className="mt-1 font-normal text-muted">{complaint.citizen.email}</p>}{complaint.citizen?.phone && <p className="mt-1 font-normal text-muted">{complaint.citizen.phone}</p>}</>} /><Field label={labels.organization} value={<><p>{complaint.department?.name ?? labels.noData}</p><p className="mt-1 font-normal text-muted">{complaint.category?.name ?? labels.noData}</p></>} /></div></Card>
        {infoRequest && <Card title={labels.infoRequest} icon={<MessageSquareMore className="h-5 w-5 text-teal" />}><div className={`rounded-xl border p-4 ${infoRequest.status === "responded" ? "border-teal/40 bg-teal/5" : "border-purple-500/30 bg-purple-500/5"}`}><div className="flex flex-wrap items-center justify-between gap-2"><StatusBadge status="waiting_citizen"/><strong className={infoRequest.status === "responded" ? "text-teal" : "text-ink"}>{infoRequest.status === "responded" ? labels.responseRequired : labels.responsePending}</strong></div><p className="mt-4 whitespace-pre-wrap text-sm text-ink">{infoRequest.message}</p><div className="mt-3 grid gap-2 text-xs text-muted sm:grid-cols-2"><span>{labels.requestedBy}: {infoRequest.requested_by?.name ?? "—"}</span><span>{labels.requested}: {date(infoRequest.requested_at, locale)}</span></div>{infoRequest.status === "responded" && <div className="mt-4 border-t border-teal/20 pt-4"><p className="font-semibold text-ink">{labels.citizenResponse}</p><p className="mt-2 whitespace-pre-wrap text-sm text-ink">{infoRequest.response_message || "—"}</p><p className="mt-2 text-xs text-muted">{labels.responseAt}: {date(infoRequest.responded_at, locale)}</p></div>}</div></Card>}
        <Card title={labels.attachments} icon={<Paperclip className="h-5 w-5 text-teal" />}>{(complaint.attachments?.length ?? 0) === 0 ? <p className="text-sm text-muted">{labels.noAttachments}</p> : <ul className="divide-y divide-line">{complaint.attachments?.map((attachment, index) => <li key={attachment.id ?? `${attachment.file_name}-${index}`} className="flex items-center gap-3 py-3"><div className="rounded-lg bg-paper p-2">{isImage(attachment.mime_type, attachment.original_name ?? attachment.file_name) ? <ImageIcon className="h-5 w-5 text-teal" /> : <FileText className="h-5 w-5 text-muted" />}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-ink">{attachment.original_name ?? attachment.file_name ?? labels.attachment}</p><p className="mt-1 text-xs text-muted">{[attachment.mime_type, size(attachment.file_size), attachment.uploaded_by, date(attachment.created_at, locale)].filter(Boolean).join(" · ")}</p></div>{attachment.url && <a href={attachment.url} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-teal hover:underline"><LinkIcon className="h-3.5 w-3.5" />{labels.open}</a>}</li>)}</ul>}</Card>
        <Card title={labels.activity} icon={<Clock3 className="h-5 w-5 text-teal" />}><div className="flex flex-wrap gap-2">{([ ["all", labels.all], ["status", labels.status], ["assignment", labels.assignmentFilter], ["request", labels.communication], ["attachment", labels.attachment] ] as const).map(([filter, name]) => <button key={filter} type="button" onClick={() => setActivityFilter(filter)} className={`rounded-full px-3 py-1.5 text-xs font-semibold ${activityFilter === filter ? "bg-ink text-white" : "bg-paper text-muted hover:bg-line"}`}>{name}</button>)}</div><ol className="mt-5 space-y-4 border-s border-line ps-5">{filteredActivity.map((event) => <li key={event.id} className="relative"><span className="absolute -start-[1.82rem] top-1 flex h-4 w-4 rounded-full border-2 border-surface bg-teal" /><article className="rounded-xl border border-line bg-paper p-4"><div className="flex flex-wrap items-start justify-between gap-2"><p className="text-sm font-semibold text-ink">{activityText(event, labels)}</p><time className="text-xs text-muted">{date(event.timestamp, locale)}</time></div>{event.note && <p className="mt-2 whitespace-pre-wrap border-s-2 border-teal/40 ps-3 text-sm text-muted">{event.note}</p>}{event.durationMinutes !== null && event.durationMinutes !== undefined && <p className="mt-2 text-xs text-muted">{labels.duration}: {formatDuration(event.durationMinutes)}</p>}{event.actor && event.type !== "assignment" && <p className="mt-2 text-xs text-muted">{labels.by}: {event.actor}</p>}</article></li>)}</ol></Card>
      </div>
      <aside className="space-y-5 xl:sticky xl:top-5 xl:h-fit"><Card title={labels.actions} icon={<Send className="h-5 w-5 text-teal" />}>{actions.length ? <div className="space-y-2">{actions.map((action) => <button key={action.id} type="button" onClick={() => openModal({ type: "status", action })} className={`w-full rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal ${action.destructive ? "border border-brick/40 text-brick hover:bg-brick/10" : "bg-ink text-white hover:bg-ink-2"}`}>{actionLabel(action, labels, complaint.status)}</button>)}</div> : <p className="text-sm text-muted">{labels.noActions}</p>}{role === "admin" && <div className="mt-4 border-t border-line pt-4"><p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Admin</p><div className="space-y-2">{!["submitted", "resolved", "closed", "rejected"].includes(complaint.status) && <button className={secondaryButtonClass + " w-full"} onClick={() => openModal({ type: "assign" })}>{labels.assign}</button>}{complaint.status !== "waiting_citizen" && <><button className={secondaryButtonClass + " w-full"} onClick={() => openModal({ type: "department" })}>{labels.changeDepartment}</button><button className={secondaryButtonClass + " w-full"} onClick={() => openModal({ type: "priority" })}>{labels.changePriority}</button></>}</div></div>}</Card>
      <Card title={labels.sla} icon={<CalendarClock className="h-5 w-5 text-teal" />}><p className={`text-lg font-semibold ${slaState === labels.overdue ? "text-brick" : "text-ink"}`}>{slaState}</p><div className="mt-4 space-y-3"><Field label={labels.due} value={date(dueTime, locale)} /><Field label={labels.firstResponse} value={date(complaint.first_response_at, locale)} /><Field label={labels.resolved} value={date(complaint.resolved_at, locale)} /><Field label={labels.closed} value={date(complaint.closed_at, locale)} /></div>{complaint.status === "waiting_citizen" && <p className="mt-4 rounded-lg bg-purple-500/10 p-3 text-xs text-purple-700">{labels.waiting}</p>}</Card>
      <Card title={labels.assignment} icon={<UserCheck className="h-5 w-5 text-teal" />}><p className="text-sm font-semibold text-ink">{complaint.assigned_employee?.name ?? labels.unassigned}</p>{complaint.assigned_employee?.email && <p className="mt-1 text-xs text-muted">{complaint.assigned_employee.email}</p>}{(complaint.assignments?.length ?? 0) > 0 && <div className="mt-4 border-t border-line pt-3 text-xs text-muted">{complaint.assignments?.slice().reverse().map((assignment) => <p key={assignment.id} className="mb-2">{assignment.assigned_to?.name ?? "—"} · {date(assignment.assigned_at, locale)}</p>)}</div>}</Card>
      <Card title={labels.location} icon={<MapPin className="h-5 w-5 text-teal" />}><p className="text-sm text-ink">{complaint.address || labels.noData}</p>{complaint.latitude && complaint.longitude && <p className="mt-2 text-xs text-muted">{complaint.latitude}, {complaint.longitude}</p>}{mapUrl && <a className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal hover:underline" href={mapUrl} target="_blank" rel="noreferrer"><MapPin className="h-4 w-4" />{labels.openMap}</a>}</Card>
      {complaint.classification && <Card title={labels.classification} icon={<Building2 className="h-5 w-5 text-teal" />}><Field label={complaint.classification.auto_assigned ? labels.automatic : labels.manual} value={`${Math.round(complaint.classification.confidence * 100)}%`} /><div className="mt-3"><Field label={labels.method} value={complaint.classification.method} /></div></Card>}
      <Card title={labels.technical} icon={<FolderOpen className="h-5 w-5 text-teal" />}><div className="space-y-3"><Field label={labels.complaintId} value={String(complaint.id)} /><Field label={labels.source} value={complaint.source ?? labels.noData} /><Field label={labels.clientRef} value={complaint.client_ref ?? complaint.client_uuid ?? labels.noData} /><Field label={labels.created} value={date(complaint.created_at, locale)} /></div></Card></aside>
    </div>
    {modal && <Dialog title={modal.type === "status" ? actionLabel(modal.action, labels, complaint.status) : modal.type === "assign" ? labels.assign : modal.type === "department" ? labels.changeDepartment : labels.changePriority} onClose={() => !saving && setModal(null)}><div className="mt-5 space-y-4">{modal.type === "status" ? <><p className="text-sm text-muted">{modal.action.requiresResponse ? labels.messageHint : modal.action.destructive ? labels.confirmTerminal : ""}</p>{modal.action.requiresResponse ? <label className="block"><span className="mb-1 block text-sm font-medium text-ink">{labels.message}</span><textarea autoFocus className={inputClass} rows={5} value={note} onChange={(event) => setNote(event.target.value)} disabled={saving} /></label> : <label className="block"><span className="mb-1 block text-sm font-medium text-ink">{labels.actionNote} ({labels.optional})</span><textarea autoFocus className={inputClass} rows={3} value={note} onChange={(event) => setNote(event.target.value)} disabled={saving} /></label>}</> : <>{modal.type === "assign" && <label className="block"><span className="mb-1 block text-sm font-medium text-ink">{labels.assign}</span><select className={inputClass} value={employeeId} onChange={(event) => setEmployeeId(event.target.value)} disabled={lookupsLoading || saving}><option value="">{lookupsLoading ? labels.loading : labels.selectEmployee}</option>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name} · {employee.email}</option>)}</select></label>}{modal.type === "department" && <><label className="block"><span className="mb-1 block text-sm font-medium text-ink">{labels.changeDepartment}</span><select className={inputClass} value={departmentId} onChange={(event) => { setDepartmentId(event.target.value); setCategoryId(""); }} disabled={lookupsLoading || saving}><option value="">{labels.selectDepartment}</option>{departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}</select></label><label className="block"><span className="mb-1 block text-sm font-medium text-ink">{labels.category}</span><select className={inputClass} value={categoryId} onChange={(event) => setCategoryId(event.target.value)} disabled={lookupsLoading || saving || !departmentId}><option value="">{labels.noCategory}</option>{availableCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label></>}{modal.type === "priority" && <label className="block"><span className="mb-1 block text-sm font-medium text-ink">{labels.changePriority}</span><select className={inputClass} value={priorityId} onChange={(event) => setPriorityId(event.target.value)} disabled={lookupsLoading || saving}><option value="">{labels.selectPriority}</option>{priorities.map((priority) => <option key={priority.id} value={priority.id}>{priority.name}</option>)}</select></label>}<label className="block"><span className="mb-1 block text-sm font-medium text-ink">{labels.actionNote} ({labels.optional})</span><textarea className={inputClass} rows={3} value={note} onChange={(event) => setNote(event.target.value)} disabled={saving} /></label></>}{actionError && <p role="alert" className="rounded-lg bg-brick/10 p-3 text-sm text-brick">{actionError}</p>}<div className="flex justify-end gap-2"><button type="button" className={secondaryButtonClass} disabled={saving} onClick={() => setModal(null)}>{labels.cancel}</button><button type="button" className={primaryButtonClass} disabled={saving || lookupsLoading} onClick={() => modal.type === "status" ? void submitStatus(modal.action) : void submitAdmin()}>{saving ? labels.processing : modal.type === "status" ? labels.confirm : labels.save}</button></div></div></Dialog>}
  </main>;
}

function WorkspaceSkeleton({ text }: { text: string }) { return <div className="mx-auto max-w-7xl animate-pulse space-y-5" aria-busy="true"><div className="h-40 rounded-2xl bg-ink/15"/><div className="grid gap-5 xl:grid-cols-[1fr_20rem]"><div className="space-y-5"><div className="h-56 rounded-2xl bg-surface"/><div className="h-64 rounded-2xl bg-surface"/></div><div className="h-80 rounded-2xl bg-surface"/></div><p className="sr-only">{text}</p></div>; }
function StateCard({ title, icon, action }: { title: string; icon: React.ReactNode; action?: React.ReactNode }) { return <main className="flex min-h-[70vh] items-center justify-center p-6"><div className="max-w-md text-center">{icon}<h1 className="mt-4 text-2xl font-semibold text-ink">{title}</h1>{action && <div className="mt-5">{action}</div>}</div></main>; }
