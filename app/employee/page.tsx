// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useAuth } from "@/lib/auth-context";
// import { employeeComplaintsApi, ApiError } from "@/lib/api";
// import type { Complaint } from "@/types/api";
// import { StatusBadge, ALL_STATUSES, statusLabel } from "@/components/status-badge";

// export default function EmployeeDashboard() {
//   const { user } = useAuth();
//   const [complaints, setComplaints] = useState<Complaint[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [statusFilter, setStatusFilter] = useState<string>("");

//   async function load() {
//     setLoading(true);
//     setError(null);
//     try {
//       const { complaints } = await employeeComplaintsApi.list({
//         per_page: 50,
//         ...(statusFilter ? { status: statusFilter } : {}),
//       });
//       setComplaints(complaints);
//     } catch (err) {
//       setError(err instanceof ApiError ? err.message : "تعذّر تحميل الشكاوى.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [statusFilter]);

//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-ink">
//             مرحبًا، {user?.name?.split(" ")[0]}
//           </h1>
//           <p className="mt-1 text-sm text-muted">الشكاوى المتاحة لك للمتابعة.</p>
//         </div>
//         <select
//           className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brass"
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//         >
//           <option value="">كل الحالات</option>
//           {ALL_STATUSES.map((s) => (
//             <option key={s} value={s}>
//               {statusLabel(s)}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
//         {loading ? (
//           <p className="p-6 text-sm text-muted">جارٍ التحميل…</p>
//         ) : error ? (
//           <p className="p-6 text-sm text-brick">{error}</p>
//         ) : complaints.length === 0 ? (
//           <p className="p-6 text-sm text-muted">لا توجد شكاوى مسندة إليك حاليًا.</p>
//         ) : (
//           <table className="w-full text-left text-sm">
//             <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
//               <tr>
//                 <th className="px-4 py-3 font-medium">العنوان</th>
//                 <th className="px-4 py-3 font-medium">القسم</th>
//                 <th className="px-4 py-3 font-medium">الأولوية</th>
//                 <th className="px-4 py-3 font-medium">الحالة</th>
//                 <th className="px-4 py-3 font-medium">تاريخ الإنشاء</th>
//               </tr>
//             </thead>
//             <tbody>
//               {complaints.map((c) => (
//                 <tr key={c.id} className="border-b border-line last:border-0 hover:bg-paper">
//                   <td className="px-4 py-3">
//                     <Link
//                       href={`/employee/complaints/${c.id}`}
//                       className="font-medium text-ink hover:text-brass hover:underline"
//                     >
//                       {c.title}
//                     </Link>
//                   </td>
//                   <td className="px-4 py-3 text-muted">{c.department?.name ?? "—"}</td>
//                   <td className="px-4 py-3 text-muted">{c.priority?.name ?? "—"}</td>
//                   <td className="px-4 py-3">
//                     <StatusBadge status={c.status} />
//                   </td>
//                   <td className="px-4 py-3 text-muted">
//                     {new Date(c.created_at).toLocaleDateString("ar")}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { employeeComplaintsApi, ApiError } from "@/lib/api";
import type { Complaint } from "@/types/api";
import {
  StatusBadge,
  ALL_STATUSES,
  useStatusLabel,
} from "@/components/status-badge";
import { useLocale } from "@/lib/locale-context";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const { t } = useLocale();
  const statusLabel = useStatusLabel();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { complaints, meta } = await employeeComplaintsApi.list({
        per_page: 50,
        page,
        scope: "assigned_to_me",
        ...(statusFilter ? { status: statusFilter } : {}),
      });
      setComplaints(complaints);
      setTotalPages(meta?.last_page ?? 1);
      setTotal(meta?.total ?? complaints.length);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : t("complaints.couldNotLoad"),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, page]);

  function changePage(next: number) {
    setPage(Math.min(Math.max(1, next), totalPages));
  }

  // Helper function to format date
  const formatDate = (date: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
  };

  // Helper function to check if SLA is breached
  const isSlaBreached = (complaint: Complaint) => {
    return complaint.is_sla_breached || false;
  };

  // Helper function to get priority color
  const getPriorityColor = (priority?: { color?: string } | null) => {
    return priority?.color || "#6b7280";
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">
            {t("overview.welcome")}, {user?.name?.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {t("complaints.mySubtitle")}
          </p>
        </div>
        <select
          className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-brass"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">{t("common.all")}</option>
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {statusLabel(s)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
        {loading ? (
          <p className="p-6 text-sm text-muted">{t("common.loading")}</p>
        ) : error ? (
          <p className="p-6 text-sm text-brick">{error}</p>
        ) : complaints.length === 0 ? (
          <p className="p-6 text-sm text-muted">
            {t("complaints.noMyComplaints")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">
                    {t("complaints.colTitle")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("complaints.colDepartment")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("complaints.colPriority")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("complaints.colStatus")}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    SLA
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t("complaints.colCreated")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-line last:border-0 hover:bg-paper"
                  >
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <Link
                          href={`/employee/complaints/${c.id}`}
                          className="font-medium text-ink hover:text-brass hover:underline"
                        >
                          {c.title}
                        </Link>
                        {c.complaint_number && (
                          <span className="text-xs text-muted">
                            #{c.complaint_number}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {c.department?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-3 w-3 rounded-full"
                          style={{ backgroundColor: getPriorityColor(c.priority) }}
                        />
                        <span className="text-muted">
                          {c.priority?.name ?? "—"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3">
                      {isSlaBreached(c) ? (
                        <span className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                          <span>⚠️</span>
                          {t("complaintDetail.slaBreached")}
                        </span>
                      ) : c.sla_due_at ? (
                        <span className="text-xs text-muted">
                          {formatDate(c.sla_due_at)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {formatDate(c.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-3">
            <p className="text-xs text-muted">
              {t("complaints.totalLabel")}: {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => changePage(page - 1)}
                className="rounded-md border border-line bg-white px-3 py-1.5 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-40 hover:bg-paper"
              >
                {t("common.previous")}
              </button>
              <span className="text-xs text-muted">
                {t("complaints.pageLabel")} {page} {t("complaints.ofLabel")}{" "}
                {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => changePage(page + 1)}
                className="rounded-md border border-line bg-white px-3 py-1.5 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-40 hover:bg-paper"
              >
                {t("common.next")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
