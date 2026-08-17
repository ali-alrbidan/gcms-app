"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { DataTablePagination } from "./data-table-pagination";
import type { DataTableProps } from "./data-table-types";

export function DataTable<T>({ columns, rows, getRowId, labels, loading, error, onRetry, onReset, meta, onPageChange, onPerPageChange, perPageOptions }: DataTableProps<T>) {
  return <section className="min-w-0 overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
    <div className="min-w-0 overflow-x-auto" data-table-scroll>
      <table className="w-full min-w-[38rem] text-start text-sm"><thead className="border-b border-line bg-paper/80 text-xs font-medium text-muted"><tr>{columns.map((column) => <th key={column.id} scope="col" className={`h-11 px-4 text-start font-medium ${column.hideOnMobile ? "hidden md:table-cell" : ""} ${column.className ?? ""}`}>{column.header}</th>)}</tr></thead>
        <tbody>{loading ? Array.from({ length: 10 }).map((_, row) => <tr key={row} className="border-b border-line last:border-0">{columns.map((column, index) => <td key={column.id} className={`h-12 px-4 ${column.hideOnMobile ? "hidden md:table-cell" : ""}`}><span className={`block h-3 animate-pulse rounded bg-line/60 ${index === 0 ? "w-3/4" : "w-1/2"}`} /></td>)}</tr>) : error ? <tr><td colSpan={columns.length} className="p-8 text-center"><div role="alert" className="mx-auto flex max-w-md flex-col items-center gap-3 text-sm text-brick"><AlertCircle className="h-5 w-5" /><span>{error}</span>{onRetry && <button type="button" onClick={onRetry} className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-1.5 text-ink hover:bg-paper"><RefreshCw className="h-4 w-4" />{labels.reset ?? "Retry"}</button>}</div></td></tr> : rows.length === 0 ? <tr><td colSpan={columns.length} className="p-10 text-center text-sm text-muted"><p>{labels.empty}</p>{onReset && labels.reset && <button type="button" onClick={onReset} className="mt-3 text-sm font-medium text-teal hover:underline">{labels.reset}</button>}</td></tr> : rows.map((row) => <tr key={getRowId(row)} className="border-b border-line last:border-0 transition-colors hover:bg-teal/[0.035]">{columns.map((column) => <td key={column.id} className={`h-12 px-4 align-middle ${column.hideOnMobile ? "hidden md:table-cell" : ""} ${column.className ?? ""}`}>{column.cell(row)}</td>)}</tr>)}</tbody>
      </table>
    </div>
    {meta && <DataTablePagination meta={meta} labels={labels} onPageChange={onPageChange} onPerPageChange={onPerPageChange} options={perPageOptions} />}
  </section>;
}
