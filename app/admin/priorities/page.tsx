"use client";

import { useEffect, useState } from "react";
import { adminPrioritiesApi, ApiError } from "@/lib/api";
import type { Priority } from "@/types/api";
import { Modal } from "@/components/modal";
import {
  FormField,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
  dangerButtonClass,
} from "@/components/form-field";

type FormState = { name: string; code: string; level: string; color: string; description: string };

const emptyForm: FormState = { name: "", code: "", level: "1", color: "#A9782D", description: "" };

export default function PrioritiesPage() {
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Priority | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { priorities } = await adminPrioritiesApi.list({ per_page: 50 });
      setPriorities(priorities);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "تعذّر تحميل الأولويات.");
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

  function openEdit(p: Priority) {
    setEditing(p);
    setForm({
      name: p.name,
      code: p.code,
      level: String(p.level),
      color: p.color ?? "#A9782D",
      description: p.description ?? "",
    });
    setFormError(null);
    setShowForm(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const payload = { ...form, level: Number(form.level) };
      if (editing) {
        await adminPrioritiesApi.update(editing.id, payload);
      } else {
        await adminPrioritiesApi.create(payload);
      }
      setShowForm(false);
      await load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "تعذّر حفظ الأولوية.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(p: Priority) {
    if (!confirm(`حذف "${p.name}"؟ لا يمكن التراجع عن هذا الإجراء.`)) return;
    try {
      await adminPrioritiesApi.remove(p.id);
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "تعذّر حذف الأولوية.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">الأولويات</h1>
          <p className="mt-1 text-sm text-muted">مستويات أولوية الشكاوى وألوانها.</p>
        </div>
        <button onClick={openCreate} className={primaryButtonClass}>
          + أولوية جديدة
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
        {loading ? (
          <p className="p-6 text-sm text-muted">جارٍ التحميل…</p>
        ) : error ? (
          <p className="p-6 text-sm text-brick">{error}</p>
        ) : priorities.length === 0 ? (
          <p className="p-6 text-sm text-muted">لا توجد أولويات بعد.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">الاسم</th>
                <th className="px-4 py-3 font-medium">المستوى</th>
                <th className="px-4 py-3 font-medium">اللون</th>
                <th className="px-4 py-3 font-medium text-right">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {priorities.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                  <td className="px-4 py-3 text-muted">{p.level}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block h-4 w-4 rounded-full border border-line align-middle"
                      style={{ backgroundColor: p.color }}
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(p)}
                      className="mr-2 text-xs font-medium text-brass hover:underline"
                    >
                      تعديل
                    </button>
                    <button onClick={() => onDelete(p)} className={dangerButtonClass}>
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
        <Modal title={editing ? "تعديل أولوية" : "أولوية جديدة"} onClose={() => setShowForm(false)}>
          <form onSubmit={onSubmit}>
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
            <FormField label="المستوى">
              <input
                type="number"
                required
                min={1}
                className={inputClass}
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              />
            </FormField>
            <FormField label="اللون">
              <input
                type="color"
                className="h-10 w-16 rounded-md border border-line"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
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
