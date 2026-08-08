"use client";

import { useEffect, useState } from "react";
import { adminCategoriesApi, lookupsApi, ApiError } from "@/lib/api";
import type { Category, Department } from "@/types/api";
import { Modal } from "@/components/modal";
import {
  FormField,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
  dangerButtonClass,
} from "@/components/form-field";

type FormState = {
  department_id: string;
  name: string;
  code: string;
  description: string;
  keywords: string;
  is_active: boolean;
};

const emptyForm: FormState = {
  department_id: "",
  name: "",
  code: "",
  description: "",
  keywords: "",
  is_active: true,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [{ categories }, { departments }] = await Promise.all([
        adminCategoriesApi.list({ per_page: 50 }),
        lookupsApi.departments(),
      ]);
      setCategories(categories);
      setDepartments(departments);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذّر تحميل التصنيفات.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setForm({
      department_id: String(cat.department_id),
      name: cat.name,
      code: cat.code,
      description: cat.description ?? "",
      keywords: (cat.keywords ?? []).join(", "),
      is_active: cat.is_active,
    });
    setFormError(null);
    setShowForm(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload = {
        department_id: form.department_id,
        name: form.name,
        code: form.code,
        description: form.description,
        keywords: form.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        is_active: form.is_active,
      };
      if (editing) {
        await adminCategoriesApi.update(editing.id, payload);
      } else {
        await adminCategoriesApi.create(payload);
      }
      setShowForm(false);
      await load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "تعذّر حفظ التصنيف.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(cat: Category) {
    if (!confirm(`حذف "${cat.name}"؟ لا يمكن التراجع عن هذا الإجراء.`)) return;
    try {
      await adminCategoriesApi.remove(cat.id);
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "تعذّر حذف التصنيف.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">التصنيفات</h1>
          <p className="mt-1 text-sm text-muted">تصنيفات الشكاوى المرتبطة بكل قسم.</p>
        </div>
        <button onClick={openCreate} className={primaryButtonClass}>
          + تصنيف جديد
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
        {loading ? (
          <p className="p-6 text-sm text-muted">جارٍ التحميل…</p>
        ) : error ? (
          <p className="p-6 text-sm text-brick">{error}</p>
        ) : categories.length === 0 ? (
          <p className="p-6 text-sm text-muted">لا توجد تصنيفات بعد. أنشئ أول تصنيف.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">الاسم</th>
                <th className="px-4 py-3 font-medium">القسم</th>
                <th className="px-4 py-3 font-medium">الرمز</th>
                <th className="px-4 py-3 font-medium">الحالة</th>
                <th className="px-4 py-3 font-medium text-right">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{cat.name}</td>
                  <td className="px-4 py-3 text-muted">{cat.department?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{cat.code}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        cat.is_active ? "bg-teal/10 text-teal" : "bg-muted/10 text-muted"
                      }`}
                    >
                      {cat.is_active ? "مفعّل" : "غير مفعّل"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(cat)}
                      className="mr-2 text-xs font-medium text-brass hover:underline"
                    >
                      تعديل
                    </button>
                    <button onClick={() => onDelete(cat)} className={dangerButtonClass}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <Modal title={editing ? "تعديل تصنيف" : "تصنيف جديد"} onClose={() => setShowForm(false)}>
          <form onSubmit={onSubmit}>
            <FormField label="القسم">
              <select
                required
                className={inputClass}
                value={form.department_id}
                onChange={(e) => setForm({ ...form, department_id: e.target.value })}
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
            <FormField label="الاسم">
              <input
                required
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>
            <FormField label="الرمز">
              <input
                required
                className={inputClass}
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </FormField>
            <FormField label="الوصف">
              <textarea
                className={inputClass}
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </FormField>
            <FormField label="كلمات مفتاحية (مفصولة بفاصلة)">
              <input
                className={inputClass}
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                placeholder="مثال: طريق, حفرة, إنارة"
              />
            </FormField>
            <label className="mb-4 flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              مفعّل
            </label>

            {formError && <p className="mb-3 text-sm text-brick">{formError}</p>}

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className={secondaryButtonClass}>
                إلغاء
              </button>
              <button type="submit" disabled={saving} className={primaryButtonClass}>
                {saving ? "جارٍ الحفظ…" : "حفظ"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
