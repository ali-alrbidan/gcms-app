"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import type { DataTableColumn } from "@/components/data-table/data-table-types";
import { ALL_STATUSES, StatusBadge, useStatusLabel } from "@/components/status-badge";
import { adminComplaintsApi, ApiError } from "@/lib/api";
import { useLocale } from "@/lib/locale-context";
import type { Complaint, PaginationMeta } from "@/types/api";

export default function AdminComplaintsPage() {
  const { locale, t } = useLocale(); const statusLabel = useStatusLabel(); const [complaints, setComplaints] = useState<Complaint[]>([]); const [meta, setMeta] = useState<PaginationMeta>(); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null); const [status, setStatus] = useState(""); const [page, setPage] = useState(1); const [perPage, setPerPage] = useState(10);
  const load = async () => { setLoading(true); setError(null); try { const result = await adminComplaintsApi.list({ page, per_page: perPage, ...(status ? { status } : {}) }); setComplaints(result.complaints); setMeta(result.meta); } catch (err) { setError(err instanceof ApiError ? err.message : t("complaints.couldNotLoad")); } finally { setLoading(false); } };
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, status]);
  const columns = useMemo<DataTableColumn<Complaint>[]>(() => [
    { id: "complaint", header: t("complaints.colTitle"), cell: (c) => <Link href={`/complaint-workspace/${c.id}`} className="block max-w-64 hover:text-teal hover:underline"><span className="font-medium text-ink">{c.complaint_number}</span><span className="block truncate text-xs text-muted">{c.title}</span></Link> },
    { id: "department", header: t("complaints.colDepartment"), cell: (c) => <span className="text-muted">{c.department?.name ?? "—"}</span>, hideOnMobile: true },
    { id: "priority", header: t("complaints.colPriority"), cell: (c) => <span className="text-muted">{c.priority?.name ?? "—"}</span>, hideOnMobile: true },
    { id: "assignee", header: t("complaints.colAssignee"), cell: (c) => <span className="text-muted">{c.assigned_employee?.name ?? t("complaints.unassigned")}</span>, hideOnMobile: true },
    { id: "status", header: t("complaints.colStatus"), cell: (c) => <StatusBadge status={c.status} /> },
    { id: "created", header: t("complaints.colCreated"), cell: (c) => <span className="text-xs text-muted">{new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-US", { dateStyle: "medium" }).format(new Date(c.created_at))}</span>, hideOnMobile: true },
  ], [locale, t]);
  return <div className="min-w-0"><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-2xl font-semibold text-ink">{t("complaints.title")}</h1><p className="mt-1 text-sm text-muted">{t("complaints.subtitle")}</p></div><select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal"><option value="">{t("common.all")}</option>{ALL_STATUSES.map((item) => <option key={item} value={item}>{statusLabel(item)}</option>)}</select></div><div className="mt-5"><DataTable columns={columns} rows={complaints} getRowId={(complaint) => complaint.id} loading={loading} error={error} onRetry={() => void load()} meta={meta} onPageChange={setPage} onPerPageChange={(value) => { setPerPage(value); setPage(1); }} labels={{ empty: t("complaints.noComplaints"), previous: t("common.previous"), next: t("common.next"), rowsPerPage: locale === "ar" ? "الصفوف" : "Rows", showing: (from, to, total) => locale === "ar" ? `${from}–${to} من ${total}` : `${from}–${to} of ${total}`, pagination: locale === "ar" ? "ترقيم الصفحات" : "Pagination" }} /></div></div>;
}
