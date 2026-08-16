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

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { complaints } = await employeeComplaintsApi.list({
        per_page: 50,
        ...(statusFilter ? { status: statusFilter } : {}),
      });
      setComplaints(complaints);
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
  }, [statusFilter]);

  return (
    <div>
      <div className="flex items-center justify-between">
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
          onChange={(e) => setStatusFilter(e.target.value)}
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
                    <Link
                      href={`/employee/complaints/${c.id}`}
                      className="font-medium text-ink hover:text-brass hover:underline"
                    >
                      {c.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {c.department?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {c.priority?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
