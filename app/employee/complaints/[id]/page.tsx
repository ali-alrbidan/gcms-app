// // "use client";

// // import { useEffect, useState, use as usePromise } from "react";
// // import Link from "next/link";
// // import { employeeComplaintsApi, ApiError } from "@/lib/api";
// // import type { Complaint, ComplaintStatus } from "@/types/api";
// // import { StatusBadge, ALL_STATUSES, statusLabel } from "@/components/status-badge";
// // import { inputClass, primaryButtonClass } from "@/components/form-field";

// // export default function EmployeeComplaintDetail({
// //   params,
// // }: {
// //   params: Promise<{ id: string }>;
// // }) {
// //   const { id } = usePromise(params);
// //   const [complaint, setComplaint] = useState<Complaint | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   const [newStatus, setNewStatus] = useState<ComplaintStatus | "">("");
// //   const [note, setNote] = useState("");
// //   const [saving, setSaving] = useState(false);
// //   const [saveError, setSaveError] = useState<string | null>(null);

// //   async function load() {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const { complaint } = await employeeComplaintsApi.show(id);
// //       setComplaint(complaint);
// //       setNewStatus(complaint.status);
// //     } catch (err) {
// //       setError(err instanceof ApiError ? err.message : "تعذّر تحميل الشكوى.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   useEffect(() => {
// //     load();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [id]);

// //   async function onUpdateStatus(e: React.FormEvent) {
// //     e.preventDefault();
// //     if (!newStatus) return;
// //     setSaving(true);
// //     setSaveError(null);
// //     try {
// //       await employeeComplaintsApi.updateStatus(id, { status: newStatus, note: note || undefined });
// //       setNote("");
// //       await load();
// //     } catch (err) {
// //       setSaveError(err instanceof ApiError ? err.message : "تعذّر تحديث الحالة.");
// //     } finally {
// //       setSaving(false);
// //     }
// //   }

// //   if (loading) return <p className="text-sm text-muted">جارٍ التحميل…</p>;
// //   if (error) return <p className="text-sm text-brick">{error}</p>;
// //   if (!complaint) return null;

// //   return (
// //     <div>
// //       <Link href="/employee" className="text-sm text-muted hover:text-ink">
// //         ← رجوع للقائمة
// //       </Link>

// //       <div className="mt-3 flex items-start justify-between">
// //         <div>
// //           <h1 className="text-2xl font-semibold text-ink">{complaint.title}</h1>
// //           <p className="mt-1 text-sm text-muted">
// //             {complaint.reference_no ? `مرجع #${complaint.reference_no}` : `شكوى #${complaint.id}`}
// //           </p>
// //         </div>
// //         <StatusBadge status={complaint.status} />
// //       </div>

// //       <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
// //         <div className="rounded-lg border border-line bg-surface p-4">
// //           <p className="text-xs uppercase tracking-wide text-muted">القسم</p>
// //           <p className="mt-1 text-sm font-medium text-ink">{complaint.department?.name ?? "—"}</p>
// //         </div>
// //         <div className="rounded-lg border border-line bg-surface p-4">
// //           <p className="text-xs uppercase tracking-wide text-muted">التصنيف</p>
// //           <p className="mt-1 text-sm font-medium text-ink">{complaint.category?.name ?? "—"}</p>
// //         </div>
// //         <div className="rounded-lg border border-line bg-surface p-4">
// //           <p className="text-xs uppercase tracking-wide text-muted">الأولوية</p>
// //           <p className="mt-1 text-sm font-medium text-ink">{complaint.priority?.name ?? "—"}</p>
// //         </div>
// //       </div>

// //       <div className="mt-4 rounded-lg border border-line bg-surface p-5">
// //         <p className="text-xs uppercase tracking-wide text-muted">الوصف</p>
// //         <p className="mt-2 whitespace-pre-wrap text-sm text-ink">{complaint.description}</p>
// //       </div>

