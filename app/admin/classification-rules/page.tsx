// "use client";

// import { useEffect, useState } from "react";
// import { classificationApi, lookupsApi, ApiError } from "@/lib/api";
// import type { ClassificationRule, Department, Category, ClassificationPreviewResult } from "@/types/api";
// import { Modal } from "@/components/modal";
// import {
//   FormField,
//   inputClass,
//   primaryButtonClass,
//   secondaryButtonClass,
//   dangerButtonClass,
// } from "@/components/form-field";

// type FormState = {
//   department_id: string;
//   category_id: string;
//   keyword: string;
//   weight: string;
//   language: string;
//   notes: string;
//   is_active: boolean;
// };

// const emptyForm: FormState = {
//   department_id: "",
//   category_id: "",
//   keyword: "",
//   weight: "1",
//   language: "ar",
//   notes: "",
//   is_active: true,
// };

// export default function ClassificationRulesPage() {
//   const [rules, setRules] = useState<ClassificationRule[]>([]);
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [editing, setEditing] = useState<ClassificationRule | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState<FormState>(emptyForm);
//   const [saving, setSaving] = useState(false);
//   const [formError, setFormError] = useState<string | null>(null);

//   // Preview tool
//   const [previewTitle, setPreviewTitle] = useState("");
//   const [previewDescription, setPreviewDescription] = useState("");
//   const [previewResult, setPreviewResult] = useState<ClassificationPreviewResult | null>(null);
//   const [previewLoading, setPreviewLoading] = useState(false);
//   const [previewError, setPreviewError] = useState<string | null>(null);

//   async function load() {
//     setLoading(true);
//     setError(null);
//     try {
//       const [{ classification_rules }, { departments }, { categories }] = await Promise.all([
//         classificationApi.listRules({ per_page: 50 }),
//         lookupsApi.departments(),
//         lookupsApi.categories(),
//       ]);
//       setRules(classification_rules);
//       setDepartments(departments);
//       setCategories(categories);
//     } catch (err) {
//       setError(err instanceof ApiError ? err.message : "تعذّر تحميل قواعد التصنيف.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   function openCreate() {
//     setEditing(null);
//     setForm(emptyForm);
//     setFormError(null);
//     setShowForm(true);
//   }

//   function openEdit(rule: ClassificationRule) {
//     setEditing(rule);
//     setForm({
//       department_id: String(rule.department_id),
//       category_id: String(rule.category_id),
//       keyword: rule.keyword,
//       weight: String(rule.weight),
//       language: rule.language ?? "ar",
//       notes: rule.notes ?? "",
//       is_active: rule.is_active,
//     });
//     setFormError(null);
//     setShowForm(true);
//   }

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setSaving(true);
//     setFormError(null);
//     try {
//       const payload = { ...form, weight: Number(form.weight) };
//       if (editing) {
//         await classificationApi.updateRule(editing.id, payload);
//       } else {
//         await classificationApi.createRule(payload);
//       }
//       setShowForm(false);
//       await load();
//     } catch (err) {
//       setFormError(err instanceof ApiError ? err.message : "تعذّر حفظ القاعدة.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function onDelete(rule: ClassificationRule) {
//     if (!confirm(`حذف القاعدة "${rule.keyword}"؟`)) return;
//     try {
//       await classificationApi.removeRule(rule.id);
//       await load();
//     } catch (err) {
//       alert(err instanceof ApiError ? err.message : "تعذّر حذف القاعدة.");
//     }
//   }

//   async function onPreview(e: React.FormEvent) {
//     e.preventDefault();
//     setPreviewLoading(true);
//     setPreviewError(null);
//     setPreviewResult(null);
//     try {
//       const result = await classificationApi.preview({
//         title: previewTitle,
//         description: previewDescription,
//       });
//       setPreviewResult(result);
//     } catch (err) {
//       setPreviewError(err instanceof ApiError ? err.message : "تعذّر تنفيذ المعاينة.");
//     } finally {
//       setPreviewLoading(false);
//     }
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-ink">قواعد التصنيف الآلي</h1>
//           <p className="mt-1 text-sm text-muted">كلمات مفتاحية تُستخدم لتصنيف الشكاوى تلقائيًا.</p>
//         </div>
//         <button onClick={openCreate} className={primaryButtonClass}>
//           + قاعدة جديدة
//         </button>
//       </div>

