import type { PaginationMeta } from "@/types/api";

export function pageAfterDelete(meta: PaginationMeta | undefined, visibleRows: number) {
  return meta && meta.current_page > 1 && meta.current_page === meta.last_page && visibleRows <= 1 ? meta.current_page - 1 : null;
}
