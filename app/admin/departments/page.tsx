// "use client";

// import { useEffect, useState } from "react";
// import { adminDepartmentsApi, ApiError } from "@/lib/api";
// import type { Department } from "@/types/api";
// import { Modal } from "@/components/modal";
// import {
//   FormField,
//   inputClass,
//   primaryButtonClass,
//   secondaryButtonClass,
//   dangerButtonClass,
// } from "@/components/form-field";

// type FormState = { name: string; code: string; description: string; is_active: boolean };

// const emptyForm: FormState = { name: "", code: "", description: "", is_active: true };

// export default function DepartmentsPage() {
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [editing, setEditing] = useState<Department | null>(null);
//   const [showForm, setShowForm] = useState(false);
//   const [form, setForm] = useState<FormState>(emptyForm);
//   const [saving, setSaving] = useState(false);
//   const [formError, setFormError] = useState<string | null>(null);

//   async function load() {
//     setLoading(true);
//     setError(null);
//     try {
//       const { departments } = await adminDepartmentsApi.list({ per_page: 50 });
//       setDepartments(departments);
//     } catch (err) {
//       setError(err instanceof ApiError ? err.message : "Couldn't load departments.");
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

//   function openEdit(dept: Department) {
//     setEditing(dept);
//     setForm({
//       name: dept.name,
//       code: dept.code,
//       description: dept.description ?? "",
//       is_active: dept.is_active,
//     });
//     setFormError(null);
//     setShowForm(true);
//   }

//   async function onSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setSaving(true);
//     setFormError(null);
//     try {
//       if (editing) {
//         await adminDepartmentsApi.update(editing.id, form);
//       } else {
//         await adminDepartmentsApi.create(form);
//       }
//       setShowForm(false);
//       await load();
//     } catch (err) {
//       setFormError(err instanceof ApiError ? err.message : "Couldn't save department.");
//     } finally {
//       setSaving(false);
//     }
//   }

//   async function onDelete(dept: Department) {
//     if (!confirm(`Delete "${dept.name}"? This can't be undone.`)) return;
//     try {
//       await adminDepartmentsApi.remove(dept.id);
//       await load();
//     } catch (err) {
//       alert(err instanceof ApiError ? err.message : "Couldn't delete department.");
//     }
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-ink">Departments</h1>
//           <p className="mt-1 text-sm text-muted">Departments that complaints are routed to.</p>
//         </div>
//         <button onClick={openCreate} className={primaryButtonClass}>
//           + New department
//         </button>
//       </div>

