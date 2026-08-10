"use client";

import { useEffect, useState } from "react";
import { reportsApi, ApiError } from "@/lib/api";
import { AutoTable, StatRow } from "@/components/auto-table";

interface SlaPerformanceData {
  by_department?: unknown[];
  by_priority?: unknown[];
  [key: string]: unknown;
}

type SectionKey =
  | "complaintsByStatus"
  | "complaintsByDepartment"
  | "complaintsByPriority"
  | "slaPerformance"
  | "employeePerformance"
  | "slaBreaches";

const sections: {
  key: SectionKey;
  title: string;
  loader: () => Promise<unknown>;
}[] = [
  {
    key: "complaintsByStatus",
    title: "الشكاوى حسب الحالة",
    loader: reportsApi.complaintsByStatus,
  },
  {
    key: "complaintsByDepartment",
    title: "الشكاوى حسب القسم",
    loader: reportsApi.complaintsByDepartment,
  },
  {
    key: "complaintsByPriority",
    title: "الشكاوى حسب الأولوية",
    loader: reportsApi.complaintsByPriority,
  },
  {
    key: "slaPerformance",
    title: "أداء اتفاقية مستوى الخدمة (SLA)",
    loader: reportsApi.slaPerformance,
  },
  {
    key: "employeePerformance",
    title: "أداء الموظفين",
    loader: reportsApi.employeePerformance,
  },
  {
    key: "slaBreaches",
    title: "تجاوزات SLA",
    loader: () => reportsApi.slaBreaches({ per_page: 20 }),
  },
];

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Renders each report's body according to its actual shape from the API. */
function SectionBody({
  sectionKey,
  data,
}: {
  sectionKey: SectionKey;
  data: unknown;
}) {
  if (sectionKey === "slaPerformance" && isPlainObject(data)) {
    const perf = data as SlaPerformanceData;
    return (
      <div>
        <StatRow data={data} />
        {Array.isArray(perf.by_department) && perf.by_department.length > 0 && (
          <div>
            <p className="border-b border-line bg-paper px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted">
              حسب القسم
            </p>
            <div className="overflow-x-auto">
              <AutoTable rows={perf.by_department} />
            </div>
          </div>
        )}
        {Array.isArray(perf.by_priority) && perf.by_priority.length > 0 && (
          <div>
            <p className="border-b border-line bg-paper px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted">
              حسب الأولوية
            </p>
            <div className="overflow-x-auto">
              <AutoTable rows={perf.by_priority} />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (sectionKey === "slaBreaches" && isPlainObject(data)) {
    const complaints = (data as { complaints?: unknown[] }).complaints ?? [];
    return (
      <div className="overflow-x-auto">
        <AutoTable rows={complaints} />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <AutoTable rows={data} />
    </div>
  );
}

export default function ReportsPage() {
  const [data, setData] = useState<Partial<Record<SectionKey, unknown>>>({});
  const [errors, setErrors] = useState<Partial<Record<SectionKey, string>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      sections.map(async (s) => {
        try {
          const result = await s.loader();
          if (!cancelled) setData((prev) => ({ ...prev, [s.key]: result }));
        } catch (err) {
          if (!cancelled) {
            setErrors((prev) => ({
              ...prev,
              [s.key]: err instanceof ApiError ? err.message : "تعذّر التحميل.",
            }));
          }
        }
      }),
    ).finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">التقارير</h1>
      <p className="mt-1 text-sm text-muted">
        مؤشرات تفصيلية عن أداء النظام والموظفين.
      </p>

      {loading && (
        <p className="mt-6 text-sm text-muted">جارٍ تحميل التقارير…</p>
      )}

      <div className="mt-6 space-y-6">
        {sections.map((s) => (
          <div
            key={s.key}
            className="overflow-hidden rounded-lg border border-line bg-surface"
          >
            <div className="border-b border-line bg-paper px-4 py-3">
              <h2 className="text-sm font-semibold text-ink">{s.title}</h2>
            </div>
            {errors[s.key] ? (
              <p className="p-4 text-sm text-brick">{errors[s.key]}</p>
            ) : s.key in data ? (
              <SectionBody sectionKey={s.key} data={data[s.key]} />
            ) : !loading ? (
              <p className="p-4 text-sm text-muted">لا توجد بيانات.</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
