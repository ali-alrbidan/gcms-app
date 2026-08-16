// "use client";

// import { useEffect, useState } from "react";
// import { notificationAdminApi, ApiError } from "@/lib/api";
// import type { NotificationDeliveryLog } from "@/types/api";

// export default function NotificationsPage() {
//   const [logs, setLogs] = useState<NotificationDeliveryLog[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     notificationAdminApi
//       .listDeliveryLogs({ per_page: 50 })
//       .then(({ delivery_logs }) => setLogs(delivery_logs))
//       .catch((err) => setError(err instanceof ApiError ? err.message : "تعذّر تحميل السجلات."))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold text-ink">سجلات الإشعارات</h1>
//       <p className="mt-1 text-sm text-muted">متابعة حالة تسليم إشعارات البريد والرسائل.</p>

//       <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
//         {loading ? (
//           <p className="p-6 text-sm text-muted">جارٍ التحميل…</p>
//         ) : error ? (
//           <p className="p-6 text-sm text-brick">{error}</p>
//         ) : logs.length === 0 ? (
//           <p className="p-6 text-sm text-muted">لا توجد سجلات بعد.</p>
//         ) : (
//           <table className="w-full text-left text-sm">
//             <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
//               <tr>
//                 <th className="px-4 py-3 font-medium">القناة</th>
//                 <th className="px-4 py-3 font-medium">المستلم</th>
//                 <th className="px-4 py-3 font-medium">الحالة</th>
//                 <th className="px-4 py-3 font-medium">التاريخ</th>
//               </tr>
//             </thead>
//             <tbody>
//               {logs.map((log) => (
//                 <tr key={log.id} className="border-b border-line last:border-0">
//                   <td className="px-4 py-3 text-ink">{log.channel ?? "—"}</td>
//                   <td className="px-4 py-3 text-muted">{log.recipient ?? "—"}</td>
//                   <td className="px-4 py-3 text-muted">{log.status ?? "—"}</td>
//                   <td className="px-4 py-3 text-muted">
//                     {log.created_at ? new Date(log.created_at).toLocaleString("ar") : "—"}
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
import { notificationAdminApi, ApiError } from "@/lib/api";
import type { NotificationDeliveryLog } from "@/types/api";
import { useLocale } from "@/lib/locale-context";

export default function NotificationsPage() {
  const { t } = useLocale();
  const [logs, setLogs] = useState<NotificationDeliveryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    notificationAdminApi
      .listDeliveryLogs({ per_page: 50 })
      .then(({ delivery_logs }) => setLogs(delivery_logs))
      .catch((err) =>
        setError(
          err instanceof ApiError
            ? err.message
            : t("notifications.couldNotLoad"),
        ),
      )
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">
        {t("notifications.title")}
      </h1>
      <p className="mt-1 text-sm text-muted">{t("notifications.subtitle")}</p>

      <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
        {loading ? (
          <p className="p-6 text-sm text-muted">{t("common.loading")}</p>
        ) : error ? (
          <p className="p-6 text-sm text-brick">{error}</p>
        ) : logs.length === 0 ? (
          <p className="p-6 text-sm text-muted">{t("notifications.noItems")}</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">
                  {t("notifications.channel")}
                </th>
                <th className="px-4 py-3 font-medium">
                  {t("notifications.recipient")}
                </th>
                <th className="px-4 py-3 font-medium">
                  {t("notifications.status")}
                </th>
                <th className="px-4 py-3 font-medium">
                  {t("notifications.date")}
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">{log.channel ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">
                    {log.recipient ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">{log.status ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">
                    {log.created_at
                      ? new Date(log.created_at).toLocaleString()
                      : "—"}
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
