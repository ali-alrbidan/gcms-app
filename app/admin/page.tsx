// "use client";

// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useAuth } from "@/lib/auth-context";
// import { reportsApi, ApiError } from "@/lib/api";
// import type { ReportOverview } from "@/types/api";

// const cards = [
//   { label: "الشكاوى", href: "/admin/complaints", blurb: "عرض جميع الشكاوى وإسنادها وتحديث حالتها." },
//   { label: "التقارير", href: "/admin/reports", blurb: "مؤشرات الأداء واتفاقية مستوى الخدمة." },
//   { label: "الأقسام", href: "/admin/departments", blurb: "الأقسام التي تُوجَّه إليها الشكاوى." },
//   { label: "التصنيفات", href: "/admin/categories", blurb: "تصنيفات الشكاوى لكل قسم." },
//   { label: "الأولويات", href: "/admin/priorities", blurb: "مستويات أولوية الشكاوى وألوانها." },
//   { label: "قواعد SLA", href: "/admin/sla-rules", blurb: "أوقات الاستجابة والحل المستهدفة." },
//   { label: "قواعد التصنيف الآلي", href: "/admin/classification-rules", blurb: "كلمات مفتاحية لتصنيف الشكاوى تلقائيًا." },
//   { label: "سجلات الإشعارات", href: "/admin/notifications", blurb: "متابعة إشعارات البريد والرسائل المرسلة." },
// ];

// const statCards: { key: keyof ReportOverview; label: string }[] = [
//   { key: "total_complaints", label: "إجمالي الشكاوى" },
//   { key: "open_complaints", label: "شكاوى مفتوحة" },
//   { key: "resolved_complaints", label: "شكاوى محلولة" },
//   { key: "overdue_complaints", label: "متجاوزة SLA" },
// ];

// export default function AdminOverviewPage() {
//   const { user } = useAuth();
//   const [overview, setOverview] = useState<ReportOverview | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     reportsApi
//       .overview()
//       .then(setOverview)
//       .catch((err) => setError(err instanceof ApiError ? err.message : null));
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold text-ink">مرحبًا، {user?.name?.split(" ")[0]}</h1>
//       <p className="mt-1 text-sm text-muted">نظرة عامة سريعة، ثم اختر ما تريد إدارته.</p>

//       {overview && !error && (
//         <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
//           {statCards.map((s) => (
//             <div key={s.key} className="rounded-lg border border-line bg-surface p-4">
//               <p className="text-xs uppercase tracking-wide text-muted">{s.label}</p>
//               <p className="mt-1 text-2xl font-semibold text-ink">
//                 {typeof overview[s.key] === "number" ? (overview[s.key] as number) : "—"}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}

//       <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
//         {cards.map((card) => (
//           <Link
//             key={card.href}
//             href={card.href}
//             className="rounded-lg border border-line bg-surface p-5 shadow-sm transition hover:border-brass"
//           >
//             <p className="font-medium text-ink">{card.label}</p>
//             <p className="mt-1 text-sm text-muted">{card.blurb}</p>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useLocale } from "@/lib/locale-context";
import { reportsApi, ApiError } from "@/lib/api";
import type { ReportOverview } from "@/types/api";

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [overview, setOverview] = useState<ReportOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    reportsApi
      .overview()
      .then(setOverview)
      .catch((err) => setError(err instanceof ApiError ? err.message : null));
  }, []);

  const cards = [
    {
      key: "cardComplaints",
      blurbKey: "cardComplaintsBlurb",
      href: "/admin/complaints",
    },
    {
      key: "cardReports",
      blurbKey: "cardReportsBlurb",
      href: "/admin/reports",
    },
    { key: "cardUsers", blurbKey: "cardUsersBlurb", href: "/admin/users" },
    {
      key: "cardDepartments",
      blurbKey: "cardDepartmentsBlurb",
      href: "/admin/departments",
    },
    {
      key: "cardCategories",
      blurbKey: "cardCategoriesBlurb",
      href: "/admin/categories",
    },
    {
      key: "cardPriorities",
      blurbKey: "cardPrioritiesBlurb",
      href: "/admin/priorities",
    },
    {
      key: "cardSlaRules",
      blurbKey: "cardSlaRulesBlurb",
      href: "/admin/sla-rules",
    },
    {
      key: "cardClassification",
      blurbKey: "cardClassificationBlurb",
      href: "/admin/classification-rules",
    },
    {
      key: "cardNotifications",
      blurbKey: "cardNotificationsBlurb",
      href: "/admin/notifications",
    },
  ];

  const statCards: { key: keyof ReportOverview; labelKey: string }[] = [
    { key: "total_complaints", labelKey: "overview.statTotal" },
    { key: "open_complaints", labelKey: "overview.statOpen" },
    { key: "resolved_complaints", labelKey: "overview.statResolved" },
    { key: "overdue_complaints", labelKey: "overview.statOverdue" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">
        {t("overview.welcome")}, {user?.name?.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-muted">{t("overview.subtitle")}</p>

      {overview && !error && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statCards.map((s) => (
            <div
              key={s.key}
              className="rounded-lg border border-line bg-surface p-4"
            >
              <p className="text-xs uppercase tracking-wide text-muted">
                {t(s.labelKey)}
              </p>
              <p className="mt-1 text-2xl font-semibold text-ink">
                {typeof overview[s.key] === "number"
                  ? (overview[s.key] as number)
                  : "—"}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-line bg-surface p-5 shadow-sm transition hover:border-brass"
          >
            <p className="font-medium text-ink">{t(`overview.${card.key}`)}</p>
            <p className="mt-1 text-sm text-muted">
              {t(`overview.${card.blurbKey}`)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