//       <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
//         {loading ? (
//           <p className="p-6 text-sm text-muted">Loading…</p>
//         ) : error ? (
//           <p className="p-6 text-sm text-brick">{error}</p>
//         ) : departments.length === 0 ? (
//           <p className="p-6 text-sm text-muted">No departments yet. Create the first one.</p>
//         ) : (
//           <table className="w-full text-left text-sm">
//             <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
//               <tr>
//                 <th className="px-4 py-3 font-medium">Name</th>
//                 <th className="px-4 py-3 font-medium">Code</th>
//                 <th className="px-4 py-3 font-medium">Status</th>
//                 <th className="px-4 py-3 font-medium text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {departments.map((dept) => (
//                 <tr key={dept.id} className="border-b border-line last:border-0">
//                   <td className="px-4 py-3 font-medium text-ink">{dept.name}</td>
//                   <td className="px-4 py-3 text-muted">{dept.code}</td>
//                   <td className="px-4 py-3">
//                     <span
//                       className={`rounded-full px-2 py-0.5 text-xs font-medium ${
//                         dept.is_active ? "bg-teal/10 text-teal" : "bg-muted/10 text-muted"
//                       }`}
//                     >
//                       {dept.is_active ? "Active" : "Inactive"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-3 text-right">
//                     <button
//                       onClick={() => openEdit(dept)}
//                       className="mr-2 text-xs font-medium text-brass hover:underline"
//                     >
//                       Edit
//                     </button>
//                     <button onClick={() => onDelete(dept)} className={dangerButtonClass}>
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {showForm && (
//         <Modal title={editing ? "Edit department" : "New department"} onClose={() => setShowForm(false)}>
//           <form onSubmit={onSubmit}>
//             <FormField label="Name">
//               <input
//                 required
//                 className={inputClass}
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//               />
//             </FormField>
//             <FormField label="Code">
//               <input
//                 required
//                 className={inputClass}
//                 value={form.code}
//                 onChange={(e) => setForm({ ...form, code: e.target.value })}
//               />
//             </FormField>
//             <FormField label="Description">
//               <textarea
//                 className={inputClass}
//                 rows={3}
//                 value={form.description}
//                 onChange={(e) => setForm({ ...form, description: e.target.value })}
//               />
//             </FormField>
//             <label className="mb-4 flex items-center gap-2 text-sm text-ink">
//               <input
//                 type="checkbox"
//                 checked={form.is_active}
//                 onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
//               />
//               Active
//             </label>

//             {formError && <p className="mb-3 text-sm text-brick">{formError}</p>}

//             <div className="flex justify-end gap-2">
//               <button type="button" onClick={() => setShowForm(false)} className={secondaryButtonClass}>
//                 Cancel
//               </button>
//               <button type="submit" disabled={saving} className={primaryButtonClass}>
//                 {saving ? "Saving…" : "Save"}
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
import { adminDepartmentsApi, ApiError } from "@/lib/api";
import type { Department } from "@/types/api";
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
  name: string;
  code: string;
  description: string;
  is_active: boolean;
};

const emptyForm: FormState = {
  name: "",
  code: "",
  description: "",
  is_active: true,
};

export default function DepartmentsPage() {
  const { t, tFn } = useLocale();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Department | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const { departments } = await adminDepartmentsApi.list({ per_page: 50 });
      setDepartments(departments);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : t("departments.couldNotLoad"),
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

  function openEdit(dept: Department) {
    setEditing(dept);
    setForm({
      name: dept.name,
      code: dept.code,
      description: dept.description ?? "",
      is_active: dept.is_active,
    });
    setFormError(null);
    setShowForm(true);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await adminDepartmentsApi.update(editing.id, form);
      } else {
        await adminDepartmentsApi.create(form);
      }
      setShowForm(false);
      await load();
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : t("departments.couldNotSave"),
      );
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(dept: Department) {
    const confirmMsg = tFn<[string]>("departments.confirmDelete")(dept.name);
    if (!confirm(confirmMsg)) return;
    try {
      await adminDepartmentsApi.remove(dept.id);
      await load();
    } catch (err) {
      alert(
        err instanceof ApiError ? err.message : t("departments.couldNotDelete"),
      );
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">
            {t("departments.title")}
          </h1>
          <p className="mt-1 text-sm text-muted">{t("departments.subtitle")}</p>
        </div>
        <button onClick={openCreate} className={primaryButtonClass}>
          {t("departments.newItem")}
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
        {loading ? (
          <p className="p-6 text-sm text-muted">{t("common.loading")}</p>
        ) : error ? (
          <p className="p-6 text-sm text-brick">{error}</p>
        ) : departments.length === 0 ? (
          <p className="p-6 text-sm text-muted">{t("departments.noItems")}</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">
                  {t("departments.name")}
                </th>
                <th className="px-4 py-3 font-medium">
                  {t("departments.code")}
                </th>
                <th className="px-4 py-3 font-medium">{t("common.active")}</th>
                <th className="px-4 py-3 font-medium text-right">
                  {t("common.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr
                  key={dept.id}
                  className="border-b border-line last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-ink">
                    {dept.name}
                  </td>
                  <td className="px-4 py-3 text-muted">{dept.code}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        dept.is_active
                          ? "bg-teal/10 text-teal"
                          : "bg-muted/10 text-muted"
                      }`}
                    >
                      {dept.is_active
                        ? t("common.active")
                        : t("common.inactive")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(dept)}
                      className="mr-2 text-xs font-medium text-brass hover:underline"
                    >
                      {t("common.edit")}
                    </button>
                    <button
                      onClick={() => onDelete(dept)}
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

      {showForm && (
        <Modal
          title={
            editing ? t("departments.editTitle") : t("departments.createTitle")
          }
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={onSubmit}>
            <FormField label={t("departments.name")}>
              <input
                required
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>
            <FormField label={t("departments.code")}>
              <input
                required
                className={inputClass}
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </FormField>
            <FormField label={t("departments.description")}>
              <textarea
                className={inputClass}
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
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
              {t("common.active")}
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