//       <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
//         {loading ? (
//           <p className="p-6 text-sm text-muted">جارٍ التحميل…</p>
//         ) : error ? (
//           <p className="p-6 text-sm text-brick">{error}</p>
//         ) : rules.length === 0 ? (
//           <p className="p-6 text-sm text-muted">لا توجد قواعد بعد.</p>
//         ) : (
//           <table className="w-full text-left text-sm">
//             <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
//               <tr>
//                 <th className="px-4 py-3 font-medium">الكلمة المفتاحية</th>
//                 <th className="px-4 py-3 font-medium">القسم</th>
//                 <th className="px-4 py-3 font-medium">التصنيف</th>
//                 <th className="px-4 py-3 font-medium">الوزن</th>
//                 <th className="px-4 py-3 font-medium text-right">إجراءات</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rules.map((rule) => (
//                 <tr key={rule.id} className="border-b border-line last:border-0">
//                   <td className="px-4 py-3 font-medium text-ink">{rule.keyword}</td>
//                   <td className="px-4 py-3 text-muted">{rule.department?.name ?? "—"}</td>
//                   <td className="px-4 py-3 text-muted">{rule.category?.name ?? "—"}</td>
//                   <td className="px-4 py-3 text-muted">{rule.weight}</td>
//                   <td className="px-4 py-3 text-right">
//                     <button
//                       onClick={() => openEdit(rule)}
//                       className="mr-2 text-xs font-medium text-brass hover:underline"
//                     >
//                       تعديل
//                     </button>
//                     <button onClick={() => onDelete(rule)} className={dangerButtonClass}>
//                       حذف
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       <div className="mt-8 rounded-lg border border-line bg-surface p-5">
//         <h2 className="text-sm font-semibold text-ink">أداة معاينة التصنيف</h2>
//         <p className="mt-1 text-xs text-muted">جرّب عنوان ووصف شكوى لمعرفة كيف سيصنّفها النظام.</p>
//         <form onSubmit={onPreview} className="mt-3 max-w-lg space-y-3">
//           <FormField label="العنوان">
//             <input
//               required
//               className={inputClass}
//               value={previewTitle}
//               onChange={(e) => setPreviewTitle(e.target.value)}
//             />
//           </FormField>
//           <FormField label="الوصف">
//             <textarea
//               required
//               className={inputClass}
//               rows={3}
//               value={previewDescription}
//               onChange={(e) => setPreviewDescription(e.target.value)}
//             />
//           </FormField>
//           {previewError && <p className="text-sm text-brick">{previewError}</p>}
//           <button type="submit" disabled={previewLoading} className={primaryButtonClass}>
//             {previewLoading ? "جارٍ التحليل…" : "معاينة"}
//           </button>
//         </form>
//         {previewResult && (
//           <div className="mt-4 rounded-md bg-paper p-4 text-sm text-ink">
//             <p>
//               <span className="text-muted">القسم المقترح: </span>
//               {previewResult.suggested_department?.name ?? "—"}
//             </p>
//             <p className="mt-1">
//               <span className="text-muted">التصنيف المقترح: </span>
//               {previewResult.suggested_category?.name ?? "—"}
//             </p>
//           </div>
//         )}
//       </div>

//       {showForm && (
//         <Modal title={editing ? "تعديل قاعدة" : "قاعدة جديدة"} onClose={() => setShowForm(false)}>
//           <form onSubmit={onSubmit}>
//             <FormField label="القسم">
//               <select
//                 required
//                 className={inputClass}
//                 value={form.department_id}
//                 onChange={(e) => setForm({ ...form, department_id: e.target.value })}
//               >
//                 <option value="" disabled>
//                   اختر القسم
//                 </option>
//                 {departments.map((d) => (
//                   <option key={d.id} value={d.id}>
//                     {d.name}
//                   </option>
//                 ))}
//               </select>
//             </FormField>
//             <FormField label="التصنيف">
//               <select
//                 required
//                 className={inputClass}
//                 value={form.category_id}
//                 onChange={(e) => setForm({ ...form, category_id: e.target.value })}
//               >
//                 <option value="" disabled>
//                   اختر التصنيف
//                 </option>
//                 {categories
//                   .filter((c) => !form.department_id || String(c.department_id) === form.department_id)
//                   .map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.name}
//                     </option>
//                   ))}
//               </select>
//             </FormField>
//             <FormField label="الكلمة المفتاحية">
//               <input
//                 required
//                 className={inputClass}
//                 value={form.keyword}
//                 onChange={(e) => setForm({ ...form, keyword: e.target.value })}
//               />
//             </FormField>
//             <FormField label="الوزن">
//               <input
//                 type="number"
//                 required
//                 min={1}
//                 className={inputClass}
//                 value={form.weight}
//                 onChange={(e) => setForm({ ...form, weight: e.target.value })}
//               />
//             </FormField>
//             <FormField label="اللغة">
//               <select
//                 className={inputClass}
//                 value={form.language}
//                 onChange={(e) => setForm({ ...form, language: e.target.value })}
//               >
//                 <option value="ar">العربية</option>
//                 <option value="en">الإنجليزية</option>
//               </select>
//             </FormField>
//             <FormField label="ملاحظات (اختياري)">
//               <textarea
//                 className={inputClass}
//                 rows={2}
//                 value={form.notes}
//                 onChange={(e) => setForm({ ...form, notes: e.target.value })}
//               />
//             </FormField>
//             <label className="mb-4 flex items-center gap-2 text-sm text-ink">
//               <input
//                 type="checkbox"
//                 checked={form.is_active}
//                 onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
//               />
//               مفعّلة
//             </label>