// //       <div className="mt-6 rounded-lg border border-line bg-surface p-5">
// //         <h2 className="text-sm font-semibold text-ink">تحديث الحالة</h2>
// //         <form onSubmit={onUpdateStatus} className="mt-3 space-y-3">
// //           <select
// //             className={inputClass}
// //             value={newStatus}
// //             onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
// //           >
// //             {ALL_STATUSES.map((s) => (
// //               <option key={s} value={s}>
// //                 {statusLabel(s)}
// //               </option>
// //             ))}
// //           </select>
// //           <textarea
// //             className={inputClass}
// //             rows={3}
// //             placeholder="ملاحظة (اختياري)"
// //             value={note}
// //             onChange={(e) => setNote(e.target.value)}
// //           />
// //           {saveError && <p className="text-sm text-brick">{saveError}</p>}
// //           <button type="submit" disabled={saving} className={primaryButtonClass}>
// //             {saving ? "جارٍ الحفظ…" : "تحديث الحالة"}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useEffect, useState, use as usePromise } from "react";
// import Link from "next/link";
// import { employeeComplaintsApi, ApiError } from "@/lib/api";
// import type { Complaint, ComplaintStatus } from "@/types/api";
// import {
//   StatusBadge,
//   ALL_STATUSES,
//   useStatusLabel,
// } from "@/components/status-badge";
// import { inputClass, primaryButtonClass } from "@/components/form-field";
// import { useLocale } from "@/lib/locale-context";

// export default function EmployeeComplaintDetail({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = usePromise(params);
//   const { t } = useLocale();
//   const statusLabel = useStatusLabel();

//   const [complaint, setComplaint] = useState<Complaint | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [newStatus, setNewStatus] = useState<ComplaintStatus | "">("");
//   const [note, setNote] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [saveError, setSaveError] = useState<string | null>(null);

//   async function load() {
//     setLoading(true);
//     setError(null);
//     try {
//       const { complaint } = await employeeComplaintsApi.show(id);
//       console.log(complaint);
//       setComplaint(complaint);
//       setNewStatus(complaint.status);
//     } catch (err) {
//       setError(
//         err instanceof ApiError
//           ? err.message
//           : t("complaintDetail.couldNotLoad"),
//       );
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   async function onUpdateStatus(e: React.FormEvent) {
//     e.preventDefault();
//     if (!newStatus) return;
//     setSaving(true);
//     setSaveError(null);
//     try {
//       await employeeComplaintsApi.updateStatus(id, {
//         status: newStatus,
//         note: note || undefined,
//       });
//       setNote("");
//       await load();
//     } catch (err) {
//       setSaveError(
//         err instanceof ApiError
//           ? err.errors?.status?.[0]
//             ? err.errors.status[0]
//             : err.message || t("complaintDetail.statusUpdateFailed")
//           : t("complaintDetail.statusUpdateFailed"),
//       );
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading)
//     return <p className="text-sm text-muted">{t("common.loading")}</p>;
//   if (error) return <p className="text-sm text-brick">{error}</p>;
//   if (!complaint) return null;

//   return (
//     <div>
//       <Link href="/employee" className="text-sm text-muted hover:text-ink">
//         {t("common.backToList")}
//       </Link>

//       <div className="mt-3 flex items-start justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-ink">{complaint.title}</h1>
//           <p className="mt-1 text-sm text-muted">
//             {complaint.reference_no
//               ? `${t("complaintDetail.reference")} #${complaint.reference_no}`
//               : `${t("complaintDetail.complaintHash")} #${complaint.id}`}
//           </p>
//         </div>
//         <StatusBadge status={complaint.status} />
//       </div>

//       <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
//         <div className="rounded-lg border border-line bg-surface p-4">
//           <p className="text-xs uppercase tracking-wide text-muted">
//             {t("complaintDetail.department")}
//           </p>
//           <p className="mt-1 text-sm font-medium text-ink">
//             {complaint.department?.name ?? "—"}
//           </p>
//         </div>
//         <div className="rounded-lg border border-line bg-surface p-4">
//           <p className="text-xs uppercase tracking-wide text-muted">
//             {t("complaintDetail.category")}
//           </p>
//           <p className="mt-1 text-sm font-medium text-ink">
//             {complaint.category?.name ?? "—"}
//           </p>
//         </div>
//         <div className="rounded-lg border border-line bg-surface p-4">
//           <p className="text-xs uppercase tracking-wide text-muted">
//             {t("complaintDetail.priority")}
//           </p>
//           <p className="mt-1 text-sm font-medium text-ink">
//             {complaint.priority?.name ?? "—"}
//           </p>
//         </div>
//       </div>

//       <div className="mt-4 rounded-lg border border-line bg-surface p-5">
//         <p className="text-xs uppercase tracking-wide text-muted">
//           {t("complaintDetail.description")}
//         </p>
//         <p className="mt-2 whitespace-pre-wrap text-sm text-ink">
//           {complaint.description}
//         </p>
//       </div>

