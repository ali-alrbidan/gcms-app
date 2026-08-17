"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "@/types/api";
import type { DataTableLabels } from "./data-table-types";

export function paginationPages(current: number, last: number): Array<number | "ellipsis"> {
  if (last <= 7) return Array.from({ length: last }, (_, index) => index + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "ellipsis", last];
  if (current >= last - 3) return [1, "ellipsis", last - 4, last - 3, last - 2, last - 1, last];
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", last];
}

export function DataTablePagination({ meta, labels, onPageChange, onPerPageChange, options = [10, 15, 25, 50] }: { meta: PaginationMeta; labels: DataTableLabels; onPageChange?: (page: number) => void; onPerPageChange?: (perPage: number) => void; options?: number[] }) {
  const pages = paginationPages(meta.current_page, meta.last_page);
  return <footer className="flex flex-col gap-3 border-t border-line px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
    <p className="text-muted">{labels.showing(meta.from ?? 0, meta.to ?? 0, meta.total)}</p>
    <div className="flex flex-wrap items-center gap-2" aria-label={labels.pagination}>
      {onPerPageChange && <label className="flex items-center gap-2 text-xs text-muted">{labels.rowsPerPage}<select aria-label={labels.rowsPerPage} value={meta.per_page} onChange={(event) => onPerPageChange(Number(event.target.value))} className="rounded-md border border-line bg-surface px-2 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-teal">{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>}
      <button type="button" aria-label={labels.previous} disabled={meta.current_page <= 1} onClick={() => onPageChange?.(meta.current_page - 1)} className="inline-flex h-8 items-center gap-1 rounded-md border border-line px-2 text-xs font-medium text-ink hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="h-3.5 w-3.5 rtl:hidden" /><ChevronLeft className="hidden h-3.5 w-3.5 rtl:inline" />{labels.previous}</button>
      <div className="hidden items-center gap-1 sm:flex">{pages.map((item, index) => item === "ellipsis" ? <span key={`ellipsis-${index}`} className="px-1 text-muted">…</span> : <button key={item} type="button" aria-current={item === meta.current_page ? "page" : undefined} onClick={() => onPageChange?.(item)} className={`h-8 min-w-8 rounded-md px-2 text-xs font-medium ${item === meta.current_page ? "bg-teal text-white" : "text-muted hover:bg-paper hover:text-ink"}`}>{item}</button>)}</div>
      <button type="button" aria-label={labels.next} disabled={meta.current_page >= meta.last_page} onClick={() => onPageChange?.(meta.current_page + 1)} className="inline-flex h-8 items-center gap-1 rounded-md border border-line px-2 text-xs font-medium text-ink hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40">{labels.next}<ChevronLeft className="h-3.5 w-3.5 rtl:hidden" /><ChevronRight className="hidden h-3.5 w-3.5 rtl:inline" /></button>
    </div>
  </footer>;
}
