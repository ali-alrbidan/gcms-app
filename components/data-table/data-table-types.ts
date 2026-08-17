import type { ReactNode } from "react";
import type { PaginationMeta } from "@/types/api";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  hideOnMobile?: boolean;
};

export type DataTableLabels = {
  empty: string;
  reset?: string;
  previous: string;
  next: string;
  rowsPerPage: string;
  showing: (from: number, to: number, total: number) => string;
  pagination: string;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  labels: DataTableLabels;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onReset?: () => void;
  meta?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onPerPageChange?: (perPage: number) => void;
  perPageOptions?: number[];
};