//       <div className="mt-6 rounded-lg border border-line bg-surface p-5">
//         <h2 className="text-sm font-semibold text-ink">
//           {t("complaintDetail.updateStatusHeading")}
//         </h2>
//         <form onSubmit={onUpdateStatus} className="mt-3 space-y-3">
//           <select
//             className={inputClass}
//             value={newStatus}
//             onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
//           >
//             {ALL_STATUSES.map((s) => (
//               <option key={s} value={s}>
//                 {statusLabel(s)}
//               </option>
//             ))}
//           </select>
//           <textarea
//             className={inputClass}
//             rows={3}
//             placeholder={`${t("common.note")} (${t("common.optional")})`}
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//           />
//           {saveError && <p className="text-sm text-brick">{saveError}</p>}
//           <button
//             type="submit"
//             disabled={saving}
//             className={primaryButtonClass}
//           >
//             {saving
//               ? t("common.saving")
//               : t("complaintDetail.updateStatusHeading")}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import { employeeComplaintsApi, ApiError } from "@/lib/api";
import type { Complaint, ComplaintStatus } from "@/types/api";
import {
  StatusBadge,
  ALL_STATUSES,
  useStatusLabel,
} from "@/components/status-badge";
import { inputClass, primaryButtonClass } from "@/components/form-field";
import { useLocale } from "@/lib/locale-context";

