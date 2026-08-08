"use client";

import { useEffect, useState } from "react";
import { adminSlaRulesApi, lookupsApi, ApiError } from "@/lib/api";
import type { SlaRule, Department, Category, Priority } from "@/types/api";
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
  category_id: string;
  priority_id: string;
  response_time_hours: string;
  resolution_time_hours: string;
  is_active: boolean;
};

const emptyForm: FormState = {
  department_id: "",
  category_id: "",
  priority_id: "",
  response_time_hours: "4",
  resolution_time_hours: "24",
  is_active: true,
};

export default function SlaRulesPage() {
  const [rules, setRules] = useState<SlaRule[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<SlaRule | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [{ sla_rules }, { departments }, { categories }, { priorities }] = await Promise.all([
        adminSlaRulesApi.list({ per_page: 50 }),
        lookupsApi.departments(),
        lookupsApi.categories(),
        lookupsApi.priorities(),
      ]);
      setRules(sla_rules);
      setDepartments(departments);
      setCategories(categories);
      setPriorities(priorities);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذّر تحميل قواعد اتفاقية مستوى الخدمة.");
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

  function openEdit(rule: SlaRule) {
    setEditing(rule);
    setForm({
      department_id: rule.department_id ? String(rule.department_id) : "",
      category_id: rule.category_id ? String(rule.category_id) : "",
      priority_id: String(rule.priority_id),
      response_time_hours: String(rule.response_time_hours),
      resolution_time_hours: String(rule.resolution_time_hours),
      is_active: rule.is_active,
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
        department_id: form.department_id || null,
        category_id: form.category_id || null,
        priority_id: form.priority_id,
        response_time_hours: Number(form.response_time_hours),
        resolution_time_hours: Number(form.resolution_time_hours),
        is_active: form.is_active,
      };
      if (editing) {
        await adminSlaRulesApi.update(editing.id, payload);
      } else {
        await adminSlaRulesApi.create(payload);
      }
      setShowForm(false);
      await load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "تعذّر حفظ القاعدة.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(rule: SlaRule) {
    if (!confirm("حذف هذه القاعدة؟ لا يمكن التراجع عن هذا الإجراء.")) return;
    try {
      await adminSlaRulesApi.remove(rule.id);
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "تعذّر حذف القاعدة.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">قواعد اتفاقية مستوى الخدمة</h1>
          <p className="mt-1 text-sm text-muted">أوقات الاستجابة والحل المستهدفة حسب القسم/التصنيف/الأولوية.</p>
        </div>
        <button onClick={openCreate} className={primaryButtonClass}>
          + قاعدة جديدة
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
        {loading ? (
          <p className="p-6 text-sm text-muted">جارٍ التحميل…</p>
        ) : error ? (
          <p className="p-6 text-sm text-brick">{error}</p>
        ) : rules.length === 0 ? (
          <p className="p-6 text-sm text-muted">لا توجد قواعد بعد.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">القسم</th>
                <th className="px-4 py-3 font-medium">التصنيف</th>
                <th className="px-4 py-3 font-medium">الأولوية</th>
                <th className="px-4 py-3 font-medium">الاستجابة (س)</th>
                <th className="px-4 py-3 font-medium">الحل (س)</th>
                <th className="px-4 py-3 font-medium text-right">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 text-ink">{rule.department?.name ?? "الكل"}</td>
                  <td className="px-4 py-3 text-ink">{rule.category?.name ?? "الكل"}</td>
                  <td className="px-4 py-3 text-ink">{rule.priority?.name}</td>
                  <td className="px-4 py-3 text-muted">{rule.response_time_hours}</td>
                  <td className="px-4 py-3 text-muted">{rule.resolution_time_hours}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(rule)}
                      className="mr-2 text-xs font-medium text-brass hover:underline"
                    >
                      تعديل
                    </button>
                    <button onClick={() => onDelete(rule)} className={dangerButtonClass}>
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
        <Modal title={editing ? "تعديل قاعدة" : "قاعدة جديدة"} onClose={() => setShowForm(false)}>
          <form onSubmit={onSubmit}>
            <FormField label="القسم (اختياري)">
              <select
                className={inputClass}
                value={form.department_id}
                onChange={(e) => setForm({ ...form, department_id: e.target.value })}
              >
                <option value="">كل الأقسام</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="التصنيف (اختياري)">
              <select
                className={inputClass}
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              >
                <option value="">كل التصنيفات</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="الأولوية">
              <select
                required
                className={inputClass}
                value={form.priority_id}
                onChange={(e) => setForm({ ...form, priority_id: e.target.value })}
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
            <FormField label="وقت الاستجابة (ساعات)">
              <input
                type="number"
                required
                min={1}
                className={inputClass}
                value={form.response_time_hours}
                onChange={(e) => setForm({ ...form, response_time_hours: e.target.value })}
              />
            </FormField>
            <FormField label="وقت الحل (ساعات)">
              <input
                type="number"
                required
                min={1}
                className={inputClass}
                value={form.resolution_time_hours}
                onChange={(e) => setForm({ ...form, resolution_time_hours: e.target.value })}
              />
            </FormField>
            <label className="mb-4 flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              مفعّلة
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
