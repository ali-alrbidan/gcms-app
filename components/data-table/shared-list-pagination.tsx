"use client";

import { DataTablePagination } from "./data-table-pagination";
import { useLocale } from "@/lib/locale-context";
import type { PaginationMeta } from "@/types/api";
export { pageAfterDelete } from "./pagination-logic";

export function SharedListPagination({ meta, onPageChange, onPerPageChange }: { meta?: PaginationMeta; onPageChange: (page: number) => void; onPerPageChange: (perPage: number) => void }) {
  const { locale, t } = useLocale();
  if (!meta) return null;
  return <DataTablePagination meta={meta} onPageChange={onPageChange} onPerPageChange={onPerPageChange} labels={{ empty: "", reset: "", previous: t("common.previous"), next: t("common.next"), rowsPerPage: locale === "ar" ? "الصفوف" : "Rows", showing: (from, to, total) => locale === "ar" ? `${from}–${to} من ${total}` : `${from}–${to} of ${total}`, pagination: locale === "ar" ? "ترقيم الصفحات" : "Pagination" }} />;
}