export default function EmployeeComplaintDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = usePromise(params);
  const { t } = useLocale();
  const statusLabel = useStatusLabel();

  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newStatus, setNewStatus] = useState<ComplaintStatus | "">("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { complaint } = await employeeComplaintsApi.show(id);
      console.log(complaint);
      setComplaint(complaint);
      setNewStatus(complaint.status);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : t("complaintDetail.couldNotLoad"),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function onUpdateStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!newStatus) return;
    setSaving(true);
    setSaveError(null);
    try {
      await employeeComplaintsApi.updateStatus(id, {
        status: newStatus,
        note: note || undefined,
      });
      setNote("");
      await load();
    } catch (err) {
      setSaveError(
        err instanceof ApiError
          ? err.errors?.status?.[0]
            ? err.errors.status[0]
            : err.message || t("complaintDetail.statusUpdateFailed")
          : t("complaintDetail.statusUpdateFailed"),
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return <p className="text-sm text-muted">{t("common.loading")}</p>;
  if (error) return <p className="text-sm text-brick">{error}</p>;
  if (!complaint) return null;

  // Helper function to format date
  const formatDate = (date: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleString();
  };

  // Helper function to format duration
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Get status color for timeline dot
  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500";
      case "under_review":
        return "bg-yellow-500";
      case "assigned":
        return "bg-purple-500";
      case "in_progress":
        return "bg-indigo-500";
      case "resolved":
        return "bg-green-500";
      case "closed":
        return "bg-gray-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div>
      <Link href="/employee" className="text-sm text-muted hover:text-ink">
        {t("common.backToList")}
      </Link>

      {/* Header with enhanced meta info */}
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{complaint.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
            <p className="text-muted">
              {complaint.complaint_number || `#${complaint.id}`}
            </p>
            <span className="text-line">•</span>
            <p className="text-muted">
              {t("complaintDetail.source")}: {complaint.source || "—"}
            </p>
            <span className="text-line">•</span>
            <p className="text-muted">
              {t("common.createdAt")}: {formatDate(complaint.created_at)}
            </p>
            {complaint.client_ref && (
              <>
                <span className="text-line">•</span>
                <p className="text-muted">
                  {t("complaintDetail.clientRef")}: {complaint.client_ref}
                </p>
              </>
            )}
          </div>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      {/* Main info grid with SLA */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            {t("complaintDetail.department")}
          </p>
          <p className="mt-1 text-sm font-medium text-ink">
            {complaint.department?.name ?? "—"}
          </p>
          {complaint.department?.code && (
            <p className="mt-0.5 text-xs text-muted">
              {complaint.department.code}
            </p>
          )}
        </div>
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            {t("complaintDetail.category")}
          </p>
          <p className="mt-1 text-sm font-medium text-ink">
            {complaint.category?.name ?? "—"}
          </p>
          {complaint.category?.code && (
            <p className="mt-0.5 text-xs text-muted">
              {complaint.category.code}
            </p>
          )}
        </div>
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            {t("complaintDetail.priority")}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: complaint.priority?.color || "#gray" }}
            />
            <p className="text-sm font-medium text-ink">
              {complaint.priority?.name ?? "—"}
            </p>
          </div>
          {complaint.priority?.level && (
            <p className="mt-0.5 text-xs text-muted">
              {t("complaintDetail.level")}: {complaint.priority.level}
            </p>
          )}
        </div>
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            {t("complaintDetail.slaDue")}
          </p>
          <p
            className={`mt-1 text-sm font-medium ${
              complaint.is_sla_breached ? "text-brick" : "text-green-600"
            }`}
          >
            {complaint.sla_due_at ? formatDate(complaint.sla_due_at) : "—"}
          </p>
          {complaint.is_sla_breached && (
            <p className="mt-1 flex items-center gap-1 text-xs text-brick">
              <span>⚠️</span> {t("complaintDetail.slaBreached")}
            </p>
          )}
          {complaint.resolved_at && (
            <p className="mt-1 text-xs text-muted">
              {t("complaintDetail.resolvedAt")}:{" "}
              {formatDate(complaint.resolved_at)}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mt-4 rounded-lg border border-line bg-surface p-5">
        <p className="text-xs uppercase tracking-wide text-muted">
          {t("complaintDetail.description")}
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm text-ink">
          {complaint.description}
        </p>
      </div>

      {/* Location Information */}
      <div className="mt-4 rounded-lg border border-line bg-surface p-5">
        <p className="text-xs uppercase tracking-wide text-muted">
          {t("complaintDetail.location")}
        </p>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted">{t("complaintDetail.address")}</p>
            <p className="text-sm text-ink">{complaint.address || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted">
              {t("complaintDetail.coordinates")}
            </p>
            <p className="text-sm font-mono text-ink">
              {complaint.latitude && complaint.longitude
                ? `${complaint.latitude}, ${complaint.longitude}`
                : "—"}
            </p>
            {complaint.latitude && complaint.longitude && (
              <a
                href={`https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-xs text-primary hover:underline"
              >
                📍 {t("complaintDetail.viewOnMap")}
              </a>
            )}
          </div>
        </div>
        {complaint.location && (
          <div className="mt-2 text-xs text-muted">
            {t("complaintDetail.fullLocation")}:{" "}
            {JSON.stringify(complaint.location)}
          </div>
        )}
      </div>

      {/* Classification Information */}
      {complaint.classification_confidence && (
        <div className="mt-4 rounded-lg border border-line bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-muted">
            {t("complaintDetail.classification")}
          </p>
          <div className="mt-2">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-primary transition-all duration-500"
                    style={{
                      width: `${Math.round(parseFloat(complaint.classification_confidence) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <p className="text-sm font-medium text-ink">
                {Math.round(
                  parseFloat(complaint.classification_confidence) * 100,
                )}
                %
              </p>
            </div>
            {complaint.classification && (
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                <span>
                  {t("complaintDetail.classificationMethod")}:{" "}
                  {complaint.classification.method || "—"}
                </span>
                <span className="text-line">|</span>
                <span>
                  {t("complaintDetail.autoAssigned")}:{" "}
                  {complaint.classification.auto_assigned ? "✅" : "❌"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attachments */}
      {complaint.attachments && complaint.attachments.length > 0 && (
        <div className="mt-4 rounded-lg border border-line bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-muted">
            {t("complaintDetail.attachments")} ({complaint.attachments.length})
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {complaint.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/20"
              >
                <span>📎</span>
                {attachment.name ||
                  `${t("complaintDetail.attachment")} ${index + 1}`}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Assigned Employee Info */}
      {complaint.assigned_employee && (
        <div className="mt-4 rounded-lg border border-line bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-muted">
            {t("complaintDetail.assignedTo")}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1">
            <p className="text-sm font-medium text-ink">
              {complaint.assigned_employee.name}
            </p>
            {complaint.assigned_employee.email && (
              <a
                href={`mailto:${complaint.assigned_employee.email}`}
                className="text-sm text-primary hover:underline"
              >
                📧 {complaint.assigned_employee.email}
              </a>
            )}
            {complaint.assigned_employee.phone && (
              <a
                href={`tel:${complaint.assigned_employee.phone}`}
                className="text-sm text-primary hover:underline"
              >
                📞 {complaint.assigned_employee.phone}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Citizen Info */}
      {complaint.citizen && (
        <div className="mt-4 rounded-lg border border-line bg-surface p-5">
          <p className="text-xs uppercase tracking-wide text-muted">
            {t("complaintDetail.citizen")}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1">
            <p className="text-sm font-medium text-ink">
              {complaint.citizen.name}
            </p>
            {complaint.citizen.email && (
              <a
                href={`mailto:${complaint.citizen.email}`}
                className="text-sm text-primary hover:underline"
              >
                📧 {complaint.citizen.email}
              </a>
            )}
            {complaint.citizen.phone && (
              <a
                href={`tel:${complaint.citizen.phone}`}
                className="text-sm text-primary hover:underline"
              >
                📞 {complaint.citizen.phone}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Timeline / Status History */}
      {complaint.timeline && complaint.timeline.length > 0 && (
        <div className="mt-6 rounded-lg border border-line bg-surface p-5">
          <h2 className="text-sm font-semibold text-ink">
            {t("complaintDetail.timeline")}
          </h2>
          <div className="mt-4 space-y-6">
            {complaint.timeline.map((event, index) => (
              <div key={event.id} className="relative flex gap-4">
                {index < (complaint.timeline?.length || 0) - 1 && (
                  <div className="absolute left-[9px] top-6 h-full w-0.5 bg-line" />
                )}
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${getStatusColor(
                    event.to_status || "submitted",
                  )} ring-4 ring-surface`}
                >
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-ink">
                      {event.to_status
                        ? statusLabel(event.to_status)
                        : t("common.submitted")}
                    </p>
                    <p className="text-xs text-muted">
                      {formatDate(event.created_at)}
                    </p>
                  </div>
                  {event.from_status && (
                    <p className="mt-0.5 text-xs text-muted">
                      {t("complaintDetail.from")}:{" "}
                      {statusLabel(event.from_status)}
                    </p>
                  )}
                  {event.note && (
                    <p className="mt-1 text-sm text-muted">💬 {event.note}</p>
                  )}
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                    {event.changed_by && (
                      <span>
                        {t("common.by")}: {event.changed_by}
                      </span>
                    )}
                    {event.duration_minutes && (
                      <>
                        <span className="text-line">|</span>
                        <span>
                          ⏱️ {t("complaintDetail.duration")}:{" "}
                          {formatDuration(event.duration_minutes)}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assignments History */}
      {complaint.assignments && complaint.assignments.length > 0 && (
        <div className="mt-4 rounded-lg border border-line bg-surface p-5">
          <h3 className="text-xs uppercase tracking-wide text-muted">
            {t("complaintDetail.assignmentsHistory")}
          </h3>
          <div className="mt-3 space-y-4">
            {complaint.assignments.map((assignment) => (
              <div key={assignment.id} className="rounded-lg bg-gray-50 p-3 ">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {t("complaintDetail.assignedTo")}:{" "}
                      {assignment.assigned_to?.name}
                    </p>
                    <p className="text-xs text-muted">
                      {t("complaintDetail.assignedBy")}:{" "}
                      {assignment.assigned_by?.name}
                      {assignment.assigned_by?.role && (
                        <span className="ml-1 text-xs text-muted">
                          ({assignment.assigned_by.role})
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-muted">
                    {formatDate(assignment.assigned_at)}
                  </p>
                </div>
                {assignment.department && (
                  <p className="mt-1 text-xs text-muted">
                    {t("complaintDetail.department")}:{" "}
                    {assignment.department.name}
                  </p>
                )}
                {assignment.note && (
                  <p className="mt-1 text-sm text-muted">
                    💬 {assignment.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Update Status Form */}
      <div className="mt-6 rounded-lg border border-line bg-surface p-5">
        <h2 className="text-sm font-semibold text-ink">
          {t("complaintDetail.updateStatusHeading")}
        </h2>
        <form onSubmit={onUpdateStatus} className="mt-3 space-y-3">
          <select
            className={inputClass}
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
          <textarea
            className={inputClass}
            rows={3}
            placeholder={`${t("common.note")} (${t("common.optional")})`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {saveError && <p className="text-sm text-brick">{saveError}</p>}
          <button
            type="submit"
            disabled={saving}
            className={primaryButtonClass}
          >
            {saving
              ? t("common.saving")
              : t("complaintDetail.updateStatusHeading")}
          </button>
        </form>
      </div>
    </div>
  );
}
