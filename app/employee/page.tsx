"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { employeeComplaintsApi, roleApi, ApiError } from "@/lib/api";

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [status, setStatus] = useState<"checking" | "ok" | "missing">("checking");
  const [pingError, setPingError] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      try {
        await roleApi.employeePing();
      } catch (err) {
        setPingError(err instanceof ApiError ? err.message : "تعذّر التحقق من الصلاحية.");
      }
      try {
        await employeeComplaintsApi.list({ per_page: 1 });
        setStatus("ok");
      } catch {
        // المسار /employee/complaints غير مؤكد بعد — راجع المسارات الفعلية في الـ backend
        setStatus("missing");
      }
    }
    run();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">
        مرحبًا، {user?.name?.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-muted">هذه لوحة عمل الموظف.</p>

      {pingError && (
        <p className="mt-4 rounded-md bg-brick/10 px-3 py-2 text-sm text-brick">{pingError}</p>
      )}

      {status === "checking" && (
        <p className="mt-6 text-sm text-muted">جارٍ التحقق من مسارات الشكاوى…</p>
      )}

      {status === "missing" && (
        <div className="mt-6 rounded-lg border border-amber/30 bg-amber/10 p-5">
          <p className="text-sm font-medium text-ink">مسارات إدارة الشكاوى غير متوفرة بعد</p>
          <p className="mt-1 text-sm text-muted">
            مجموعة Postman التي شاركتها تحتوي فقط على فحص <code>/employee/ping</code> للموظف،
            بدون مسارات فعلية لعرض الشكاوى أو تحديث حالتها أو إسنادها. أضفنا استدعاءً
            مبدئيًا إلى <code>/employee/complaints</code> في <code>lib/api.ts</code> (دالة{" "}
            <code>employeeComplaintsApi</code>) كنقطة بداية — بمجرد أن تزودني بالمسارات
            الحقيقية من الـ backend، سأربط هذه الصفحة بها مباشرة (قائمة الشكاوى، التفاصيل،
            تحديث الحالة).
          </p>
        </div>
      )}

      {status === "ok" && (
        <div className="mt-6 rounded-lg border border-line bg-surface p-5">
          <p className="text-sm text-muted">
            تم الاتصال بمسار الشكاوى بنجاح. الخطوة التالية: بناء جدول عرض الشكاوى المسندة إليك.
          </p>
        </div>
      )}
    </div>
  );
}