//             {formError && <p className="mb-3 text-sm text-brick">{formError}</p>}

//             <div className="flex justify-end gap-2">
//               <button type="button" onClick={() => setShowForm(false)} className={secondaryButtonClass}>
//                 إلغاء
//               </button>
//               <button type="submit" disabled={saving} className={primaryButtonClass}>
//                 {saving ? "جارٍ الحفظ…" : "حفظ"}
//               </button>
//             </div>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { classificationApi, lookupsApi, ApiError } from "@/lib/api";
import type {
  ClassificationRule,
  Department,
  Category,
  ClassificationPreviewResult,
} from "@/types/api";
import { Modal } from "@/components/modal";
import {
  FormField,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
  dangerButtonClass,
} from "@/components/form-field";
import { useLocale } from "@/lib/locale-context";

type FormState = {
  department_id: string;
  category_id: string;
  keyword: string;
  weight: string;
  language: string;
  notes: string;
  is_active: boolean;
};

const emptyForm: FormState = {
  department_id: "",
  category_id: "",
  keyword: "",
  weight: "1",
  language: "ar",
  notes: "",
  is_active: true,
};

export default function ClassificationRulesPage() {
  const { t, tFn } = useLocale();
  const [rules, setRules] = useState<ClassificationRule[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<ClassificationRule | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [previewTitle, setPreviewTitle] = useState("");
  const [previewDescription, setPreviewDescription] = useState("");
  const [previewResult, setPreviewResult] =
    useState<ClassificationPreviewResult | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [{ classification_rules }, { departments }, { categories }] =
        await Promise.all([
          classificationApi.listRules({ per_page: 50 }),
          lookupsApi.departments(),
          lookupsApi.categories(),
        ]);
      setRules(classification_rules);
      setDepartments(departments);
      setCategories(categories);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : t("classificationRules.couldNotLoad"),
      );
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

  function openEdit(rule: ClassificationRule) {
    setEditing(rule);
    setForm({
      department_id: String(rule.department_id),
      category_id: String(rule.category_id),
      keyword: rule.keyword,
      weight: String(rule.weight),
      language: rule.language ?? "ar",
      notes: rule.notes ?? "",
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
      const payload = { ...form, weight: Number(form.weight) };
      if (editing) {
        await classificationApi.updateRule(editing.id, payload);
      } else {
        await classificationApi.createRule(payload);
      }
      setShowForm(false);
      await load();
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : t("classificationRules.couldNotSave"),
      );
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(rule: ClassificationRule) {
    const confirmMsg = tFn<[string]>("classificationRules.confirmDelete")(
      rule.keyword,
    );
    if (!confirm(confirmMsg)) return;
    try {
      await classificationApi.removeRule(rule.id);
      await load();
    } catch (err) {
      alert(
        err instanceof ApiError
          ? err.message
          : t("classificationRules.couldNotDelete"),
      );
    }
  }

  async function onPreview(e: React.FormEvent) {
    e.preventDefault();
    setPreviewLoading(true);
    setPreviewError(null);
    setPreviewResult(null);
    try {
      const result = await classificationApi.preview({
        title: previewTitle,
        description: previewDescription,
      });
      setPreviewResult(result);
    } catch (err) {
      setPreviewError(
        err instanceof ApiError
          ? err.message
          : t("classificationRules.previewFailed"),
      );
    } finally {
      setPreviewLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">
            {t("classificationRules.title")}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {t("classificationRules.subtitle")}
          </p>
        </div>
        <button onClick={openCreate} className={primaryButtonClass}>
          {t("classificationRules.newItem")}
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
        {loading ? (
          <p className="p-6 text-sm text-muted">{t("common.loading")}</p>
        ) : error ? (
          <p className="p-6 text-sm text-brick">{error}</p>
        ) : rules.length === 0 ? (
          <p className="p-6 text-sm text-muted">
            {t("classificationRules.noItems")}
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">
                  {t("classificationRules.keyword")}
                </th>
                <th className="px-4 py-3 font-medium">
                  {t("classificationRules.department")}
                </th>
                <th className="px-4 py-3 font-medium">
                  {t("classificationRules.category")}
                </th>
                <th className="px-4 py-3 font-medium">
                  {t("classificationRules.weight")}
                </th>
                <th className="px-4 py-3 font-medium text-right">
                  {t("common.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr
                  key={rule.id}
                  className="border-b border-line last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-ink">
                    {rule.keyword}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {rule.department?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {rule.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">{rule.weight}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(rule)}
                      className="mr-2 text-xs font-medium text-brass hover:underline"
                    >
                      {t("common.edit")}
                    </button>
                    <button
                      onClick={() => onDelete(rule)}
                      className={dangerButtonClass}
                    >
                      {t("common.delete")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-8 rounded-lg border border-line bg-surface p-5">
        <h2 className="text-sm font-semibold text-ink">
          {t("classificationRules.previewTitle")}
        </h2>
        <p className="mt-1 text-xs text-muted">
          {t("classificationRules.previewSubtitle")}
        </p>
        <form onSubmit={onPreview} className="mt-3 max-w-lg space-y-3">
          <FormField label={t("classificationRules.previewTitleLabel")}>
            <input
              required
              className={inputClass}
              value={previewTitle}
              onChange={(e) => setPreviewTitle(e.target.value)}
            />
          </FormField>
          <FormField label={t("classificationRules.previewDescLabel")}>
            <textarea
              required
              className={inputClass}
              rows={3}
              value={previewDescription}
              onChange={(e) => setPreviewDescription(e.target.value)}
            />
          </FormField>
          {previewError && <p className="text-sm text-brick">{previewError}</p>}
          <button
            type="submit"
            disabled={previewLoading}
            className={primaryButtonClass}
          >
            {previewLoading
              ? t("classificationRules.analyzing")
              : t("classificationRules.previewBtn")}
          </button>
        </form>
        {previewResult && (
          <div className="mt-4 rounded-md bg-paper p-4 text-sm text-ink">
            <p>
              <span className="text-muted">
                {t("classificationRules.suggestedDept")}:{" "}
              </span>
              {previewResult.suggested_department?.name ?? "—"}
            </p>
            <p className="mt-1">
              <span className="text-muted">
                {t("classificationRules.suggestedCat")}:{" "}
              </span>
              {previewResult.suggested_category?.name ?? "—"}
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <Modal
          title={
            editing
              ? t("classificationRules.editTitle")
              : t("classificationRules.createTitle")
          }
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={onSubmit}>
            <FormField label={t("classificationRules.department")}>
              <select
                required
                className={inputClass}
                value={form.department_id}
                onChange={(e) =>
                  setForm({ ...form, department_id: e.target.value })
                }
              >
                <option value="" disabled>
                  {t("classificationRules.selectDept")}
                </option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label={t("classificationRules.category")}>
              <select
                required
                className={inputClass}
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
              >
                <option value="" disabled>
                  {t("classificationRules.selectCategory")}
                </option>
                {categories
                  .filter(
                    (c) =>
                      !form.department_id ||
                      String(c.department_id) === form.department_id,
                  )
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </FormField>
            <FormField label={t("classificationRules.keyword")}>
              <input
                required
                className={inputClass}
                value={form.keyword}
                onChange={(e) => setForm({ ...form, keyword: e.target.value })}
              />
            </FormField>
            <FormField label={t("classificationRules.weight")}>
              <input
                type="number"
                required
                min={1}
                className={inputClass}
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
            </FormField>
            <FormField label={t("classificationRules.language")}>
              <select
                className={inputClass}
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
              >
                <option value="ar">{t("classificationRules.arabic")}</option>
                <option value="en">{t("classificationRules.english")}</option>
              </select>
            </FormField>
            <FormField label={t("classificationRules.notes")}>
              <textarea
                className={inputClass}
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </FormField>
            <label className="mb-4 flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />
              {t("classificationRules.activeLabel")}
            </label>

            {formError && (
              <p className="mb-3 text-sm text-brick">{formError}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className={secondaryButtonClass}
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={saving}
                className={primaryButtonClass}
              >
                {saving ? t("common.saving") : t("common.save")}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
