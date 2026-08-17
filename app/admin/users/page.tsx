"use client";

import { useEffect, useState } from "react";
import { adminUsersApi, lookupsApi, ApiError } from "@/lib/api";
import type { User, UserRole, Department, PaginationMeta } from "@/types/api";
import { useLocale } from "@/lib/locale-context";
import { Modal } from "@/components/modal";
import {
  FormField,
  inputClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/form-field";
import { SharedListPagination } from "@/components/data-table/shared-list-pagination";

type FormState = {
  name: string;
  email: string;
  phone: string;
  national_id: string;
  password: string;
  password_confirmation: string;
  role: UserRole;
  department_id: string;
};

const emptyForm: FormState = {
  name: "",
  email: "",
  phone: "",
  national_id: "",
  password: "",
  password_confirmation: "",
  role: "citizen",
  department_id: "",
};

export default function UsersPage() {
  const { t } = useLocale();

  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [meta, setMeta] = useState<PaginationMeta>();

  const [editing, setEditing] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [{ users, meta }, { departments }] = await Promise.all([
        adminUsersApi.list({
          per_page: perPage, page,
          ...(search ? { search } : {}),
          ...(roleFilter ? { role: roleFilter as UserRole } : {}),
          ...(statusFilter ? { is_active: statusFilter === "active" } : {}),
        }),
        lookupsApi.departments(),
      ]);
      setUsers(users);
      setMeta(meta);
      setDepartments(departments);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Error loading users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter, statusFilter, page, perPage]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setShowForm(true);
  }

  function openEdit(user: User) {
    setEditing(user);
    setForm({
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      national_id: user.national_id ?? "",
      password: "",
      password_confirmation: "",
      role: user.role,
      department_id: user.department ? String(user.department.id) : "",
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
        await adminUsersApi.update(editing.id, {
          name: form.name,
          email: form.email,
          phone: form.phone,
          national_id: form.national_id || undefined,
          role: form.role,
          department_id: form.role === "employee" ? form.department_id : null,
        });
      } else {
        await adminUsersApi.create({
          name: form.name,
          email: form.email,
          phone: form.phone,
          national_id: form.national_id || undefined,
          password: form.password,
          password_confirmation: form.password_confirmation,
          role: form.role,
          ...(form.role === "employee"
            ? { department_id: form.department_id }
            : {}),
          is_active: true,
        });
      }
      setShowForm(false);
      await load();
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Couldn't save user.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function onToggleStatus(user: User) {
    const nextActive = !user.is_active;
    const confirmMsg = nextActive
      ? t("users.confirmActivate")
      : t("users.confirmDeactivate");
    if (!confirm(confirmMsg)) return;
    try {
      await adminUsersApi.updateStatus(user.id, { is_active: nextActive });
      await load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Couldn't update status.");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink">
            {t("users.title")}
          </h1>
          <p className="mt-1 text-sm text-muted">{t("users.subtitle")}</p>
        </div>
        <button onClick={openCreate} className={primaryButtonClass}>
          {t("users.newUser")}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          className={`${inputClass} max-w-xs`}
          placeholder={t("users.searchPlaceholder")}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          className={inputClass}
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
        >
          <option value="">{t("users.allRoles")}</option>
          <option value="citizen">{t("roles.citizen")}</option>
          <option value="employee">{t("roles.employee")}</option>
          <option value="admin">{t("roles.admin")}</option>
        </select>
        <select
          className={inputClass}
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
        >
          <option value="">{t("users.allStatuses")}</option>
          <option value="active">{t("common.active")}</option>
          <option value="inactive">{t("common.inactive")}</option>
        </select>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-line bg-surface">
        {loading ? (
          <p className="p-6 text-sm text-muted">{t("common.loading")}</p>
        ) : error ? (
          <p className="p-6 text-sm text-brick">{error}</p>
        ) : users.length === 0 ? (
          <p className="p-6 text-sm text-muted">{t("common.noData")}</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">{t("users.name")}</th>
                <th className="px-4 py-3 font-medium">{t("users.email")}</th>
                <th className="px-4 py-3 font-medium">{t("users.role")}</th>
                <th className="px-4 py-3 font-medium">
                  {t("users.department")}
                </th>
                <th className="px-4 py-3 font-medium">{t("users.status")}</th>
                <th className="px-4 py-3 font-medium text-right">
                  {t("common.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{u.name}</td>
                  <td className="px-4 py-3 text-muted">{u.email}</td>
                  <td className="px-4 py-3 text-muted">
                    {t(`roles.${u.role}`)}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {u.department?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        u.is_active
                          ? "bg-teal/10 text-teal"
                          : "bg-muted/10 text-muted"
                      }`}
                    >
                      {u.is_active ? t("common.active") : t("common.inactive")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(u)}
                      className="mr-2 text-xs font-medium text-brass hover:underline"
                    >
                      {t("common.edit")}
                    </button>
                    <button
                      onClick={() => onToggleStatus(u)}
                      className="text-xs font-medium text-muted hover:text-ink hover:underline"
                    >
                      {u.is_active
                        ? t("users.deactivate")
                        : t("users.activate")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <SharedListPagination meta={meta} onPageChange={setPage} onPerPageChange={(value) => { setPerPage(value); setPage(1); }} />

      {showForm && (
        <Modal
          title={editing ? t("users.editTitle") : t("users.createTitle")}
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={onSubmit}>
            <FormField label={t("users.name")}>
              <input
                required
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>
            <FormField label={t("users.email")}>
              <input
                type="email"
                required
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </FormField>
            <FormField label={t("users.phone")}>
              <input
                required
                className={inputClass}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </FormField>
            <FormField
              label={`${t("users.nationalId")} (${t("common.optional")})`}
            >
              <input
                className={inputClass}
                value={form.national_id}
                onChange={(e) =>
                  setForm({ ...form, national_id: e.target.value })
                }
              />
            </FormField>
            <FormField label={t("users.role")}>
              <select
                className={inputClass}
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as UserRole })
                }
              >
                <option value="citizen">{t("roles.citizen")}</option>
                <option value="employee">{t("roles.employee")}</option>
                <option value="admin">{t("roles.admin")}</option>
              </select>
            </FormField>
            {form.role === "employee" && (
              <FormField label={t("users.department")}>
                <select
                  required
                  className={inputClass}
                  value={form.department_id}
                  onChange={(e) =>
                    setForm({ ...form, department_id: e.target.value })
                  }
                >
                  <option value="" disabled>
                    {t("users.department")}
                  </option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </FormField>
            )}
            {!editing && (
              <>
                <FormField label={t("users.password")}>
                  <input
                    type="password"
                    required
                    className={inputClass}
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                </FormField>
                <FormField label={t("users.passwordConfirmation")}>
                  <input
                    type="password"
                    required
                    className={inputClass}
                    value={form.password_confirmation}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        password_confirmation: e.target.value,
                      })
                    }
                  />
                </FormField>
              </>
            )}

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
