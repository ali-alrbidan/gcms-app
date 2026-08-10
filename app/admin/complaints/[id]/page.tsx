"use client";

import { useEffect, useState, use as usePromise } from "react";
import Link from "next/link";
import { adminComplaintsApi, lookupsApi, ApiError } from "@/lib/api";
import type { Complaint, ComplaintStatus, Department, Category, Priority } from "@/types/api";
import { StatusBadge, ALL_STATUSES, statusLabel } from "@/components/status-badge";
import { FormField, inputClass, primaryButtonClass, secondaryButtonClass } from "@/components/form-field";

export default function AdminComplaintDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeAction, setActiveAction] = useState<"status" | "assign" | "department" | "priority" | null>(
    null
  );
  const [statusValue, setStatusValue] = useState<ComplaintStatus | "">("");
  const [employeeId, setEmployeeId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [priorityId, setPriorityId] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [{ complaint }, { departments }, { categories }, { priorities }] = await Promise.all([
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
      setError(err instanceof ApiError ? err.message : "تعذّر تحميل الشكوى.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function resetActionState() {
    setActiveAction(null);
    setNote("");
    setActionError(null);
  }

  async function onSubmitStatus(e: React.FormEvent) {
    e.preventDefault();
    if (!statusValue) return;
    setSaving(true);
    setActionError(null);
    try {
      await adminComplaintsApi.updateStatus(id, { status: statusValue, note: note || undefined });
      resetActionState();
      await load();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "تعذّر تحديث الحالة.");
    } finally {
      setSaving(false);
    }
  }

  async function onSubmitAssign(e: React.FormEvent) {
    e.preventDefault();
    if (!employeeId) return;
    setSaving(true);
    setActionError(null);
    try {
      await adminComplaintsApi.assign(id, { employee_id: employeeId, note: note || undefined });
      resetActionState();
      setEmployeeId("");
      await load();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "تعذّر إسناد الشكوى.");
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
      resetActionState();
      await load();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "تعذّر تغيير القسم.");
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
      await adminComplaintsApi.changePriority(id, { priority_id: priorityId, note: note || undefined });
      resetActionState();
      await load();
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : "تعذّر تغيير الأولوية.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-muted">جارٍ التحميل…</p>;
  if (error) return <p className="text-sm text-brick">{error}</p>;
  if (!complaint) return null;

  const actionButtons = [
    { key: "status", label: "تحديث الحالة" },
    { key: "assign", label: "إسناد لموظف" },
    { key: "department", label: "تغيير القسم/التصنيف" },
    { key: "priority", label: "تغيير الأولوية" },
  ] as const;

  return (
    <div>
      <Link href="/admin/complaints" className="text-sm text-muted hover:text-ink">
        ← رجوع للقائمة
      </Link>

      <div className="mt-3 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">{complaint.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {complaint.reference_no ? `مرجع #${complaint.reference_no}` : `شكوى #${complaint.id}`}
          </p>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">القسم</p>
          <p className="mt-1 text-sm font-medium text-ink">{complaint.department?.name ?? "—"}</p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">التصنيف</p>
          <p className="mt-1 text-sm font-medium text-ink">{complaint.category?.name ?? "—"}</p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">الأولوية</p>
          <p className="mt-1 text-sm font-medium text-ink">{complaint.priority?.name ?? "—"}</p>
        </div>
        <div className="rounded-lg border border-line bg-surface p-4">
          <p className="text-xs uppercase tracking-wide text-muted">مسندة إلى</p>
          <p className="mt-1 text-sm font-medium text-ink">
            {complaint.assigned_employee?.name ?? "غير مسندة"}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-line bg-surface p-5">
        <p className="text-xs uppercase tracking-wide text-muted">الوصف</p>
        <p className="mt-2 whitespace-pre-wrap text-sm text-ink">{complaint.description}</p>
      </div>

      <div className="mt-6 rounded-lg border border-line bg-surface p-5">
        <h2 className="text-sm font-semibold text-ink">إجراءات</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {actionButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => {
                setActiveAction(btn.key);
                setActionError(null);
              }}
              className={activeAction === btn.key ? primaryButtonClass : secondaryButtonClass}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {activeAction === "status" && (
          <form onSubmit={onSubmitStatus} className="mt-4 max-w-sm space-y-3">
            <FormField label="الحالة الجديدة">
              <select
                className={inputClass}
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value as ComplaintStatus)}
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {statusLabel(s)}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="ملاحظة (اختياري)">
              <textarea className={inputClass} rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
            </FormField>
            {actionError && <p className="text-sm text-brick">{actionError}</p>}
            <button type="submit" disabled={saving} className={primaryButtonClass}>
              {saving ? "جارٍ الحفظ…" : "حفظ"}
            </button>
          </form>
        )}

        {activeAction === "assign" && (
          <form onSubmit={onSubmitAssign} className="mt-4 max-w-sm space-y-3">
            <FormField label="معرّف الموظف (Employee ID)">
              <input
                required
                className={inputClass}
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="مثال: 3"
              />
            </FormField>
            <p className="text-xs text-muted">
              لا يوجد مسار لجلب قائمة الموظفين في الـ API الحالي — أدخل المعرّف يدويًا حتى تتوفر
              نقطة نهاية لقائمة الموظفين.
            </p>
            <FormField label="ملاحظة (اختياري)">
              <textarea className={inputClass} rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
            </FormField>
            {actionError && <p className="text-sm text-brick">{actionError}</p>}
            <button type="submit" disabled={saving} className={primaryButtonClass}>
              {saving ? "جارٍ الحفظ…" : "إسناد"}
            </button>
          </form>
        )}

        {activeAction === "department" && (
          <form onSubmit={onSubmitDepartment} className="mt-4 max-w-sm space-y-3">
            <FormField label="القسم">
              <select
                required
                className={inputClass}
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
              >
                <option value="" disabled>
                  اختر القسم
                </option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="التصنيف (اختياري)">
              <select className={inputClass} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                <option value="">بدون تغيير</option>
                {categories
                  .filter((c) => !departmentId || String(c.department_id) === departmentId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </FormField>
            <FormField label="ملاحظة (اختياري)">
              <textarea className={inputClass} rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
            </FormField>
            {actionError && <p className="text-sm text-brick">{actionError}</p>}
            <button type="submit" disabled={saving} className={primaryButtonClass}>
              {saving ? "جارٍ الحفظ…" : "حفظ"}
            </button>
          </form>
        )}

        {activeAction === "priority" && (
          <form onSubmit={onSubmitPriority} className="mt-4 max-w-sm space-y-3">
            <FormField label="الأولوية">
              <select
                required
                className={inputClass}
                value={priorityId}
                onChange={(e) => setPriorityId(e.target.value)}
              >
                <option value="" disabled>
                  اختر الأولوية
                </option>
                {priorities.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="ملاحظة (اختياري)">
              <textarea className={inputClass} rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
            </FormField>
            {actionError && <p className="text-sm text-brick">{actionError}</p>}
            <button type="submit" disabled={saving} className={primaryButtonClass}>
              {saving ? "جارٍ الحفظ…" : "حفظ"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
