// "use client";

// import { useEffect, useState, use as usePromise } from "react";
// import Link from "next/link";
// import { employeeComplaintsApi, ApiError } from "@/lib/api";
// import type { Complaint, ComplaintStatus } from "@/types/api";
// import { StatusBadge, ALL_STATUSES, statusLabel } from "@/components/status-badge";
// import { inputClass, primaryButtonClass } from "@/components/form-field";

// export default function EmployeeComplaintDetail({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = usePromise(params);
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
//       setComplaint(complaint);
//       setNewStatus(complaint.status);
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

//   async function onUpdateStatus(e: React.FormEvent) {
//     e.preventDefault();
//     if (!newStatus) return;
//     setSaving(true);
//     setSaveError(null);
//     try {
//       await employeeComplaintsApi.updateStatus(id, { status: newStatus, note: note || undefined });
//       setNote("");
//       await load();
//     } catch (err) {
//       setSaveError(err instanceof ApiError ? err.message : "تعذّر تحديث الحالة.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (loading) return <p className="text-sm text-muted">جارٍ التحميل…</p>;
//   if (error) return <p className="text-sm text-brick">{error}</p>;
//   if (!complaint) return null;

//   return (
//     <div>
//       <Link href="/employee" className="text-sm text-muted hover:text-ink">
//         ← رجوع للقائمة
//       </Link>

//       <div className="mt-3 flex items-start justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-ink">{complaint.title}</h1>
//           <p className="mt-1 text-sm text-muted">
//             {complaint.reference_no ? `مرجع #${complaint.reference_no}` : `شكوى #${complaint.id}`}
//           </p>
//         </div>
//         <StatusBadge status={complaint.status} />
//       </div>

//       <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
//         <div className="rounded-lg border border-line bg-surface p-4">
//           <p className="text-xs uppercase tracking-wide text-muted">القسم</p>
//           <p className="mt-1 text-sm font-medium text-ink">{complaint.department?.name ?? "—"}</p>
//         </div>
//         <div className="rounded-lg border border-line bg-surface p-4">
//           <p className="text-xs uppercase tracking-wide text-muted">التصنيف</p>
//           <p className="mt-1 text-sm font-medium text-ink">{complaint.category?.name ?? "—"}</p>
//         </div>
//         <div className="rounded-lg border border-line bg-surface p-4">
//           <p className="text-xs uppercase tracking-wide text-muted">الأولوية</p>
//           <p className="mt-1 text-sm font-medium text-ink">{complaint.priority?.name ?? "—"}</p>
//         </div>
//       </div>

//       <div className="mt-4 rounded-lg border border-line bg-surface p-5">
//         <p className="text-xs uppercase tracking-wide text-muted">الوصف</p>
//         <p className="mt-2 whitespace-pre-wrap text-sm text-ink">{complaint.description}</p>
//       </div>

//       <div className="mt-6 rounded-lg border border-line bg-surface p-5">
//         <h2 className="text-sm font-semibold text-ink">تحديث الحالة</h2>
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
//             placeholder="ملاحظة (اختياري)"
//             value={note}
//             onChange={(e) => setNote(e.target.value)}
//           />
//           {saveError && <p className="text-sm text-brick">{saveError}</p>}
//           <button type="submit" disabled={saving} className={primaryButtonClass}>
//             {saving ? "جارٍ الحفظ…" : "تحديث الحالة"}
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

  return (
    <div>
      <Link href="/employee" className="text-sm text-muted hover:text-ink">
        {t("common.backToList")}
      </Link>

      <div className="mt-3 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{complaint.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {complaint.reference_no
              ? `${t("complaintDetail.reference")} #${complaint.reference_no}`
              : `${t("complaintDetail.complaintHash")} #${complaint.id}`}
          </p>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            {t("complaintDetail.department")}
          </p>
          <p className="mt-1 text-sm font-medium text-ink">
            {complaint.department?.name ?? "—"}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            {t("complaintDetail.category")}
          </p>
          <p className="mt-1 text-sm font-medium text-ink">
            {complaint.category?.name ?? "—"}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">
            {t("complaintDetail.priority")}
          </p>
          <p className="mt-1 text-sm font-medium text-ink">
            {complaint.priority?.name ?? "—"}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-line bg-surface p-5">
        <p className="text-xs uppercase tracking-wide text-muted">
          {t("complaintDetail.description")}
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm text-ink">
          {complaint.description}
        </p>
      </div>

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
